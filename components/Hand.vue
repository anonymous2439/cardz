<template>
    <div id="hand-zone" class="zone">
        <ul v-if="gameState?.you?.zone?.hand?.length > 0">
            <li v-for="(card, i) in gameState.you.zone.hand" :key="i">
                <img :src="card.imageUris.small" />
                <button @click="toBattlefield(card)">To Battlefield</button>
                <button @click="gameState.changeZone(card, 'hand', 'graveyard')">To Graveyard</button>
                <button @click="gameState.changeZone(card, 'hand', 'exile')">To Exile</button>
                <button @click="giveToOpponent(card)">Give to Opponent</button>
            </li>
        </ul>
    </div>
    <ModalsGlobal v-if="modalState.isActive && modalState.type == 'cardFace'">
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

<script setup lang="ts">
    import { useGameStore } from '~/stores/game';
    import type { Card, GameCard } from '~/types/Card';
    import type { Player } from '~/types/Player';

    const gameState = useGameStore()
    const modalState = useState<{isActive: boolean, type: string | null}>('modalState', () => ({isActive: false, type: null}))
    const selectedCard = ref<GameCard | null>(null)

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

    const giveToOpponent = (card:GameCard) => {
        
    }

</script>

<style scoped lang="scss">
    #hand-zone {
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