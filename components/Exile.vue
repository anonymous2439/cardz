<template>
    <div id="exile-zone" class="zone">
        <ul v-if="gameState?.you?.zone?.exile?.length > 0">
            <li v-for="(card, i) in gameState.you.zone.exile" :key="i">
                <img class="magnified-zone" v-if="hoveredCard && hoveredCard.id === card.id" :src="card.imageUris.normal"/>
                <img :src="card.imageUris.small" @mouseover="isHovered(true, card)" @mouseleave="isHovered(false, card)"/>
                <button @click="gameState.changeZone(card, 'exile', 'battlefield')">To Battlefield</button>
                <button @click="gameState.changeZone(card, 'exile', 'hand')">To Hand</button>
                <button @click="gameState.changeZone(card, 'exile', 'graveyard')">To Graveyard</button>
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
    #exile-zone {
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