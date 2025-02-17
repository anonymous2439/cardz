<template>
    <div>

        <div id="gamefield">
            <section>
                <div class="card-info" v-if="selectedCard">
                    <ul>
                        <li><button @click="gameState.tapCard(selectedCard)">Tap / Untap</button></li>
                        <li v-if="!selectedCard.isFaceUp"><button @click="gameState.revealCard(selectedCard)">Face up / Reveal</button></li>
                        <li><button @click="gameState.changeZone(selectedCard, 'battlefield', 'graveyard')">To Graveyard</button></li>
                        <li><button @click="gameState.changeZone(selectedCard, 'battlefield', 'exile')">To Exile</button></li>
                        <li><button @click="gameState.changeZone(selectedCard, 'battlefield', 'hand')">To Hand</button></li>
                        <li><button @click="addToken">Add Token</button></li>
                        <li><button @click="showAttributes">Attributes</button></li>
                    </ul>
                    <img :src="selectedCard.imageUris.normal" />
                </div>
            </section>
            <section class="pixi-section">
                <div id="pixiContainer" ref="pixiContainer"></div>
            </section>
        </div>

        <ModalsGlobal v-if="modalState.isActive && modalState.type == 'showAttributes' && modalState.data">
            <template #header>
                Select Card Face
            </template>
            
            <template v-if="selectedCard">
                <p>Power: {{ selectedCard.power + selectedCard.powerCounter }} 
                    <button @click="updateStats('power', selectedCard.powerCounter - 1)">-</button>
                    <button @click="updateStats('power', selectedCard.powerCounter + 1)">+</button>
                    <button @click="updateStats('power', 0)">reset</button>
                </p>
                <p>Toughness: {{ selectedCard.toughness + selectedCard.toughnessCounter }} 
                    <button @click="updateStats('toughness', selectedCard.toughnessCounter - 1)">-</button>
                    <button @click="updateStats('toughness', selectedCard.toughnessCounter + 1)">+</button>
                    <button @click="updateStats('toughness', 0)">reset</button>
                </p>
            </template>

            <template #footer>
                <button @click="modalState.isActive = false">Close</button>
            </template>
        </ModalsGlobal>

        <ModalsGlobal v-else-if="modalState.isActive && modalState.type == 'addToken'">
            <template #header>
                Click a token to add to the battlefield
            </template>
            
            <template v-if="selectedCard">
                <ul>
                    <template v-for="(data, index) in modalState.data" :key="index">
                        <li>
                            <img :src="data.imageUris.small" @click="gameState.addToken(data)" />
                        </li>
                    </template>
                </ul>
            </template>

            <template #footer>
                <button @click="modalState.isActive = false">Close</button>
            </template>
        </ModalsGlobal>
    </div>
</template>
  
<script setup lang="ts">
    import { useGameStore } from '~/stores/game';
    import { onMounted, ref, computed, watch } from 'vue';
    import { Application, Assets, Sprite, InteractionEvent, Text, Graphics, Container } from 'pixi.js';
    import type { GameCard, Token } from '~/types/Card';
    import type { Player } from '~/types/Player';
    
    const gameState = useGameStore();
    const selectedCard = useState<GameCard | null>('selectedCard', () => null)
    const getYourInfo = computed<Player>(() => gameState.getYourInfo);
    const getOpponents = computed(() => gameState.getOpponents);
    const modalState: Ref<{isActive: boolean, type: string | null, data: any | null}> = ref({isActive: false, type: null, data: null})
    
    // Track the currently loaded images and their positions
    const pixiContainer = ref<any>(null);
    const cardSprites = new Map<string, Sprite>();  // A map to track the card sprites by ID
    const cardLabels = new Map<string, Container>(); // Track labels for updating

    const showAttributes = () => {
        modalState.value.isActive   = true
        modalState.value.type       = 'showAttributes'
    }

    const updateStats = (type: string, value: number) => {
        if(selectedCard.value) {
            getYourInfo.value.zone.battlefield = getYourInfo.value.zone.battlefield.map(card => {
                if(card.id === selectedCard?.value?.id)  {
                    switch(type) {
                        case 'power':
                            card.powerCounter = value;
                            break;
                        case 'toughness':
                            card.toughnessCounter = value;
                            break;
                    }
                }
                return card;
            })
            gameState.updatePlayer(getYourInfo.value);
        }
    }

    const updateCardLabel = (card: GameCard, cardLabelContainer: Container | undefined, cardSprite: Sprite) => {
        if(cardLabelContainer) {
            if(card.isTapped) {
                const cardWidthHalf = cardSprite.width / 2
                const labelWidthHalf = cardLabelContainer.width / 2
                const cardHeightHalf = cardSprite.height / 2
                cardLabelContainer.x = cardSprite.x + cardHeightHalf - labelWidthHalf;
                cardLabelContainer.y = cardSprite.y - cardWidthHalf + labelWidthHalf;
            }
            else {
                cardLabelContainer.x = cardSprite.x + (cardSprite.width / 2) - (cardLabelContainer.width / 2);
                cardLabelContainer.y = cardSprite.y + (cardSprite.height) / 2 - (cardLabelContainer.height / 2);
            }

            const label = cardLabelContainer.children.find(child => child instanceof Text) as Text | undefined;
            if (label) {
                const labelText = !card.isFaceUp ? `${card.powerCounter}/${card.toughnessCounter}` : `${card.power + card.powerCounter}/${card.toughness + card.toughnessCounter}`
                label.text = labelText;
            }
        }
    };

    const addToken = () => {
        modalState.value.isActive = true
        modalState.value.type = 'addToken'

        modalState.value.data = []
        if(selectedCard.value?.allParts) {
            selectedCard.value.allParts.forEach(async (part: any) => {
                if(part.object === 'related_card' && part.component === 'token') {
                    const response = await fetch(part.uri, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });
                    const data: any = await response.json();
                    const token: Token = {
                        id: data.id,
                        isRevealed: true,
                        isFaceUp: true,
                        isTapped: false,
                        posX: data.power | 0,
                        posY: data.toughness | 0,
                        powerCounter: 0,
                        toughnessCounter: 0,
                        referenceCard: selectedCard.value as GameCard,
                        imageUris: data.image_uris,
                    }
                    modalState.value.data.push(token)
                }
            })
        }
    }
    
    onMounted(async () => {
        let canvasWidth     = 1200
        let canvasHeight    = 950
        const app = new Application();
        await app.init({ background: '#2C3E50', width: canvasWidth, height: canvasHeight });
    
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
                // Remove labels from the battlefield
                for (const [key, text] of cardLabels.entries()) {
                    if (key.startsWith(getYourInfo.value.id + '-') && 
                        !getYourInfo.value.zone.battlefield.some(card => getYourInfo.value.id+'-'+card.id === key)) {
                        text.destroy();  // Remove from PIXI
                        cardLabels.delete(key);  // Remove from map
                    }
                }

                // Loop through the battlefield cards
                const loadPromises = getYourInfo.value.zone.battlefield.map(async (card) => {

                    const faceUpTexture     = await Assets.load(card.imageUris.small);
                    const faceDownTexture   = await Assets.load('/back-small.jpeg');
                    const key               = getYourInfo.value.id + '-' + card.id;

                    // Check if the card already exists
                    if (cardSprites.has(key)) {
                        const existingCardSprites = cardSprites.get(key);

                        if(selectedCard.value && selectedCard.value?.id === card.id && existingCardSprites) {
                            if(card.isTapped) {
                                existingCardSprites.rotation = -Math.PI / 2;
                            }
                            else
                                existingCardSprites.rotation = 0;
                            
                            existingCardSprites.texture = card.isFaceUp ? faceUpTexture : faceDownTexture;

                            if (cardLabels.has(key)) {
                                updateCardLabel(card, cardLabels.get(key), existingCardSprites)
                            }
                        }

                        battleFieldCardsUpdate.push(card)
                        return;
                    }
            
                    // If card does not exist, load and add it
                    const cardTexture = new Sprite(card.isFaceUp ? faceUpTexture : faceDownTexture);
                    app.stage.addChild(cardTexture);
                    cardSprites.set(key, cardTexture); // Track the sprite by card id
            
                    cardTexture.anchor.set(0.5);
                    cardTexture.x = card.posX = app.screen.width / 2;
                    cardTexture.y = card.posY = app.screen.height / 2;

                    // Create a text label below the card
                    const cardLabel = new Text(`${card.power + card.powerCounter}/${card.toughness + card.toughnessCounter}`, {
                        fontSize: 16,
                        fill: 0xffffff, // White text
                        align: "center",
                        fontWeight: "bold",
                    });
                    const cardLabelContainer: Container = getCardLabel(card, cardTexture, cardLabel)
                    cardLabelContainer.x = cardTexture.x + (cardTexture.width / 2) - (cardLabelContainer.width / 2);
                    cardLabelContainer.y = cardTexture.y + (cardTexture.height) / 2 - (cardLabelContainer.height / 2);
                    app.stage.addChild(cardLabelContainer);
                    cardLabels.set(key, cardLabelContainer);

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
                        app.stage.setChildIndex(cardLabelContainer, app.stage.children.length - 1);
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

                            cardLabel.anchor.set(0.5);
                            cardLabelContainer.x = cardTexture.x + cardTexture.width / 2 - 20;
                            cardLabelContainer.y = cardTexture.y + cardTexture.height / 2 - 15;

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
                // Remove labels from the battlefield
                for (const [key, text] of cardLabels.entries()) {
                    if (key.startsWith(opponent.id + '-') && 
                        !opponent.zone.battlefield.some(card => opponent.id+'-'+card.id === key)) {
                        text.destroy();  // Remove from PIXI
                        cardLabels.delete(key);  // Remove from map
                    }
                }

                try {
                    // Loop through the battlefield cards
                    const loadPromises = opponent.zone.battlefield.map(async (card) => {

                        const faceUpTexture     = await Assets.load(card.imageUris.small);
                        const faceDownTexture   = await Assets.load('/back-small.jpeg');
                        const key               = opponent.id + '-' + card.id;

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

                                if (cardLabels.has(key)) {
                                    const cardLabelContainer = cardLabels.get(key);
                                    if(cardLabelContainer) {
                                        updateCardLabel(card, cardLabelContainer, existingCardSprites)
                                    }
                                }
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

                        // Create a text label below the card
                        const labelText = !card.isFaceUp ? `${card.powerCounter}/${card.toughnessCounter}` : `${card.power + card.powerCounter}/${card.toughness + card.toughnessCounter}`
                        const cardLabel = new Text(labelText, {
                            fontSize: 16,
                            fill: 0xffffff, // White text
                            align: "center",
                            fontWeight: "bold",
                        });
                        const cardLabelContainer: Container = getCardLabel(card, cardTexture, cardLabel)
                        cardLabelContainer.x = cardTexture.x + cardTexture.width / 2 - 20;
                        cardLabelContainer.y = cardTexture.y + cardTexture.height / 2 - 15;
                        app.stage.addChild(cardLabelContainer);
                        cardLabels.set(key, cardLabelContainer);

                        // Handle mouse down (begin dragging)
                        cardTexture.on('pointerdown', (event: InteractionEvent) => {
                            const position = event.data.getLocalPosition(cardTexture.parent);
                            offsetX = position.x - cardTexture.x;
                            offsetY = position.y - cardTexture.y;
                
                            // Bring the dragged card to the top
                            app.stage.setChildIndex(cardTexture, app.stage.children.length - 1);
                            app.stage.setChildIndex(cardLabelContainer, app.stage.children.length - 1);
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

        const getCardLabel = (card: GameCard, cardTexture: any, cardLabel: Text): Container => {
            cardLabel.anchor.set(0.5);
            // cardLabel.x = cardTexture.x + cardTexture.width / 2 - 20;
            // cardLabel.y = cardTexture.y + cardTexture.height / 2 - 15;

            // Create a background rectangle
            const background = new Graphics();
            background.beginFill(0x000000); // Red background
            background.drawRect(cardLabel.x - cardLabel.width/2 - 5, cardLabel.y - cardLabel.height/2 - 5, cardLabel.width + 10, cardLabel.height + 10); // Add some padding
            background.endFill();

            // Create a container to group the background and text
            const container = new Container();
            container.addChild(background);
            container.addChild(cardLabel);

            return container
        }
    

        watch(getYourInfo, (newValue) => {
            loadYourCards();
        }, { deep: true, immediate: true });

        watch(getOpponents, (newValue) => {
            loadOpponentsCards();
        }, { deep: true, immediate: true });
    });
</script>
  
<style lang="scss" scoped>
    #gamefield {
        display: flex;
        justify-content: center;
        padding: 52px 24px;
        section {
            &:nth-child(1) {
                order: 1;
                height: 100%;
                min-width: 633px;
            }
            &.pixi-section {
                box-shadow: -2px 9px 28px -2px #1a1a1a;
                width: calc(1200px * 0.65);
                height: calc(950px * 0.65);
            }
            .card-info {
                display: flex;
                ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    li {
                        display: block;
                        position: relative;
                        margin: 0 2px 5px;
                        button {
                            width: 141px;
                            padding: 7px 4px;   
                        }
                    }
                }
            }
        }
    }

    #pixiContainer {
        display: flex;
        transform: scale(0.65);
        transform-origin: top left;
    }
</style>