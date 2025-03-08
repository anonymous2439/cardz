import type { RuntimeConfig } from 'nuxt/schema'
import { defineStore } from 'pinia'
import type { GameCard } from '~/types/Card'
import type { Player } from '~/types/Player'
import type { Zone } from '~/types/Zone'
import { type LoginForm, type SignupForm } from '~/types/Forms';

export const useGameStore = defineStore('game', {
  state: () => {
    return { 
      connectedCount : 0,
      you : {} as Player,
      players : [] as Player[],
      playerLastId : 0 as number,
      ws : null as WebSocket | null,
      logs : [] as string[],
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
    getLogs: (state) => state.logs,
  },
  actions: {
    login(loginForm: LoginForm) {
      console.log('form:',loginForm)
    },
    async signup(signupForm: SignupForm) {
      console.log('form:',signupForm)
      const { data, error } = await useFetch("http://localhost:8082/signup", {
        method: "POST",
        body: signupForm
      });

      if(data && data.success)
        return data.message
    },
    join() {
      const you = {
        id: 'player'+(this.playerLastId+1),
        name: 'Player '+(this.playerLastId+1),
        cards: [],
        zone: {battlefield: [], graveyard: [], exile: [], library: [], hand: []},
        health: 20
      } as any

      this.you = you
      this.addPlayer(you)

      this.broadcastChanges(`${you.name} joined the game.`)
    },
    newGame() {
      Object.keys(this.$state.you.zone).forEach(key => {
        this.$state.you.zone[key] = []
      })
      this.$state.you.health = 20
      this.cardsToLibrary()
      this.broadcastChanges(`${this.you.name} created a new game`)
      this.shuffle()
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
      this.broadcastChanges(`${this.$state.you.name} moved a card to the bottom of the library`)
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
        this.broadcastChanges(`${this.$state.you.name} drawn a card`)
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
        this.broadcastChanges(`${this.$state.you.name} drawn ${count} ${count > 1 ? 'cards' : 'card'}`)
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
      this.broadcastChanges(`${this.$state.you.name} moved ${card.isRevealed && card.isFaceUp && card.name ? card.name : 'a card'} from ${fromZone} to ${toZone}`)
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
      this.broadcastChanges(`${this.$state.you.name} added the ${newCard.name} token`)
    },
    destroyCard(card: GameCard, zone='battlefield') {
      this.$state.you.zone[zone] = this.$state.you.zone[zone].filter((item: GameCard) => (item.id !== card.id))

      // Sync your info to the players list
      this.$state.players = this.$state.players.map(player => 
        player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges(`${this.$state.you.name} destroyed the ${card.name}`)
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
      // Perform Fisher-Yates shuffle
      const library = [...this.$state.you.zone.library];
      for (let i = library.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [library[i], library[j]] = [library[j], library[i]]; // Swap elements
      }
      
      // Update state with the shuffled library
      this.$state.you.zone.library = library;
  
      // Sync your info to the players list
      this.$state.players = this.$state.players.map(player => 
          player.id === this.$state.you.id ? this.$state.you : player
      );
  
      this.broadcastChanges(`${this.$state.you.name} shuffled the library`);
    },  
    updateHealth(health: number) {
      const prevHealth = this.$state.you.health
      if(health > 0) {
        this.$state.you.health = health;
        // Sync your info to the players list
        this.$state.players = this.$state.players.map(player => 
          player.id === this.$state.you.id ? this.$state.you : player
        );
        this.broadcastChanges(`${this.$state.you.name} updated health from ${prevHealth} to ${health}`)
      }
    },
    tapCard(card: GameCard) {
      let action = false
      this.$state.you.zone.battlefield.map(battleFieldCard => {
        if(battleFieldCard.id === card.id) {
          battleFieldCard.isTapped = action = !battleFieldCard.isTapped
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
      this.broadcastChanges(`${this.$state.you.name} ${action ? 'tapped' : 'untapped'} ${card.isRevealed && card.isFaceUp ? card.name : 'a card'}`)
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
      this.broadcastChanges(`${this.$state.you.name} untapped all cards`)
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
      this.broadcastChanges(`${this.$state.you.name} revealed the "${card.name}"`)
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
      this.broadcastChanges(`${this.$state.you.name} set the library to faceup`)
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
          this.broadcastChanges(`${this.$state.you.name} revealed the top card of the library`)
          break;
        }
      }
    },


    /**
     * Websocket initialization
     */
    startWebSocketServer(roomId:number) {
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

                  // push new log
                  if(eventData.data.hasOwnProperty('action') && eventData.data.action) {
                    this.$state.logs.push(eventData.data.action)
                  }
              }
              else if(eventData.type === 'updatePlayerCount') {
                  this.$state.connectedCount = eventData.data
              }
          }
      };

      this.$state.ws.onopen = () => {
        const message = {
          type : 'join_room',
          roomId : roomId,
        }
        this.$state.ws.send(JSON.stringify(message));
      };

      this.$state.ws.onclose = () => {
          
      };
    },
    joinRoom(roomId:number) {
      const message = {
        type : 'join_room',
        roomId : roomId,
      }
      if(this.$state.ws)
        this.$state.ws.send(JSON.stringify(message));
    },
    stopWebSocketServer() {
      if (this.$state.ws) {
        this.$state.ws.close();
      }
    },
    broadcastChanges(action:string|null=null) {
      if (this.$state.ws && this.$state.ws.readyState === WebSocket.OPEN) {
          if(action)
            this.$state.logs.push(action)

          const message = {
              player : this.$state.you,
              playerLastId : this.$state.playerLastId,
              action : action,
              type : 'updatePlayers'
          }
          this.$state.ws.send(JSON.stringify(message));
      }
    }
  },
})