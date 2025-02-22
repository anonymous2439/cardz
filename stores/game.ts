import type { RuntimeConfig } from 'nuxt/schema'
import { defineStore } from 'pinia'
import type { GameCard } from '~/types/Card'
import type { Player } from '~/types/Player'
import type { Zone } from '~/types/Zone'

export const useGameStore = defineStore('game', {
  state: () => {
    return { 
      connectedCount : 0,
      you : {} as Player,
      players : [] as Player[],
      playerLastId : 0 as number,
      ws : null as WebSocket | null,
    }
  },
  getters: {
    getConnectedCount: (state) => state.connectedCount,
    getYourInfo: (state) => state.you,
    getPlayers: (state) => state.players,
    getOpponents: (state) => {
      return state.players.filter(player => player.id !== state.you.id)
    },
    getPlayerLastId: (state) => state.playerLastId,
  },
  actions: {
    join() {
      const you = {
        id: 'player'+(this.playerLastId+1),
        name: 'Player '+(this.playerLastId+1),
        cards: [],
        zone: {battlefield: [], graveyard: [], exile: [], library: [], hand: []},
        health: 20
      }

      this.you = you
      this.addPlayer(you)

      // if (this.$state.ws && this.$state.ws.readyState === WebSocket.OPEN) {
      //   const message = {
      //       players : this.$state.players,
      //       playerLastId : this.$state.playerLastId,
      //   }
      //   this.$state.ws.send(JSON.stringify(message));
      // }
      this.broadcastChanges()
    },
    incrementConnected() {
      this.$state.connectedCount++;
    },
    decrementConnected() {
      this.$state.connectedCount--
    },
    setPlayer(player: Player) {
      this.$state.players = this.$state.players.map(p => 
        p.id === player.id ? player : p
      );
    },
    setLastPlayerId(id: number) {
      this.$state.playerLastId = id;
    },
    addPlayer(player: Player) {
      this.players.push(player)
      this.playerLastId++
      this.broadcastChanges()
    },
    updatePlayer(updatedPlayer: Player) {
      this.$state.players = this.$state.players.map(player =>
        player.id === updatedPlayer.id ? updatedPlayer : player
      );
      this.broadcastChanges()
    },
    cardsToLibrary() {
      this.$patch(state => {
        const library: GameCard[] = [];
        state.you.cards.forEach(card => {
          for(let i=0; i<card.quantity; i++) {
            library.push ({
              ...card,
              id: card.sourceId + '-' +(i+1),
              isRevealed: false,
              isFaceUp: false,
              isTapped: false,
              posX: 0,
              posY: 0,
              powerCounter: 0,
              toughnessCounter: 0,
            } as GameCard);
          }
          
        });
    
        // Update the library
        state.you.zone.library = [...library];
    
        // Create a new reference for the players array
        state.players = state.players.map(player =>
          player.id === state.you.id ? { ...state.you } : { ...player }
        );
      });
      this.broadcastChanges()
    },
    shiftLibraryCard(card: GameCard, direction: string) {
      const library = this.$state.you.zone.library
      const index = library.findIndex(item => item.id === card.id)
      let newIndex = direction === 'right' ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= library.length) return;

      [library[index], library[newIndex]] = [library[newIndex], library[index]];
      this.$state.you.zone.library = library;

      // Sync your info to the players list
      this.$state.players = this.$state.players.map(player => {
        if(player.id === this.$state.you.id)
          return this.$state.you
        return player
      })
      this.broadcastChanges()
    },
    moveToBottomLibrary(card: GameCard) {
      const library = this.$state.you.zone.library
      const index = library.findIndex(item => item.id === card.id)

      if (index <= 0 || index >= library.length) return;
      const [element] = library.splice(index, 1);
      element.isFaceUp = false
      library.unshift(element);
      this.$state.you.zone.library = library;

      // Sync your info to the players list
      this.$state.players = this.$state.players.map(player => {
        if(player.id === this.$state.you.id)
          return this.$state.you
        return player
      })
      this.broadcastChanges()
    },
    drawCard() {
      if(this.you.zone.library.length > 0) {
        const card: GameCard = this.$state.you.zone.library.pop() as GameCard
        this.$state.you.zone.hand.push(card)

        // Sync your info to the players list
        this.$state.players = this.$state.players.map(player => {
          if(player.id === this.$state.you.id)
            return this.$state.you
          return player
        })
        this.broadcastChanges()
      }
    },
    drawCards(count=0) {
      if(this.you.zone.library.length > 0) {
        for(let i=0; i<count; i++) {
          const card: GameCard = this.$state.you.zone.library.pop() as GameCard
          this.$state.you.zone.hand.push(card)
        }
        
        // Sync your info to the players list
        this.$state.players = this.$state.players.map(player => {
          if(player.id === this.$state.you.id)
            return this.$state.you
          return player
        })
        this.broadcastChanges()
      }
    },
    changeZone(card: GameCard, fromZone: string, toZone: string) {
      // Find the card in the fromZone and remove it
      const cardIndex = this.$state.you.zone[fromZone].findIndex((item:GameCard) => item.id === card.id);
      
      if (cardIndex !== -1) {
          // Remove the card from the fromZone
          const [removedCard] = this.$state.you.zone[fromZone].splice(cardIndex, 1);

          if(toZone == 'library') {
            removedCard.isFaceUp    = false
            removedCard.isRevealed  = false
            removedCard.isTapped    = false
          }
          else if(['graveyard', 'exile'].includes(toZone)) {
            removedCard.isFaceUp    = true
            removedCard.isRevealed  = true
            removedCard.isTapped    = false
          }
  
          // Push the removed card to the toZone
          this.$state.you.zone[toZone].push(removedCard);
      }
  
      // Sync your info to the players list
      this.$state.players = this.$state.players.map(player => 
          player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges()
    },
    addToken(card: GameCard) {
      const timestamp = Date.now();
      const newCard = Object.assign({}, card);
      newCard.id = card.id + '-' + timestamp
      this.$state.you.zone['battlefield'].push(newCard);
  
      // Sync your info to the players list
      this.$state.players = this.$state.players.map(player => 
          player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges()
    },
    destroyCard(card: GameCard, zone='battlefield') {
      this.$state.you.zone[zone] = this.$state.you.zone[zone].filter((item: GameCard) => (item.id !== card.id))

      // Sync your info to the players list
      this.$state.players = this.$state.players.map(player => 
        player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges()
    },
    giveToOpponent(card: GameCard, opponent: Player, fromZone: string, toZone: string) {
      // Find the card in the fromZone and remove it
      const cardIndex = this.$state.you.zone[fromZone].findIndex(item => item.id === card.id);
      
      if (cardIndex !== -1) {
          // Remove the card from the fromZone
          const [removedCard] = this.$state.you.zone[fromZone].splice(cardIndex, 1);

          // Find opponent from the list of players
          this.$state.players.map(player => {
            if(player.id === opponent.id) {
              player.zone[toZone].push(removedCard);
            }
          })
  
          // Push the removed card to the toZone
          // this.$state.you.zone[toZone].push(removedCard);
      }
  
      // Sync your info to the players list
      this.$state.players = this.$state.players.map(player => 
          player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges()
    },
    shuffle() {
      this.$state.you.zone.library = [...this.$state.you.zone.library].sort(() => Math.random() - 0.5)
      // Sync your info to the players list
      this.$state.players = this.$state.players.map(player => 
        player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges()
    },
    updateHealth(health: number) {
      this.$state.you.health = health;
      // Sync your info to the players list
      this.$state.players = this.$state.players.map(player => 
        player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges()
    },
    tapCard(card: GameCard) {
      this.$state.you.zone.battlefield.map(battleFieldCard => {
        if(battleFieldCard.id === card.id) {
          battleFieldCard.isTapped = !battleFieldCard.isTapped
          return battleFieldCard
        }
        return battleFieldCard
      })

      // Sync your info to the players list
      this.$state.players = this.$state.players.map(player => {
        if(player.id === this.$state.you.id)
          return this.$state.you
        return player
      })
      this.broadcastChanges()
    },
    untapAllCards()  {
      this.$state.you.zone.battlefield.map(battleFieldCard => {
          battleFieldCard.isTapped = false
          return battleFieldCard
      })

      // Sync your info to the players list
      this.$state.players = this.$state.players.map(player => 
        player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges()
    },
    revealCard(card: GameCard, zone='battlefield') {
      this.$state.you.zone[zone].map(z => {
        if(z.id === card.id) {
          z.isFaceUp          = true
          z.isRevealed        = true
          z.powerCounter      = 0
          z.toughnessCounter  = 0
          return z
        }
        return z
      })

      // Sync your info to the players list
      this.$state.players = this.$state.players.map(player => {
        if(player.id === this.$state.you.id)
          return this.$state.you
        return player
      })
      this.broadcastChanges()
    },
    setFaceupLibrary(reveal = true) {
      this.$state.you.zone.library.map(card => {
        card.isFaceUp    = reveal
      })

      // Sync your info to the players list
      this.$state.players = this.$state.players.map(player => {
        if(player.id === this.$state.you.id)
          return this.$state.you
        return player
      })
      this.broadcastChanges()
    },
    revealTopLibrary() {
      for(let i = this.$state.you.zone.library.length - 1; i>=0; i--) {
        if(this.$state.you.zone.library[i].isFaceUp)
          continue;
        else {
          this.$state.you.zone.library[i].isFaceUp = true

          // Sync your info to the players list
          this.$state.players = this.$state.players.map(player => {
            if(player.id === this.$state.you.id)
              return this.$state.you
            return player
          })
          this.broadcastChanges()
          break;
        }
      }
    },


    /**
     * Websocket initialization
     */
    startWebSocketServer() {
      const config: any = useRuntimeConfig();
      this.$state.ws = new WebSocket(config.public.wsEndpoint);

      this.$state.ws.onmessage = (event) => {
          const eventData = JSON.parse(event.data);
          if(eventData.hasOwnProperty('type')) {
              if(eventData.type === 'updatePlayers') {
                  const opponent = this.$state.players.find(player => player.id === eventData.data.player.id)

                  // new player
                  if(!opponent || opponent === undefined) {
                    this.$state.players.push(eventData.data.player)
                  }
                  else if(JSON.stringify(eventData.data.player) !== JSON.stringify(opponent)) {
                    this.setPlayer(eventData.data.player)
                    this.$state.playerLastId = eventData.data.playerLastId;
                  }
              }
              else if(eventData.type === 'updatePlayerCount') {
                  this.$state.connectedCount = eventData.data
              }
          }
      };

      this.$state.ws.onopen = () => {
          
      };

      this.$state.ws.onclose = () => {
          
      };
    },
    broadcastChanges() {
      if (this.$state.ws && this.$state.ws.readyState === WebSocket.OPEN) {
          const message = {
              player : this.$state.you,
              playerLastId : this.$state.playerLastId,
          }
          this.$state.ws.send(JSON.stringify(message));
      }
    }
  },
})