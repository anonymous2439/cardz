<template>
    <div id="hand-zone">
        <h2>Hand</h2>
        <ul v-if="gameState?.you?.zone?.hand?.length > 0">
            <li v-for="(card, i) in gameState.you.zone.hand" :key="i">
                <img :src="card.imageUris.small" />
                <button @click="toBattlefield(card, true)">To Battlefield (Face Up)</button>
                <button @click="toBattlefield(card, false)">To Battlefield (Face Down)</button>
                <button @click="gameState.changeZone(card, 'hand', 'graveyard')">To Graveyard</button>
                <button @click="gameState.changeZone(card, 'hand', 'exile')">To Exile</button>
                <button @click="giveToOpponent(card)">Give to Opponent</button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { useGameStore } from '~/stores/game';
    import type { Card, GameCard } from '~/types/Card';
    import type { Player } from '~/types/Player';

    const gameState = useGameStore()
    const modalState = useState('modalState')

    const toBattlefield = (card:GameCard, isFaceUp: boolean) => {
        card.isFaceUp = isFaceUp
        card.isRevealed = isFaceUp
        gameState.changeZone(card, 'hand', 'battlefield')
    }

    const giveToOpponent = (card:GameCard) => {
        modalState.value = true
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