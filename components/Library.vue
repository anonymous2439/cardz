<template>
    <div id="library-zone" class="zone">
        <div class="zone-con" v-if="gameState?.you?.zone?.library?.length > 0">
            <div class="zone-options">
                <button @click="showDrawModal()">Draw</button>
                <button @click="reveal()">Reveal</button>
                <button @click="shuffle()">Shuffle</button>
                <label>Selected: {{ selectedCards.length }}</label>
                <button @click="showMoveToModal()">Move to</button>
            </div>
            <ul>
                <li v-for="(card, i) in gameState.you.zone.library.slice().reverse()" :key="i">
                    <img class="magnified-zone" 
                        v-if="hoveredCard && hoveredCard.id === card.id && card.isFaceUp" 
                        :src="card.imageUris.normal"
                    />
                    <figure>
                        <img :src="card.isFaceUp ? card.imageUris.small : '/back-small.jpeg'" 
                            :class="['card-img', {selected : selectedCards.length && selectedCards.find(item => item.id === card.id)}]"
                            @mouseover="isHovered(true, card)" 
                            @mouseleave="isHovered(false, card)"
                            @click="selectCard(card)"
                        />
                        <figcaption v-if="selectedCards.length && selectedCards.find(item => item.id === card.id)">{{ selectedCards.findIndex(item => item.id === card.id)+1 }}</figcaption>
                    </figure>
                    <div class="shift-cards" v-if="card.isFaceUp && !selectedCards.length">
                        <button  
                            @click="gameState.shiftLibraryCard(card, 'left')"
                            v-if="i > 0 && gameState.you.zone.library.slice().reverse()[i-1].isFaceUp"
                        >
                            <<
                        </button>
                        <button 
                            @click="gameState.shiftLibraryCard(card, 'right')" 
                            v-if="i < gameState.you.zone.library.slice().reverse().length-1 && gameState.you.zone.library.slice().reverse()[i+1].isFaceUp"
                        >
                            >>
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <template v-if="modalState.isActive">
        <ModalsGlobal v-if="modalState.type == 'reveal'">
            <template #header>
                Reveal
            </template>
            <button @click="gameState.revealTopLibrary()">Reveal 1</button>
            <button @click="gameState.setFaceupLibrary();modalState.isActive=false">Reveal All</button>
            <template #footer>
                <button @click="modalState.isActive = false">Close</button>
            </template>
        </ModalsGlobal>
        <ModalsGlobal v-else-if="modalState.type == 'moveTo'">
            <template #header>
                Move to
            </template>

            <button @click="moveTo('bottom')">Move to Bottom Library</button>
            <button @click="moveTo('battlefield')">To Battlefield</button>
            <button @click="moveTo('graveyard')">To Graveyard</button>
            <button @click="moveTo('exile')">To Exile</button>
            <!-- <button @click="giveToOpponent(card)">Give to Opponent</button> -->

            <template #footer>
                <button @click="modalState.isActive = false">Close</button>
            </template>
        </ModalsGlobal>
        <ModalsGlobal v-else-if="modalState.isActive && modalState.type == 'cardFace'">
            <template #header>
                Select Card Face
            </template>
            <button @click="selectCardFace(true)">Face Up</button>
            <button @click="selectCardFace(false)">Face Down</button>
            <template #footer>
                <button @click="modalState.isActive = false">Close</button>
            </template>
        </ModalsGlobal>
        <ModalsGlobal v-else-if="modalState.isActive && modalState.type == 'draw'">
            <template #header>
                Draw number of cards
            </template>
            <input v-model="drawnCardsCount" type="number" min="1" :max="gameState?.you?.zone?.library?.length"/>
            <template #footer>
                <button @click="modalState.isActive = false">Close</button>
                <button @click="drawCards">Accept</button>
            </template>
        </ModalsGlobal>
    </template>
</template>

<script setup lang="ts">
    import { useGameStore } from '~/stores/game';
    import type { GameCard } from '~/types/Card';

    const gameState = useGameStore()
    const modalState = ref<{isActive: boolean, type: string | null}>({isActive: false, type: null})
    const selectedCard = ref<GameCard | null>(null)
    const selectedCards = ref<GameCard[]>([])
    const hoveredCard: Ref<GameCard | null> = ref(null)
    const drawnCardsCount: Ref<number> = ref(1)

    const reveal = () => {
        modalState.value.type = 'reveal'
        modalState.value.isActive = true
    }

    const shuffle = () => {
        gameState.setFaceupLibrary(false)
        gameState.shuffle()
    }

    const moveToBottomLibrary = () => {
        if(selectedCard.value) {
            gameState.moveToBottomLibrary(selectedCard.value)
            modalState.value.isActive = false
        }
    }

    const toBattlefield = () => {
        modalState.value.isActive   = true
        modalState.value.type       = 'cardFace'
    }

    const selectCard = (card: GameCard) => {
        const foundCard = selectedCards.value.find(item => item.id === card.id)
        if(foundCard)
            selectedCards.value = selectedCards.value.filter(item => (item.id !== foundCard.id))
        else
            selectedCards.value.push(card)
    }

    const selectCardFace = (isFaceUp = true) => {
        selectedCards.value.forEach(card => {
            card.isFaceUp     = isFaceUp
            card.isRevealed   = isFaceUp
            gameState.changeZone(card, 'library', 'battlefield')
            modalState.value.isActive = false
        });
        selectedCards.value = []
    }

    const isHovered = (hovered: boolean, card: GameCard) => {
        if(hovered)
            hoveredCard.value = card
        else
            hoveredCard.value = null
    }

    const showDrawModal = () => {
        modalState.value.isActive = true;
        modalState.value.type = 'draw';
        drawnCardsCount.value=1
    }

    const drawCards = () => {
        modalState.value.isActive = false
        gameState.drawCards(drawnCardsCount.value)
    }

    const showMoveToModal = () => {
        modalState.value.isActive = true
        modalState.value.type = 'moveTo'
    }

    const moveTo = (dest:string) => {
        switch(dest) {
            case 'exile':
            case 'graveyard':
                selectedCards.value.forEach(card => {
                    gameState.changeZone(card, 'library', dest)
                });
                modalState.value.isActive = false
                selectedCards.value = []
            break;

            case 'battlefield':
                modalState.value.type = 'cardFace'
            break;
            
            case 'bottom':
                selectedCards.value.forEach(card => {
                    gameState.moveToBottomLibrary(card)
                });
                modalState.value.isActive = false
                selectedCards.value = []
            break;
        }

        
    }
</script>

<style scoped lang="scss">
    #library-zone {
        ul {
            display: flex;
            column-gap: 5px;
            overflow: auto;
            margin: 0;
            padding-top: 20px;
            li {
                list-style: none;
                display: flex;
                flex-direction: column;
                figure {
                    margin: 0;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    figcaption {
                        text-align: center;
                        padding: 4px;
                    }
                }
                .card-img {
                    position: relative;
                    &.selected {
                        top: -20px;
                        box-shadow: -12px 12px 31px 0px #1a1a1a;
                    }
                }
                .shift-cards {
                    display: flex;
                    justify-content: center;
                    button {
                        width: 49%;
                    }
                }
            }
        }
    }
</style>