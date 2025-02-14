<template>
    <div id="exile-zone" class="zone">
        <ul v-if="gameState?.you?.zone?.exile?.length > 0">
            <li v-for="(card, i) in gameState.you.zone.exile" :key="i">
                <img :src="card.imageUris.small" />
                <button @click="gameState.changeZone(card, 'exile', 'battlefield')">To Battlefield</button>
                <button @click="gameState.changeZone(card, 'exile', 'hand')">To Hand</button>
                <button @click="gameState.changeZone(card, 'exile', 'graveyard')">To Graveyard</button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { useGameStore } from '~/stores/game';

    const gameState = useGameStore()

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
                img {
                    pointer-events: none;
                }
            }
        }
    }
</style>