<template>
    <div id="library-zone" class="zone">
        <div class="zone-con" v-if="gameState?.you?.zone?.library?.length > 0">
            <div class="zone-options">
                <button @click="gameState.drawCard">Draw a card</button>
                <button @click="reveal()">Reveal</button>
                <button @click="shuffle()">Shuffle</button>
            </div>
            <ul>
                <li v-for="(card, i) in gameState.you.zone.library.slice().reverse()" :key="i">
                    <img :src="card.isFaceUp ? card.imageUris.small : '/back-small.JPEG'" />
                    <template v-if="card.isFaceUp && !modalState.isActive">
                        <button @click="pick(card)">Pick</button>
                        <button 
                            @click="gameState.shiftLibraryCard(card, 'right')" 
                            v-if="i < gameState.you.zone.library.slice().reverse().length-1 && gameState.you.zone.library.slice().reverse()[i+1].isFaceUp"
                        >
                            >>
                        </button>
                        <button  
                            @click="gameState.shiftLibraryCard(card, 'left')"
                            v-if="i > 0 && gameState.you.zone.library.slice().reverse()[i-1].isFaceUp"
                        >
                            <<
                        </button>
                    </template>
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
        <ModalsGlobal v-else-if="modalState.type == 'pick'">
            <template #header>
                Pick
            </template>

            <button @click="selectedCard ? moveToBottomLibrary() : () => {}">
                Move to Bottom Library
            </button>
            <!-- <button @click="toBattlefield()">To Battlefield</button>
            <button @click="selectedCard ? gameState.changeZone(selectedCard, 'hand', 'graveyard') : ()=>{}">To Graveyard</button>
            <button @click="selectedCard ? gameState.changeZone(selectedCard, 'hand', 'exile') : ()=>{}">To Exile</button> -->
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
    </template>
</template>

<script setup lang="ts">
    import { useGameStore } from '~/stores/game';
    import type { GameCard } from '~/types/Card';

    const gameState = useGameStore()
    const modalState = ref<{isActive: boolean, type: string | null}>({isActive: false, type: null})
    const selectedCard = ref<GameCard | null>(null)

    const reveal = () => {
        modalState.value.type = 'reveal'
        modalState.value.isActive = true
    }

    const shuffle = () => {
        gameState.setFaceupLibrary(false)
        gameState.shuffle()
    }

    const pick = (card: GameCard) => {
        selectedCard.value          = card
        modalState.value.type       = 'pick'
        modalState.value.isActive   = true
    }

    const moveToBottomLibrary = () => {
        if(selectedCard.value) {
            gameState.moveToBottomLibrary(selectedCard.value)
            modalState.value.isActive = false
        }
    }

    const toBattlefield = (card:GameCard) => {
        selectedCard.value          = card
        modalState.value.isActive   = true
        modalState.value.type       = 'cardFace'
    }

    const selectCardFace = (isFaceUp = true) => {
        if(selectedCard.value) {
            selectedCard.value.isFaceUp     = isFaceUp
            selectedCard.value.isRevealed   = isFaceUp
            gameState.changeZone(selectedCard.value, 'hand', 'battlefield')
            modalState.value.isActive = false
        }
    }
</script>

<style scoped lang="scss">
    #library-zone {
        ul {
            display: flex;
            column-gap: 5px;
            overflow: auto;
            li {
                list-style: none;
                display: flex;
                flex-direction: column;
                img {
                    pointer-events: none;
                }
            }
        }
    }
</style>