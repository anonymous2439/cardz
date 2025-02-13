<template>
    <div>
        <h1>Game</h1>
        <h4>Connected: {{ getConnectedCount }}</h4>
        <template v-if="Object.keys(gameState.you).length > 0">
            <div v-for="(player, index) in gameState.players" :key="index">
                <h4>Player: {{ player.name }}</h4>
                <ul>
                    <li>health: {{ player.health }} 
                        <button @click="gameState.updateHealth(gameState.getYourInfo.health-1)">-</button>
                        <button @click="gameState.updateHealth(gameState.getYourInfo.health+1)">+</button>
                    </li>
                    <li>Total Cards: {{ player.cards.length }}</li>
                    <li>Library: {{ player.zone.library.length }}</li>
                    <li>Battlefield: {{ player.zone.battlefield.length }}</li>
                    <li>Graveyard: {{ player.zone.graveyard.length }}</li>
                    <li>Exile: {{ player.zone.exile.length }}</li>
                    <li>Hand: {{ player.zone.hand.length }}</li>
                </ul>
            </div>
        </template>
        <div>
            <h4>Players</h4>
            <ul>
                <li v-for="(player) in gameState.players" :key="player.id">{{ player.name }}</li>
            </ul>
        </div>
        <p><button v-if="true || Object.keys(gameState.you).length === 0" @click="join">Join</button></p>
        <input type="file" id="fileInput" accept=".txt">
        <p><button @click="gameState.cardsToLibrary">Cards to Library</button></p>

        <Library />
        <Hand />
        <Graveyard />
        <Exile />
        <GameField v-if="Object.keys(gameState.you).length > 0" />
    </div>
</template>

<script setup lang="ts">
    import { useGameStore } from '~/stores/game';
    import type { Card } from '~/types/Card';
    import type { Player } from '~/types/Player';

    let gameState = useGameStore()

    const getConnectedCount = computed(() => gameState.getConnectedCount);

    const join = () => {
        gameState.join()
    }

    async function fetchCardsFromFile(file: File) {
        const text = await file.text(); // Read the text file

        // Convert input text to JSON (array of objects with quantity and name)
        const cardIdentifiers: any = text.split('\n').reduce((acc: any, line) => {
            const [count, ...nameParts] = line.trim().split(' ');
            const name = nameParts.join(' ');

            const existingItem = acc.find((item: { name: string; }) => item.name === name);

            if (existingItem) {
                existingItem.quantity += parseInt(count, 10);
            } else {
                acc.push({ name, quantity: parseInt(count, 10) });
            }

            return acc;
        }, []);
        
        // Fetch from Scryfall
        const response = await fetch("https://api.scryfall.com/cards/collection", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifiers: cardIdentifiers })
        });

        const data: any = await response.json();
        const cards: Card[] = []
        if(data && data.data) {
            cardIdentifiers.forEach((cardIdentifier: any) => {
                data.data.forEach((d: { name: any; id: any; image_uris: any; power: string, toughness: string }) => {
                    if(d.name === cardIdentifier.name) {
                        cards.push({
                            id:         d.id, 
                            name:       d.name, 
                            imageUris:  d.image_uris, 
                            quantity:   cardIdentifier.quantity,
                            power:      !isNaN(parseInt(d.power)) ? parseInt(d.power) : 0,
                            toughness:  !isNaN(parseInt(d.toughness)) ? parseInt(d.toughness) : 0,
                        })
                    }
                })
            })
        }
        const you: Player = gameState.you
        you.cards = cards

        gameState.updatePlayer(you)
    }

    onMounted(() => {
        gameState.startWebSocketServer()

        document.getElementById("fileInput")?.addEventListener("change", (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                fetchCardsFromFile(file);
            }
        });
    });
    

</script>