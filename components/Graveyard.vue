<template>
    <div id="graveyard-zone" class="zone">
        <ul v-if="gameState?.you?.zone?.graveyard?.length > 0">
            <li v-for="(card, i) in gameState.you.zone.graveyard" :key="i">
                <img class="magnified-zone" v-if="hoveredCard && hoveredCard.id === card.id" :src="card.imageUris.normal"/>
                <img :src="card.imageUris.small" @mouseover="isHovered(true, card)" @mouseleave="isHovered(false, card)"/>
                <button @click="gameState.changeZone(card, 'graveyard', 'battlefield')">To Battlefield</button>
                <button @click="gameState.changeZone(card, 'graveyard', 'hand')">To Hand</button>
                <button @click="gameState.changeZone(card, 'graveyard', 'exile')">To Exile</button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { useGameStore } from '~/stores/game';
    import type { Card, GameCard } from '~/types/Card';
    import type { Player } from '~/types/Player';

    const gameState = useGameStore()
    const hoveredCard: Ref<GameCard | null> = ref(null)

    const onPlay = (index: number) => {
        gameState.playCard(index)
    }

    const isHovered = (hovered: boolean, card: GameCard) => {
        if(hovered)
            hoveredCard.value = card
        else
            hoveredCard.value = null
    }
</script>

<style scoped lang="scss">
    #graveyard-zone {
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