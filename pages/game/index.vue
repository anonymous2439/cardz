<template>
    <div id="game-page">
        <template v-if="Object.keys(gameState.getYourInfo).length > 0 && (getConnectedCount === gameState.getPlayers.length)">
            <div id="players-stats">
                <div class="player-stats-con" v-for="(player, index) in gameState.players" :key="index">
                    <button 
                        @click="selectedPlayerTab && selectedPlayerTab.id === player.id 
                            ? selectedPlayerTab = null 
                            : selectedPlayerTab = player">
                                {{ gameState.getYourInfo.id === player.id ? '(You) ' : '' }} {{ player.name }} | h: {{ player.health }}
                    </button>
                    <ul v-if="selectedPlayerTab && selectedPlayerTab.id === player.id">
                        <li>health: {{ player.health }} 
                            <template v-if="gameState.getYourInfo.id === player.id">
                                <input type="number" v-model="healthPoints" />
                                <button @click="gameState.updateHealth(gameState.getYourInfo.health-healthPoints)">-</button>
                                <button @click="gameState.updateHealth(gameState.getYourInfo.health+healthPoints)">+</button>
                            </template>
                        </li>
                        <li>Library: {{ player.zone.library.length }}</li>
                        <li>Battlefield: {{ player.zone.battlefield.length }}</li>
                        <li @click="showPlayerZone('playerGraveyard', player.zone.graveyard)">Graveyard: {{ player.zone.graveyard.length }}</li>
                        <li @click="showPlayerZone('playerExile', player.zone.exile)">Exile: {{ player.zone.exile.length }}</li>
                        <li @click="showPlayerZone('playerHand', player.zone.hand)">Hand: {{ player.zone.hand.length }}</li>
                        <li @click="showSettings">Settings</li>
                    </ul>
                </div>
            </div>
            
            <GameField v-if="Object.keys(gameState.you).length > 0" />

            <div v-if="Object.keys(gameState.you).length > 0" id="zones">
                <div class="zone-tab">
                    <ul>
                        <li @click="selectedTab = 'library'" class="tab-library">Library</li>
                        <li @click="selectedTab = 'hand'" class="tab-hand">Hand</li>
                        <li @click="selectedTab = 'graveyard'" class="tab-graveyard">Graveyard</li>
                        <li @click="selectedTab = 'exile'" class="tab-exile">Exile</li>
                        <!-- <li @click="selectedTab = 'stack'" class="tab-stack">stack</li> -->
                        <li @click="minimized">Minimized</li>
                    </ul>
                    <div class="logs">
                        <div :class="['logs-container', {minimized: selectedTab == 'minimized'}]" ref="logsContainer">
                            <p v-for="(logs, index) in gameState.getLogs" :key="index">
                                {{ logs }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="zone-content">
                    <section v-show="selectedTab === 'library'" class="tab-library"><Library /></section>
                    <section v-show="selectedTab === 'hand'" class="tab-hand"><Hand/></section>
                    <section v-show="selectedTab === 'graveyard'" class="tab-graveyard"><Graveyard /></section>
                    <section v-show="selectedTab === 'exile'" class="tab-exile"><Exile /></section>
                    <!-- <section v-show="selectedTab === 'stack'" class="tab-stack"><Stack /></section> -->
                </div>
            </div>
        </template>

        <ModalsGlobal v-if="modalState.isActive && modalState.type && ['playerGraveyard', 'playerExile', 'playerHand'].includes(modalState.type)">
            <template #header>
                <template v-if="modalState.type == 'playerGraveyard'">Graveyard</template>
                <template v-else-if="modalState.type == 'playerExile'">Exile</template>
                <template v-else-if="modalState.type == 'playerHand'">Hand</template>
            </template>
            
            <ul class="zone-card-list">
                <template v-for="(card, index) in modalState.data" :key="index">
                    <li v-if="card.isRevealed">
                        <img :src="card.imageUris.small" />
                    </li>
                </template>
            </ul>

            <template #footer>
                <button 
                    class="btn bg-primary muted"
                    @click="modalState.isActive = false">
                        Close
                </button>
            </template>
        </ModalsGlobal>

        <ModalsGlobal v-else-if="modalState.isActive && modalState.type === 'room'">
            <template #header>
                Enter Room ID
            </template>
            
            <input type="number" v-model="roomId" />

            <template #footer>
                <button 
                    class="btn bg-primary muted"
                    @click="modalState.isActive = false">
                        Close
                </button>
                <button 
                    v-if="Object.keys(gameState.you).length === 0"
                    :class="['btn', 'bg-primary', {'disabled' : roomId < 1}]"
                    @click="modalState.type='joinGame'">
                        Join Room
                </button>
            </template>
        </ModalsGlobal>

        <ModalsGlobal v-else-if="Object.keys(gameState.you).length === 0 || (getConnectedCount != gameState.getPlayers.length)" class="join-modal">
            <template #header>
                Join Game
            </template>
            <h4>Connected: {{ getConnectedCount }}</h4>
            Upload Deck: <input type="file" id="fileInput" accept=".txt">
            <p v-if="fetchedDeck.isLoading">Uploading Deck...</p>
            <ol v-if="fetchedDeck.data && fetchedDeck.data.length > 0 && !fetchedDeck.isLoading">
                <li v-for="(card, index) in fetchedDeck.data" :key="index">
                    <template v-if="card">
                        {{ card.name }} - {{ card.quantity }}
                    </template>
                </li>
            </ol>

            <template #footer>
                <!-- <button 
                    :class="['btn', 'bg-primary']"
                    @click="reconnect">
                        Reconnect
                </button> -->
                <button 
                    v-if="Object.keys(gameState.you).length === 0"
                    :class="['btn', 'bg-primary', {'disabled' : !fetchedDeck.data}]"
                    @click="join()">
                        Join
                </button>
                <p v-else>Waiting for other players to join...</p>
            </template>
        </ModalsGlobal>

        <ModalsGlobal v-if="modalState.isActive && modalState.type == 'manaCounter'">
            <template #header>
                Mana Counter
            </template>
                <h4>Casting "{{ modalState.data.name }}"</h4>
                <ul>
                    <li>Black: 0</li>
                    <li>Green: 0</li>
                    <li>Red: 0</li>
                    <li>Blue: 0</li>
                    <li>White: 0</li>
                </ul>
                <h4>Total: 0</h4>
            <template #footer>
                <button @click="modalState.isActive = false" class="btn bg-primary">Close</button>
                <!-- <button @click="gameState.changeZone(card, 'hand', 'graveyard')" class="btn bg-primary">Accept</button> -->
            </template>
        </ModalsGlobal>

        <ModalsGlobal v-if="modalState.isActive && modalState.type == 'settings'">
            <template #header>
                Settings
            </template>
                <button @click="newGame">New Game</button>
                <button @click="quit">Quit</button>
            <template #footer>
                <button @click="modalState.isActive = false" class="btn bg-primary">Close</button>
            </template>
        </ModalsGlobal>
    </div>
</template>

<script setup lang="ts">
    import { ModalsGlobal } from '#components';
    import Stack from '~/components/Stack.vue';
    import { useGameStore } from '~/stores/game';
    import type { Card, GameCard } from '~/types/Card';
    import type { Player } from '~/types/Player';

    let gameState = useGameStore()
    const selectedTab: Ref<string> = useState('selectedTab', () => 'library')
    const selectedPlayerTab: Ref<null | Player> = ref(null)
    const modalState = useState<{isActive: boolean, type: string | null, data: any}>('modalState', () => ({isActive: false, type: null, data: null}))
    const fetchedDeck: Ref<{data: Card[] | null, isLoading: boolean}> = ref({data: null, isLoading: false})
    const logsContainer: any = ref(null)
    const healthPoints: Ref<number> = ref(1)
    const roomId: Ref<number> = ref(1)

    const getConnectedCount = computed(() => gameState.getConnectedCount);

    const quit = () => {
        gameState.stopWebSocketServer()
    }

    const showSettings = () => {
        modalState.value.isActive   = true
        modalState.value.type       = 'settings'
    }

    const newGame = () => {
        gameState.newGame()
        modalState.value.isActive   = false
    }

    const logsScrollReset = () => {
        nextTick(() => {
            if (logsContainer.value) {
                logsContainer.value.scrollTop = logsContainer.value.scrollHeight;
            }
        });
    };

    const minimized = () => {
        selectedTab.value = 'minimized'
        logsScrollReset()
    }

    const join = () => {
        if(fetchedDeck.value.data && fetchedDeck.value.data.length > 0) {
            gameState.join()
            const you: Player = gameState.you
            you.cards = fetchedDeck.value.data
            gameState.cardsToLibrary()
            gameState.shuffle()
            gameState.updatePlayer(you)
            modalState.value.isActive = false; 
        }
    }

    const showPlayerZone = (zoneType: string, zone: GameCard[]) => {
        modalState.value.isActive   = true
        modalState.value.type       = zoneType
        modalState.value.data       = zone
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
                data.data.forEach((d: { 
                        name: any,
                        id: any,
                        image_uris: any,
                        all_parts: object[] | null,
                        power: string, 
                        toughness: string, 
                        produced_mana: object, 
                        mana_value: number 
                    }) => {
                    if(d.name === cardIdentifier.name) {
                        cards.push({
                            sourceId:   d.id, 
                            name:       d.name, 
                            imageUris:  d.image_uris, 
                            allParts:   d.all_parts || null,
                            quantity:   cardIdentifier.quantity,
                            power:      !isNaN(parseInt(d.power)) ? parseInt(d.power) : 0,
                            toughness:  !isNaN(parseInt(d.toughness)) ? parseInt(d.toughness) : 0,
                            producedMana: d.produced_mana || null,
                            manaValue: d.mana_value || null,
                        })
                    }
                })
            })
        }

        fetchedDeck.value.data = cards;
        fetchedDeck.value.isLoading = false;
    }

    onMounted(() => {
        gameState.startWebSocketServer(1)

        document.getElementById("fileInput")?.addEventListener("change", (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                fetchedDeck.value.isLoading = true
                fetchCardsFromFile(file);
            }
        });
    });

    onUnmounted(() => {
        gameState.stopWebSocketServer()
    });

    watch(gameState.getLogs, (newValue) => {
        logsScrollReset();
    }, { deep: false, immediate: true });
    

</script>

<style lang="scss" scoped>
    #zones {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        .zone-tab {
            display: flex;
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
            .logs {
                width: 100%;
                position: relative;
                .logs-container {
                    background: #1a1a1a51;
                    padding: 5px 20px;
                    overflow: auto;
                    text-align: right;
                    position: absolute;
                    width: 100%;
                    box-sizing: border-box;
                    bottom: calc(100% - 44px);
                    max-height: 200px;
                    min-height: 44px;
                    &.minimized {
                        max-height: 44px;
                    }
                    p {
                        
                    }
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
    
    #players-stats {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
        .player-stats-con {
            h4 {
                
            }
            ul {
                list-style: none;
                margin: 0;
                padding: 0;
                background: #A68B6D;
                li {
                    border-bottom: 1px solid #1a1a1a31;
                    padding: 5px 8px;
                    cursor: pointer;
                    &:last-child {
                        border-bottom: none;
                    }
                }
            }
        }
    }

    .zone-card-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        column-gap: 4px;
        justify-content: center;
    }

    .join-modal {
        ol {
            max-height: 150px;
            overflow: auto;
            height: 150px;
            li {

            }
        }
    }
</style>