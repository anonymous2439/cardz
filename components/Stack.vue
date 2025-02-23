<template>
    <div id="stack-zone" class="zone">
        <ul v-if="gameState?.you?.zone?.stack?.length > 0">
            <li v-for="(card, i) in gameState.you.zone.stack" :key="i">
                <img class="magnified-zone" v-if="hoveredCard && hoveredCard.id === card.id" :src="card.imageUris.normal"/>
                <img :src="card.imageUris.small" @mouseover="isHovered(true, card)" @mouseleave="isHovered(false, card)"/>
                <button @click="gameState.changeZone(card, 'stack', 'battlefield')">To Battlefield</button>
                <button @click="gameState.changeZone(card, 'stack', 'hand')">To Hand</button>
                <button @click="gameState.changeZone(card, 'stack', 'graveyard')">To Graveyard</button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { useGameStore } from '~/stores/game';
    import type { GameCard } from '~/types/Card';

    const gameState = useGameStore()
    const hoveredCard: Ref<GameCard | null> = ref(null)

    const isHovered = (hovered: boolean, card: GameCard) => {
        if(hovered)
            hoveredCard.value = card
        else
            hoveredCard.value = null
    }
</script>

<style scoped lang="scss">
    #stack-zone {
        ul {
            display: flex;
            column-gap: 5px;
            overflow: auto;
            li {
                list-style: none;
                display: flex;
                flex-direction: column;
            }
        }
    }
</style>