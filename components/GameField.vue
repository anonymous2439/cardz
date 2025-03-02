<template>
    <div>

        <div id="gamefield">
            <section>
                <template v-if="selectedCard">
                    <div class="card-info">

                        <div class="card-info-options">
                            <!-- all card related options -->
                            <ul>
                                <li><button @click="gameState.untapAllCards()">Untap All</button></li>
                                <li>
                                    <button @click="multiSelectHandler(!multiSelect.isActive)">
                                            Multiselect {{ multiSelect.isActive ? '('+multiSelect.selectedCards.length+')' : '' }}
                                    </button>
                                </li>
                            </ul>

                            <label>Card Options</label>
                            
                            <!-- If selected card is token -->
                            <template v-if="selectedCard.hasOwnProperty('referenceCard')">
                                <ul>
                                    <li><button @click="tapCard()">Tap / Untap</button></li>
                                    <li><button @click="destroyCard()">Destroy</button></li>
                                </ul>
                            </template>
                            
                            <template v-else>
                                <ul>
                                    <li><button @click="tapCard()">Tap / Untap</button></li>
                                    <li v-if="!selectedCard.isFaceUp"><button @click="gameState.revealCard(selectedCard)">Face up / Reveal</button></li>
                                    <li><button @click="changeZone('battlefield', 'graveyard')">To Graveyard</button></li>
                                    <li><button @click="changeZone('battlefield', 'exile')">To Exile</button></li>
                                    <li><button @click="changeZone('battlefield', 'hand')">To Hand</button></li>
                                    <template v-if="!multiSelect.isActive">
                                        <li><button @click="addToken">Add Token</button></li>
                                        <li><button @click="showAttributes">Attributes</button></li>
                                    </template>
                                </ul>
                            </template>

                            
                        </div>

                        <img :src="selectedCard.imageUris.normal" />
                    </div>
                </template>
            </section>
            <section class="pixi-section">
                <div id="pixiContainer" ref="pixiContainer"></div>
            </section>
        </div>

        <ModalsGlobal v-if="modalState.isActive && modalState.type == 'showAttributes'">
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

        <ModalsGlobal v-else-if="modalState.isActive && modalState.type == 'addToken'" class="modal-tokens">
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
    // const selectedCards = useState<GameCard[]>('selectedCards', () => [])
    const getYourInfo = computed<Player>(() => gameState.getYourInfo);
    const getOpponents = computed(() => gameState.getOpponents);
    const modalState: Ref<{isActive: boolean, type: string | null, data: any | null}> = ref({isActive: false, type: null, data: null})
    const multiSelect: Ref<{isActive: boolean, selectedCards: Array<GameCard>}> = ref({isActive:false, selectedCards:[]})
    
    // Track the currently loaded images and their positions
    const pixiContainer = ref<any>(null);
    const cardContainers = new Map<string, Container>();

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
                cardLabelContainer.x = cardSprite.width / 2 - (cardLabelContainer.width / 2)
                cardLabelContainer.y = cardSprite.height / 2 - (cardLabelContainer.height / 2)
                cardLabelContainer.rotation = Math.PI / 2;
            }
            else {
                cardLabelContainer.x = cardSprite.x + (cardSprite.width / 2) - (cardLabelContainer.width / 2);
                cardLabelContainer.y = cardSprite.y + (cardSprite.height) / 2 - (cardLabelContainer.height / 2);
                cardLabelContainer.rotation = 0
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
                        posX: 0,
                        posY: 0,
                        power: parseInt(data.power) | 0,
                        toughness: parseInt(data.toughness) | 0,
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

    const multiSelectHandler = (isActive=true) => {
        multiSelect.value.isActive = isActive
        
        if (!multiSelect.value.isActive) {
            if (multiSelect.value.selectedCards.length) {
                for (const [key, cardContainer] of cardContainers.entries()) {
                    const foundBorder = Array.from(cardContainer.children).find(child => child.name === 'border');
                    
                    if (foundBorder) {
                        foundBorder.destroy?.();
                        cardContainer.removeChild(foundBorder);
                    }
                }
            }
            
            multiSelect.value.selectedCards = []; 
        }
    };


    const tapCard = () => {
        if(multiSelect.value.isActive && multiSelect.value.selectedCards.length) {
            multiSelect.value.selectedCards.forEach(card => {
                gameState.tapCard(card)
            })
            multiSelectHandler(false)
        }
        else if(selectedCard.value) {
            gameState.tapCard(selectedCard.value)
        }
    }

    const changeZone = (fromZone:string, toZone:string) => {
        if(multiSelect.value.isActive && multiSelect.value.selectedCards.length) {
            multiSelect.value.selectedCards.forEach(card => {
                gameState.changeZone(card, fromZone, toZone)
            })
            multiSelectHandler(false)
        }
        else if(selectedCard.value) {
            gameState.changeZone(selectedCard.value, fromZone, toZone)
        }
    }

    const destroyCard = () => {
        if(multiSelect.value.isActive && multiSelect.value.selectedCards.length) {
            multiSelect.value.selectedCards.forEach(card => {
                gameState.destroyCard(card)
            })
            multiSelectHandler(false)
        }
        else if(selectedCard.value) {
            gameState.destroyCard(selectedCard.value)
        }
    }

    const setMultiSelect = (card: GameCard, cardContainer: Container) => {
        if (multiSelect.value.isActive) {
            const index = multiSelect.value.selectedCards.findIndex(item => item.id === card.id);
            const cardTexture = cardContainer.children.find(child => (child.name === 'cardTexture')) as Sprite

            if (index === -1) {
                multiSelect.value.selectedCards.push(card);

                // Add red border to the card container
                const border = new Graphics();
                border.clear();
                border.lineStyle(4, 0xff0000, 1); // Border width, color, and alpha
                border.beginFill(0x000000, 0);
                border.drawRect(0, 0, cardTexture.width, cardTexture.height);
                border.endFill();
                border.x = -(cardTexture.width / 2)
                border.y = -(cardTexture.height / 2)
                border.name = 'border'
                cardContainer.addChild(border)
            } else {
                multiSelect.value.selectedCards.splice(index, 1);

                const foundBorder = cardContainer.children.find(child => child.name === 'border');

                if (foundBorder) {
                    foundBorder.destroy();
                    cardContainer.removeChild(foundBorder)
                }

            }
        }
    }
    
    onMounted(async () => {
        let canvasWidth     = 1200
        let canvasHeight    = 1050
        const app = new Application();
        await app.init({ background: '#2C3E50', width: canvasWidth, height: canvasHeight });
    
        pixiContainer.value.appendChild(app.canvas);
    
        const loadYourCards = async () => {

            const battleFieldCardsUpdate = []
        
            try {
                // Remove cards from the battlefield
                for (const [key, cardContainer] of cardContainers.entries()) {
                    if (key.startsWith(getYourInfo.value.id + '-') && 
                        !getYourInfo.value.zone.battlefield.some(card => getYourInfo.value.id+'-'+card.id === key)) {
                        cardContainer.destroy();  // Remove from PIXI
                        cardContainers.delete(key);  // Remove from map
                    }
                }

                // Loop through the battlefield cards
                const loadPromises = getYourInfo.value.zone.battlefield.map(async (card) => {

                    const faceUpTexture     = await Assets.load(card.imageUris.small);
                    const faceDownTexture   = await Assets.load('/back-small.jpeg');
                    const key               = getYourInfo.value.id + '-' + card.id;
                    let isDragging          = false;
                    let offsetX             = 0;
                    let offsetY             = 0;

                    // Check if the card already exists
                    if (cardContainers.has(key)) {
                        const existingCardContainer = cardContainers.get(key);

                        if(card && card.id === card.id && existingCardContainer) {
                            if(card.isTapped)
                                existingCardContainer.rotation = -Math.PI / 2;
                            else
                                existingCardContainer.rotation = 0;

                            const labelContainer    = existingCardContainer.children.find(child => (child.name === 'labelContainer')) as Sprite
                            const cardTexture       = existingCardContainer.children.find(child => (child.name === 'cardTexture')) as Sprite
                            if(labelContainer && cardTexture) {
                                cardTexture.texture = card.isFaceUp ? faceUpTexture : faceDownTexture;
                                updateCardLabel(card, labelContainer, cardTexture)
                            }

                        }

                        battleFieldCardsUpdate.push(card)
                        return;
                    }

                    // Create container for a card
                    const cardContainer = new Container()
                    cardContainer.x  = card.posX = app.screen.width / 2;
                    cardContainer.y = card.posY = app.screen.height / 2;
            
                    // If card does not exist, load and add it
                    const cardTexture = new Sprite(card.isFaceUp ? faceUpTexture : faceDownTexture);
            
                    cardTexture.anchor.set(0.5);
                    cardTexture.x       = 0;
                    cardTexture.y       = 0;
                    cardTexture.name    = 'cardTexture'
                    cardContainer.addChild(cardTexture)

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
                    cardLabelContainer.name = 'labelContainer'
                    cardContainer.addChild(cardLabelContainer)

                    //  Add the card container to the game field
                    app.stage.addChild(cardContainer)

                    // cardLabels.set(key, cardLabelContainer);
                    cardContainers.set(key, cardContainer)

                    battleFieldCardsUpdate.push(card)
            
                    // Enable interaction for dragging
                    cardContainer.interactive = true;
                    cardContainer.buttonMode = true;

                    gameState.broadcastChanges()
            
                    // Handle mouse down (begin dragging)
                    cardContainer.on('pointerdown', (event: InteractionEvent) => {
                        if(!multiSelect.value.isActive)
                            isDragging = true;

                        const position = event.data.getLocalPosition(cardContainer.parent);
                        offsetX = position.x - cardContainer.x;
                        offsetY = position.y - cardContainer.y;

                        // For multiselect
                        setMultiSelect(card, cardContainer)
            
                        // Bring the dragged card to the top
                        app.stage.setChildIndex(cardContainer, app.stage.children.length - 1);
                    });
            
                    // Handle mouse move (dragging)
                    cardContainer.on('pointermove', (event: InteractionEvent) => {
                        if (isDragging) {
                            const position = event.data.getLocalPosition(cardContainer.parent);

                            // Calculate new position
                            let newX = position.x - offsetX;
                            let newY = position.y - offsetY;

                            // Clamp within canvas bounds
                            const minX = 0 + (cardContainer.width / 2);
                            const minY = 0 + (cardContainer.height / 2);
                            const maxX = canvasWidth - (cardContainer.width / 2);
                            const maxY = canvasHeight - (cardContainer.height / 2);

                            cardContainer.x = Math.max(minX, Math.min(newX, maxX));
                            cardContainer.y = Math.max(minY, Math.min(newY, maxY));

                            // Update game state
                            getYourInfo.value.zone.battlefield = getYourInfo.value.zone.battlefield.map(item => {
                                if (item.id === card.id) {
                                    item.posX = cardContainer.x;
                                    item.posY = cardContainer.y;
                                    return item;
                                }
                                return item;
                            });

                            // gameState.updatePlayer(getYourInfo.value);
                        }
                    });

            
                    // Handle mouse up (stop dragging)
                    cardContainer.on('pointerup', (event: InteractionEvent) => {
                        
                        getYourInfo.value.zone.battlefield = getYourInfo.value.zone.battlefield.map(item => {
                            if(item.id === card.id) {
                                const position = event.data.getLocalPosition(cardContainer.parent);
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
                    cardContainer.on('pointerupoutside', () => {
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
                for (const [key, cardContainer] of cardContainers.entries()) {
                    if (key.startsWith(opponent.id + '-') && 
                        !opponent.zone.battlefield.some(card => opponent.id+'-'+card.id === key)) {
                        cardContainer.destroy();  // Remove from PIXI
                        cardContainers.delete(key);  // Remove from map
                    }
                }

                try {
                    // Loop through the battlefield cards
                    const loadPromises = opponent.zone.battlefield.map(async (card) => {

                        const faceUpTexture     = await Assets.load(card.imageUris.small);
                        const faceDownTexture   = await Assets.load('/back-small.jpeg');
                        const key               = opponent.id + '-' + card.id;
                        let offsetX             = 0;
                        let offsetY             = 0;

                        // Check if the card already exists
                        if (cardContainers.has(key)) {
                            const existingCardContainer = cardContainers.get(key);

                            if(card && card.id === card.id && existingCardContainer) {
                                existingCardContainer.x = canvasWidth - card.posX
                                existingCardContainer.y = canvasHeight - card.posY

                                if(card.isTapped)
                                    existingCardContainer.rotation = -Math.PI / 2;
                                else
                                    existingCardContainer.rotation = 0;

                                    const labelContainer    = existingCardContainer.children.find(child => (child.name === 'labelContainer')) as Sprite
                                    const cardTexture       = existingCardContainer.children.find(child => (child.name === 'cardTexture')) as Sprite
                                    if(labelContainer && cardTexture) {
                                        cardTexture.texture = card.isFaceUp ? faceUpTexture : faceDownTexture;
                                        updateCardLabel(card, labelContainer, cardTexture)
                                    }
                            }

                            return;
                        }

                        // Create container for a card
                        const cardContainer = new Container()
                        cardContainer.x  = card.posX = app.screen.width / 2;
                        cardContainer.y = card.posY = app.screen.height / 2;

                        // If card does not exist, load and add it
                        const cardTexture = new Sprite(card.isFaceUp ? faceUpTexture : faceDownTexture);
                
                        cardTexture.anchor.set(0.5);
                        cardTexture.x       = 0;
                        cardTexture.y       = 0;
                        cardTexture.name    = 'cardTexture'
                        cardContainer.addChild(cardTexture)

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
                        cardLabelContainer.name = 'labelContainer'
                        cardContainer.addChild(cardLabelContainer)

                        //  Add the card container to the game field
                        app.stage.addChild(cardContainer)

                        cardContainers.set(key, cardContainer)

                        // Enable interaction
                        cardTexture.interactive = true;
                        cardTexture.buttonMode = true;

                        // Handle mouse down (begin dragging)
                        cardTexture.on('pointerdown', (event: InteractionEvent) => {
                            const position = event.data.getLocalPosition(cardTexture.parent);
                            offsetX = position.x - cardTexture.x;
                            offsetY = position.y - cardTexture.y;
                
                            // Bring the dragged card to the top
                            app.stage.setChildIndex(cardContainer, app.stage.children.length - 1);
                        });

                        // Handle mouse up (stop dragging)
                        cardTexture.on('pointerup', (event: InteractionEvent) => {
                            
                            getOpponents.value.forEach(opponent => {
                                opponent.zone.battlefield.map(opponentCard => {
                                    if(opponentCard.id === card.id) {
                                        if(opponentCard.isRevealed) {
                                            selectedCard.value = card as GameCard | null
                                        }
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
        padding: 40px 24px;
        section {
            &:nth-child(1) {
                order: 1;
                height: 100%;
                min-width: 633px;
            }
            &.pixi-section {
                box-shadow: -2px 9px 28px -2px #1a1a1a;
                width: calc(1200px * 0.65);
                height: calc(1050px * 0.65);
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

    .modal-tokens {
        ul {
            display: flex;
            column-gap: 5px;
            margin: 0;
            padding: 0;
            justify-content: center;
            overflow: auto;
            li {
                list-style: none;
            }
        }
    }

    #pixiContainer {
        display: flex;
        transform: scale(0.65);
        transform-origin: top left;
    }
</style>