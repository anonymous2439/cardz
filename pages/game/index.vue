<template>
    <div id="game-page">
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
        <p><button v-if="Object.keys(gameState.you).length === 0" @click="join">Join</button></p>
        <input type="file" id="fileInput" accept=".txt">
        <p><button @click="gameState.cardsToLibrary">Cards to Library</button></p>

        
        <GameField v-if="Object.keys(gameState.you).length > 0" />

        <div v-if="Object.keys(gameState.you).length > 0" id="zones">
            <div class="zone-tab">
                <ul>
                    <li @click="selectedTab = 'library'" class="tab-library">Library</li>
                    <li @click="selectedTab = 'hand'" class="tab-hand">Hand</li>
                    <li @click="selectedTab = 'graveyard'" class="tab-graveyard">Graveyard</li>
                    <li @click="selectedTab = 'exile'" class="tab-exile">Exile</li>
                    <li @click="selectedTab = 'minimized'">Minimized</li>
                </ul>
            </div>
            <div class="zone-content">
                <section v-show="selectedTab === 'library'" class="tab-library"><Library /></section>
                <section v-show="selectedTab === 'hand'" class="tab-hand"><Hand/></section>
                <section v-show="selectedTab === 'graveyard'" class="tab-graveyard"><Graveyard /></section>
                <section v-show="selectedTab === 'exile'" class="tab-exile"><Exile /></section>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useGameStore } from '~/stores/game';
    import type { Card } from '~/types/Card';
    import type { Player } from '~/types/Player';

    let gameState = useGameStore()
    const selectedTab = ref('library')

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

<style lang="scss" scoped>
    #zones {
        position: sticky;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        .zone-tab {
            ul {
                padding: 0;
                display: flex;
                list-style: none;
                margin: 0;
                li {
                    padding: 10px 14px;
                    background: blue;
                    border-radius: 8px 8px 0 0;
                    min-width: 100px;
                    text-align: center;
                    cursor: pointer;
                    color: #fff;
                    font-weight: 700;
                    text-shadow: 0px 0px 19px black;
                }    
            }
        }
        .zone-content {
            section {
                padding:40px 24px;            }
        }
        .tab-library {
            background: #4B008286 !important;
        }
        .tab-hand {
            background: #FFA50086 !important;
        }
        .tab-graveyard {
            background: #55555586 !important;
        }
        .tab-exile {
            background: #FF450086 !important;
        }
    }
    
</style>