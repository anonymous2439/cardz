<template>
    <div id="library-zone" class="zone">
        <h2>Library</h2>
        <button @click="gameState.drawCard">Draw a card</button>
        <button @click="gameState.revealTopLibrary">Reveal 1</button>
        <button @click="gameState.shuffle()">Shuffle</button>
        <ul v-if="gameState?.you?.zone?.library?.length > 0">
            <li v-for="(card, i) in gameState.you.zone.library.slice().reverse()" :key="i">
                <img :src="card.isFaceUp ? card.imageUris.small : '/back-small.JPEG'" />
                <button>To Bottom</button>
                <button>Shift to Right</button>
                <button>Shift to Left</button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { useGameStore } from '~/stores/game';

    const gameState = useGameStore()

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