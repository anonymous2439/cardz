<template>
    <div>
        <h1>Render Image on Canvas</h1>
        <div v-if="selectedCard">
            <h4>Selected Card: {{ selectedCard.name }}</h4>
            <img :src="selectedCard.imageUris.normal" />
            <ul>
                <li><button @click="gameState.tapCard(selectedCard)">Tap / Untap</button></li>
                <li v-if="!selectedCard.isFaceUp"><button @click="gameState.revealCard(selectedCard)">Face up / Reveal</button></li>
                <li><button @click="gameState.changeZone(selectedCard, 'battlefield', 'graveyard')">To Graveyard</button></li>
                <li><button @click="gameState.changeZone(selectedCard, 'battlefield', 'exile')">To Exile</button></li>
                <li><button @click="gameState.changeZone(selectedCard, 'battlefield', 'hand')">To Hand</button></li>
            </ul>
        </div>
        <div ref="pixiContainer" style="border: 1px solid black;"></div>
    </div>
</template>
  
<script setup lang="ts">
    import { useGameStore } from '~/stores/game';
    import { onMounted, ref, computed, watch } from 'vue';
    import { Application, Assets, Sprite, InteractionEvent } from 'pixi.js';
    import type { GameCard } from '~/types/Card';
    import type { Player } from '~/types/Player';
    
    const gameState = useGameStore();
    const selectedCard = useState<GameCard | null>('selectedCard', () => null)
    const getYourInfo = computed<Player>(() => gameState.getYourInfo);
    const getOpponents = computed(() => gameState.getOpponents);
    
    // Track the currently loaded images and their positions
    const pixiContainer = ref<any>(null);
    const cardSprites = new Map<string, Sprite>();  // A map to track the card sprites by ID
    
    onMounted(async () => {
        let canvasWidth     = 800
        let canvasHeight    = 600
        const app = new Application();
        await app.init({ background: '#1099bb', width: canvasWidth, height: canvasHeight });
    
        pixiContainer.value.appendChild(app.canvas);
    
        const loadYourCards = async () => {

            const battleFieldCardsUpdate = []
        
            try {
                // Remove cards from the battlefield
                for (const [key, sprite] of cardSprites.entries()) {
                    if (key.startsWith(getYourInfo.value.id + '-') && 
                        !getYourInfo.value.zone.battlefield.some(card => getYourInfo.value.id+'-'+card.id === key)) {
                        sprite.destroy();  // Remove from PIXI
                        cardSprites.delete(key);  // Remove from map
                    }
                }

                // Loop through the battlefield cards
                const loadPromises = getYourInfo.value.zone.battlefield.map(async (card) => {

                    const faceUpTexture     = await Assets.load(card.imageUris.small);
                    const faceDownTexture   = await Assets.load('/back-small.JPEG');

                    // Check if the card already exists
                    if (cardSprites.has(getYourInfo.value.id+'-'+card.id)) {
                        const existingCardSprites = cardSprites.get(getYourInfo.value.id+'-'+card.id);

                        if(selectedCard.value && selectedCard.value?.id === card.id && existingCardSprites) {
                            if(card.isTapped)
                                existingCardSprites.rotation = -Math.PI / 2;
                            else
                                existingCardSprites.rotation = 0;
                            
                            existingCardSprites.texture = card.isFaceUp ? faceUpTexture : faceDownTexture;
                        }
                            
                        battleFieldCardsUpdate.push(card)
                        return;
                    }
            
                    // If card does not exist, load and add it
                    const cardTexture = new Sprite(card.isFaceUp ? faceUpTexture : faceDownTexture);
                    app.stage.addChild(cardTexture);
                    cardSprites.set(getYourInfo.value.id+'-'+card.id, cardTexture); // Track the sprite by card id
            
                    cardTexture.anchor.set(0.5);
                    cardTexture.x = card.posX = app.screen.width / 2;
                    cardTexture.y = card.posY = app.screen.height / 2;

                    battleFieldCardsUpdate.push(card)
            
                    // Enable interaction for dragging
                    cardTexture.interactive = true;
                    cardTexture.buttonMode = true;
            
                    let isDragging = false;
                    let offsetX = 0;
                    let offsetY = 0;

                    gameState.broadcastChanges()
            
                    // Handle mouse down (begin dragging)
                    cardTexture.on('pointerdown', (event: InteractionEvent) => {
                        isDragging = true;
                        const position = event.data.getLocalPosition(cardTexture.parent);
                        offsetX = position.x - cardTexture.x;
                        offsetY = position.y - cardTexture.y;
            
                        // Bring the dragged card to the top
                        app.stage.setChildIndex(cardTexture, app.stage.children.length - 1);
                    });
            
                    // Handle mouse move (dragging)
                    cardTexture.on('pointermove', (event: InteractionEvent) => {
                        if (isDragging) {
                            const position = event.data.getLocalPosition(cardTexture.parent);

                            // Calculate new position
                            let newX = position.x - offsetX;
                            let newY = position.y - offsetY;

                            // Clamp within canvas bounds
                            const minX = 0 + (cardTexture.width / 2);
                            const minY = 0 + (cardTexture.height / 2);
                            const maxX = canvasWidth - (cardTexture.width / 2);
                            const maxY = canvasHeight - (cardTexture.height / 2);

                            cardTexture.x = Math.max(minX, Math.min(newX, maxX));
                            cardTexture.y = Math.max(minY, Math.min(newY, maxY));

                            // Update game state
                            getYourInfo.value.zone.battlefield = getYourInfo.value.zone.battlefield.map(item => {
                                if (item.id === card.id) {
                                    item.posX = cardTexture.x;
                                    item.posY = cardTexture.y;
                                    return item;
                                }
                                return item;
                            });

                            gameState.updatePlayer(getYourInfo.value);
                        }
                    });

            
                    // Handle mouse up (stop dragging)
                    cardTexture.on('pointerup', (event: InteractionEvent) => {
                        
                        getYourInfo.value.zone.battlefield = getYourInfo.value.zone.battlefield.map(item => {
                            if(item.id === card.id) {
                                const position = event.data.getLocalPosition(cardTexture.parent);
                                item.posX = position.x - offsetX
                                item.posY = position.y - offsetY
                                selectedCard.value = card as GameCard | null
                                return item
                            }
                            return item
                        })
                        gameState.updatePlayer(getYourInfo.value)

                        isDragging = false;
                    });
            
                    // Handle mouse up outside the card (stop dragging)
                    cardTexture.on('pointerupoutside', () => {
                        isDragging = false;
                    });
                });
        
                await Promise.all(loadPromises);

            } catch (error) {
                console.error(error);
            }
        };


        const loadOpponentsCards = async () => {
            getOpponents.value.forEach(async (opponent) => {

                // Remove cards from the battlefield
                for (const [key, sprite] of cardSprites.entries()) {
                    if (key.startsWith(opponent.id + '-') && 
                        !opponent.zone.battlefield.some(card => opponent.id+'-'+card.id === key)) {
                        sprite.destroy();  // Remove from PIXI
                        cardSprites.delete(key);  // Remove from map
                    }
                }

                try {
                    // Loop through the battlefield cards
                    const loadPromises = opponent.zone.battlefield.map(async (card) => {

                        const faceUpTexture     = await Assets.load(card.imageUris.small);
                        const faceDownTexture   = await Assets.load('/back-small.JPEG');

                        // Check if the card already exists
                        if (cardSprites.has(opponent.id+'-'+card.id)) {
                            const existingCardSprites = cardSprites.get(opponent.id+'-'+card.id);
                            if(existingCardSprites) {
                                existingCardSprites.anchor.set(0.5);
                                existingCardSprites.x = canvasWidth - card.posX
                                existingCardSprites.y = canvasHeight - card.posY

                                if(card.isTapped)
                                    existingCardSprites.rotation = -Math.PI / 2;
                                else
                                    existingCardSprites.rotation = 0;

                                existingCardSprites.texture = card.isFaceUp ? faceUpTexture : faceDownTexture;

                            }
                            
                            return;
                        }

                        // If card does not exist, load and add it
                        const cardTexture = new Sprite(card.isFaceUp ? faceUpTexture : faceDownTexture);
                        app.stage.addChild(cardTexture);
                        cardSprites.set(opponent.id+'-'+card.id, cardTexture); // Track the sprite by card id
                
                        cardTexture.anchor.set(0.5);
                        cardTexture.x = card.posX = app.screen.width / 2;
                        cardTexture.y = card.posY = app.screen.height / 2;

                        // Enable interaction
                        cardTexture.interactive = true;
                        cardTexture.buttonMode = true;

                        let offsetX = 0;
                        let offsetY = 0;

                        // Handle mouse down (begin dragging)
                        cardTexture.on('pointerdown', (event: InteractionEvent) => {
                            const position = event.data.getLocalPosition(cardTexture.parent);
                            offsetX = position.x - cardTexture.x;
                            offsetY = position.y - cardTexture.y;
                
                            // Bring the dragged card to the top
                            app.stage.setChildIndex(cardTexture, app.stage.children.length - 1);
                        });

                        // Handle mouse up (stop dragging)
                        cardTexture.on('pointerup', (event: InteractionEvent) => {
                            
                            getOpponents.value.forEach(opponent => {
                                opponent.zone.battlefield.map(opponentCard => {
                                    if(opponentCard.id === card.id) {
                                        if(opponentCard.isRevealed)
                                            selectedCard.value = card as GameCard | null
                                            else {
                                        selectedCard.value = null
                                    }
                                    }
                                    
                                })
                            })
                            
                        });

                    });
        
                    await Promise.all(loadPromises);

                } catch (error) {
                    console.error(error);
                }
            });
        };
    

        watch(getYourInfo, (newValue) => {
            loadYourCards();
        }, { deep: true, immediate: true });

        watch(getOpponents, (newValue) => {
            loadOpponentsCards();
        }, { deep: true, immediate: true });
    });
</script>
  