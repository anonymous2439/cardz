<template>
    <div id="hand-zone" class="zone">
        <ul v-if="gameState?.you?.zone?.hand?.length > 0">
            <li v-for="(card, i) in gameState.you.zone.hand" :key="i">
                <img class="magnified-zone" v-if="hoveredCard && hoveredCard.id === card.id" :src="card.imageUris.normal"/>
                <img :src="card.imageUris.small" @mouseover="isHovered(true, card)" @mouseleave="isHovered(false, card)" />
                <!-- <button @click="cast(card)">Cast</button> -->
                <button @click="toBattlefield(card)">To Battlefield</button>
                <button @click="gameState.changeZone(card, 'hand', 'graveyard')">To Graveyard</button>
                <button @click="gameState.changeZone(card, 'hand', 'exile')">To Exile</button>
                <button @click="gameState.changeZone(card, 'hand', 'library')">To Library</button>
                <button @click="gameState.revealCard(card, 'hand')" v-if="!card.isRevealed">Reveal</button>
                <!-- <button @click="giveToOpponent(card)">Give to Opponent</button> -->
            </li>
        </ul>
    </div>
    <ModalsGlobal v-if="modalState.isActive && modalState.type == 'cardFace'">
        <template #header>
            Select Card Face
        </template>
        <button @click="selectCardFace(true)" class="btn bg-primary">Face Up</button>
        <button @click="selectCardFace(false)" class="btn bg-primary muted">Face Down</button>
        <template #footer>
            <button @click="modalState.isActive = false" class="btn bg-primary">Close</button>
        </template>
    </ModalsGlobal>
</template>

<script setup lang="ts">
    import { useGameStore } from '~/stores/game';
    import type { Card, GameCard } from '~/types/Card';
    import type { Player } from '~/types/Player';

    const gameState = useGameStore()
    const modalState = useState<{isActive: boolean, type: string | null, data: any}>('modalState', () => ({isActive: false, type: null, data: null}))
    const selectedCard: Ref<GameCard | null> = ref(null)
    const hoveredCard: Ref<GameCard | null> = ref(null)
    const selectedTab = useState('selectedTab')

    const cast = (card:GameCard) => {
        selectedCard.value          = card
        modalState.value.isActive   = true
        modalState.value.type       = 'manaCounter'
        modalState.value.data       = card
        selectedTab.value           = 'minimized'
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

    const isHovered = (hovered: boolean, card: GameCard) => {
        if(hovered)
            hoveredCard.value = card
        else
            hoveredCard.value = null
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
            position: relative;
            li {
                list-style: none;
                display: flex;
                flex-direction: column;
                position: relative;
                img {
                    
                }
            }
        }
    }

    
</style>