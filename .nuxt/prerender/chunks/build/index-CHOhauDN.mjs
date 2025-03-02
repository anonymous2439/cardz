import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createVNode, createBlock, openBlock, Fragment, renderList, createCommentVNode, createTextVNode, toDisplayString, toRef, isRef, nextTick, withDirectives, vModelText, useSSRContext } from 'file://D:/cardz/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderClass, ssrRenderStyle, ssrRenderSlot } from 'file://D:/cardz/node_modules/vue/server-renderer/index.mjs';
import { _ as _export_sfc, b as useRuntimeConfig, a as useNuxtApp } from './server.mjs';
import { defineStore } from 'file://D:/cardz/node_modules/pinia/dist/pinia.prod.cjs';
import 'file://D:/cardz/node_modules/ofetch/dist/node.mjs';
import '../_/renderer.mjs';
import 'file://D:/cardz/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file://D:/cardz/node_modules/h3/dist/index.mjs';
import 'file://D:/cardz/node_modules/devalue/index.js';
import 'file://D:/cardz/node_modules/ufo/dist/index.mjs';
import 'file://D:/cardz/node_modules/@unhead/ssr/dist/index.mjs';
import 'file://D:/cardz/node_modules/unhead/dist/index.mjs';
import '../_/nitro.mjs';
import 'file://D:/cardz/node_modules/destr/dist/index.mjs';
import 'file://D:/cardz/node_modules/hookable/dist/index.mjs';
import 'file://D:/cardz/node_modules/unenv/runtime/fetch/index.mjs';
import 'file://D:/cardz/node_modules/klona/dist/index.mjs';
import 'file://D:/cardz/node_modules/defu/dist/defu.mjs';
import 'file://D:/cardz/node_modules/scule/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file://D:/cardz/node_modules/pathe/dist/index.mjs';
import 'file://D:/cardz/node_modules/ohash/dist/index.mjs';
import 'file://D:/cardz/node_modules/unstorage/dist/index.mjs';
import 'file://D:/cardz/node_modules/unstorage/drivers/fs.mjs';
import 'file:///D:/cardz/node_modules/nuxt/dist/core/runtime/nitro/cache-driver.js';
import 'file://D:/cardz/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file://D:/cardz/node_modules/radix3/dist/index.mjs';
import 'file://D:/cardz/node_modules/@unhead/shared/dist/index.mjs';
import 'file://D:/cardz/node_modules/unctx/dist/index.mjs';
import 'file://D:/cardz/node_modules/vue-router/dist/vue-router.node.mjs';

const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : undefined;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== undefined && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === undefined && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const _sfc_main$6 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "modal" }, _attrs))} data-v-c8789715><div class="overlay" data-v-c8789715></div><div class="modal-con" data-v-c8789715><div class="modal-header" data-v-c8789715><div class="wrapper" data-v-c8789715>`);
  ssrRenderSlot(_ctx.$slots, "header", {}, null, _push, _parent);
  _push(`</div></div><div class="modal-body" data-v-c8789715><div class="wrapper" data-v-c8789715>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div></div><div class="modal-footer" data-v-c8789715><div class="wrapper" data-v-c8789715>`);
  ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push, _parent);
  _push(`</div></div></div></div>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/modals/global.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : undefined;
};
const ModalsGlobal = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-c8789715"]]);
const useGameStore = defineStore("game", {
  state: () => {
    return {
      connectedCount: 0,
      you: {},
      players: [],
      playerLastId: 0,
      ws: null,
      logs: []
    };
  },
  getters: {
    getConnectedCount: (state) => state.connectedCount,
    getYourInfo: (state) => state.you,
    getPlayers: (state) => state.players,
    getOpponents: (state) => {
      return state.players.filter((player) => player.id !== state.you.id);
    },
    getPlayerLastId: (state) => state.playerLastId,
    getLogs: (state) => state.logs
  },
  actions: {
    join() {
      const you = {
        id: "player" + (this.playerLastId + 1),
        name: "Player " + (this.playerLastId + 1),
        cards: [],
        zone: { battlefield: [], graveyard: [], exile: [], library: [], hand: [] },
        health: 20
      };
      this.you = you;
      this.addPlayer(you);
      this.broadcastChanges(`${you.name} joined the game.`);
    },
    incrementConnected() {
      this.$state.connectedCount++;
    },
    decrementConnected() {
      this.$state.connectedCount--;
    },
    setPlayer(player) {
      this.$state.players = this.$state.players.map(
        (p) => p.id === player.id ? player : p
      );
    },
    setLastPlayerId(id) {
      this.$state.playerLastId = id;
    },
    addPlayer(player) {
      this.players.push(player);
      this.playerLastId++;
      this.broadcastChanges();
    },
    updatePlayer(updatedPlayer) {
      this.$state.players = this.$state.players.map(
        (player) => player.id === updatedPlayer.id ? updatedPlayer : player
      );
      this.broadcastChanges();
    },
    cardsToLibrary() {
      this.$patch((state) => {
        const library = [];
        state.you.cards.forEach((card) => {
          for (let i = 0; i < card.quantity; i++) {
            library.push({
              ...card,
              id: card.sourceId + "-" + (i + 1),
              isRevealed: false,
              isFaceUp: false,
              isTapped: false,
              posX: 0,
              posY: 0,
              powerCounter: 0,
              toughnessCounter: 0
            });
          }
        });
        state.you.zone.library = [...library];
        state.players = state.players.map(
          (player) => player.id === state.you.id ? { ...state.you } : { ...player }
        );
      });
      this.broadcastChanges();
    },
    shiftLibraryCard(card, direction) {
      const library = this.$state.you.zone.library;
      const index2 = library.findIndex((item) => item.id === card.id);
      let newIndex = direction === "right" ? index2 - 1 : index2 + 1;
      if (newIndex < 0 || newIndex >= library.length) return;
      [library[index2], library[newIndex]] = [library[newIndex], library[index2]];
      this.$state.you.zone.library = library;
      this.$state.players = this.$state.players.map((player) => {
        if (player.id === this.$state.you.id)
          return this.$state.you;
        return player;
      });
      this.broadcastChanges();
    },
    moveToBottomLibrary(card) {
      const library = this.$state.you.zone.library;
      const index2 = library.findIndex((item) => item.id === card.id);
      if (index2 <= 0 || index2 >= library.length) return;
      const [element] = library.splice(index2, 1);
      element.isFaceUp = false;
      library.unshift(element);
      this.$state.you.zone.library = library;
      this.$state.players = this.$state.players.map((player) => {
        if (player.id === this.$state.you.id)
          return this.$state.you;
        return player;
      });
      this.broadcastChanges(`${this.$state.you.name} moved a card to the bottom of the library`);
    },
    drawCard() {
      if (this.you.zone.library.length > 0) {
        const card = this.$state.you.zone.library.pop();
        this.$state.you.zone.hand.push(card);
        this.$state.players = this.$state.players.map((player) => {
          if (player.id === this.$state.you.id)
            return this.$state.you;
          return player;
        });
        this.broadcastChanges(`${this.$state.you.name} drawn a card`);
      }
    },
    drawCards(count = 0) {
      if (this.you.zone.library.length > 0) {
        for (let i = 0; i < count; i++) {
          const card = this.$state.you.zone.library.pop();
          this.$state.you.zone.hand.push(card);
        }
        this.$state.players = this.$state.players.map((player) => {
          if (player.id === this.$state.you.id)
            return this.$state.you;
          return player;
        });
        this.broadcastChanges(`${this.$state.you.name} drawn ${count} ${count > 1 ? "cards" : "card"}`);
      }
    },
    changeZone(card, fromZone, toZone) {
      const cardIndex = this.$state.you.zone[fromZone].findIndex((item) => item.id === card.id);
      if (cardIndex !== -1) {
        const [removedCard] = this.$state.you.zone[fromZone].splice(cardIndex, 1);
        if (toZone == "library") {
          removedCard.isFaceUp = false;
          removedCard.isRevealed = false;
          removedCard.isTapped = false;
        } else if (["graveyard", "exile"].includes(toZone)) {
          removedCard.isFaceUp = true;
          removedCard.isRevealed = true;
          removedCard.isTapped = false;
        }
        this.$state.you.zone[toZone].push(removedCard);
      }
      this.$state.players = this.$state.players.map(
        (player) => player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges(`${this.$state.you.name} moved ${card.isRevealed && card.isFaceUp && card.name ? card.name : "a card"} from ${fromZone} to ${toZone}`);
    },
    addToken(card) {
      const timestamp = Date.now();
      const newCard = Object.assign({}, card);
      newCard.id = card.id + "-" + timestamp;
      this.$state.you.zone["battlefield"].push(newCard);
      this.$state.players = this.$state.players.map(
        (player) => player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges(`${this.$state.you.name} added the ${newCard.name} token`);
    },
    destroyCard(card, zone = "battlefield") {
      this.$state.you.zone[zone] = this.$state.you.zone[zone].filter((item) => item.id !== card.id);
      this.$state.players = this.$state.players.map(
        (player) => player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges(`${this.$state.you.name} destroyed the ${card.name}`);
    },
    giveToOpponent(card, opponent, fromZone, toZone) {
      const cardIndex = this.$state.you.zone[fromZone].findIndex((item) => item.id === card.id);
      if (cardIndex !== -1) {
        const [removedCard] = this.$state.you.zone[fromZone].splice(cardIndex, 1);
        this.$state.players.map((player) => {
          if (player.id === opponent.id) {
            player.zone[toZone].push(removedCard);
          }
        });
      }
      this.$state.players = this.$state.players.map(
        (player) => player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges();
    },
    shuffle() {
      const library = [...this.$state.you.zone.library];
      for (let i = library.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [library[i], library[j]] = [library[j], library[i]];
      }
      this.$state.you.zone.library = library;
      this.$state.players = this.$state.players.map(
        (player) => player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges(`${this.$state.you.name} shuffled the library`);
    },
    updateHealth(health) {
      const prevHealth = this.$state.you.health;
      if (health > 0) {
        this.$state.you.health = health;
        this.$state.players = this.$state.players.map(
          (player) => player.id === this.$state.you.id ? this.$state.you : player
        );
        this.broadcastChanges(`${this.$state.you.name} updated health from ${prevHealth} to ${health}`);
      }
    },
    tapCard(card) {
      let action = false;
      this.$state.you.zone.battlefield.map((battleFieldCard) => {
        if (battleFieldCard.id === card.id) {
          battleFieldCard.isTapped = action = !battleFieldCard.isTapped;
          return battleFieldCard;
        }
        return battleFieldCard;
      });
      this.$state.players = this.$state.players.map((player) => {
        if (player.id === this.$state.you.id)
          return this.$state.you;
        return player;
      });
      this.broadcastChanges(`${this.$state.you.name} ${action ? "tapped" : "untapped"} ${card.isRevealed && card.isFaceUp ? card.name : "a card"}`);
    },
    untapAllCards() {
      this.$state.you.zone.battlefield.map((battleFieldCard) => {
        battleFieldCard.isTapped = false;
        return battleFieldCard;
      });
      this.$state.players = this.$state.players.map(
        (player) => player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges(`${this.$state.you.name} untapped all cards`);
    },
    revealCard(card, zone = "battlefield") {
      this.$state.you.zone[zone].map((z) => {
        if (z.id === card.id) {
          z.isFaceUp = true;
          z.isRevealed = true;
          z.powerCounter = 0;
          z.toughnessCounter = 0;
          return z;
        }
        return z;
      });
      this.$state.players = this.$state.players.map((player) => {
        if (player.id === this.$state.you.id)
          return this.$state.you;
        return player;
      });
      this.broadcastChanges(`${this.$state.you.name} revealed the "${card.name}"`);
    },
    setFaceupLibrary(reveal = true) {
      this.$state.you.zone.library.map((card) => {
        card.isFaceUp = reveal;
      });
      this.$state.players = this.$state.players.map((player) => {
        if (player.id === this.$state.you.id)
          return this.$state.you;
        return player;
      });
      this.broadcastChanges(`${this.$state.you.name} set the library to faceup`);
    },
    revealTopLibrary() {
      for (let i = this.$state.you.zone.library.length - 1; i >= 0; i--) {
        if (this.$state.you.zone.library[i].isFaceUp)
          continue;
        else {
          this.$state.you.zone.library[i].isFaceUp = true;
          this.$state.players = this.$state.players.map((player) => {
            if (player.id === this.$state.you.id)
              return this.$state.you;
            return player;
          });
          this.broadcastChanges(`${this.$state.you.name} revealed the top card of the library`);
          break;
        }
      }
    },
    /**
     * Websocket initialization
     */
    startWebSocketServer() {
      const config = useRuntimeConfig();
      this.$state.ws = new WebSocket(config.public.wsEndpoint);
      this.$state.ws.onmessage = (event) => {
        const eventData = JSON.parse(event.data);
        if (eventData.hasOwnProperty("type")) {
          if (eventData.type === "updatePlayers") {
            const opponent = this.$state.players.find((player) => player.id === eventData.data.player.id);
            if (!opponent || opponent === undefined) {
              this.$state.players.push(eventData.data.player);
            } else if (JSON.stringify(eventData.data.player) !== JSON.stringify(opponent)) {
              this.setPlayer(eventData.data.player);
              this.$state.playerLastId = eventData.data.playerLastId;
            }
            if (eventData.data.hasOwnProperty("action") && eventData.data.action) {
              this.$state.logs.push(eventData.data.action);
            }
          } else if (eventData.type === "updatePlayerCount") {
            this.$state.connectedCount = eventData.data;
          }
        }
      };
      this.$state.ws.onopen = () => {
      };
      this.$state.ws.onclose = () => {
      };
    },
    broadcastChanges(action) {
      if (this.$state.ws && this.$state.ws.readyState === WebSocket.OPEN) {
        if (action)
          this.$state.logs.push(action);
        const message = {
          player: this.$state.you,
          playerLastId: this.$state.playerLastId,
          action
        };
        this.$state.ws.send(JSON.stringify(message));
      }
    }
  }
});
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "GameField",
  __ssrInlineRender: true,
  setup(__props) {
    const gameState = useGameStore();
    const selectedCard = useState("selectedCard", () => null);
    const getYourInfo = computed(() => gameState.getYourInfo);
    computed(() => gameState.getOpponents);
    const modalState = ref({ isActive: false, type: null, data: null });
    const multiSelect = ref({ isActive: false, selectedCards: [] });
    ref(null);
    const updateStats = (type, value) => {
      if (selectedCard.value) {
        getYourInfo.value.zone.battlefield = getYourInfo.value.zone.battlefield.map((card) => {
          var _a;
          if (card.id === ((_a = selectedCard == null ? undefined : selectedCard.value) == null ? undefined : _a.id)) {
            switch (type) {
              case "power":
                card.powerCounter = value;
                break;
              case "toughness":
                card.toughnessCounter = value;
                break;
            }
          }
          return card;
        });
        gameState.updatePlayer(getYourInfo.value);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ModalsGlobal = ModalsGlobal;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-9cbe40bd><div id="gamefield" data-v-9cbe40bd><section data-v-9cbe40bd>`);
      if (unref(selectedCard)) {
        _push(`<div class="card-info" data-v-9cbe40bd><div class="card-info-options" data-v-9cbe40bd><ul data-v-9cbe40bd><li data-v-9cbe40bd><button data-v-9cbe40bd>Untap All</button></li><li data-v-9cbe40bd><button data-v-9cbe40bd> Multiselect ${ssrInterpolate(multiSelect.value.isActive ? "(" + multiSelect.value.selectedCards.length + ")" : "")}</button></li></ul><label data-v-9cbe40bd>Card Options</label>`);
        if (unref(selectedCard).hasOwnProperty("referenceCard")) {
          _push(`<ul data-v-9cbe40bd><li data-v-9cbe40bd><button data-v-9cbe40bd>Tap / Untap</button></li><li data-v-9cbe40bd><button data-v-9cbe40bd>Destroy</button></li></ul>`);
        } else {
          _push(`<ul data-v-9cbe40bd><li data-v-9cbe40bd><button data-v-9cbe40bd>Tap / Untap</button></li>`);
          if (!unref(selectedCard).isFaceUp) {
            _push(`<li data-v-9cbe40bd><button data-v-9cbe40bd>Face up / Reveal</button></li>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<li data-v-9cbe40bd><button data-v-9cbe40bd>To Graveyard</button></li><li data-v-9cbe40bd><button data-v-9cbe40bd>To Exile</button></li><li data-v-9cbe40bd><button data-v-9cbe40bd>To Hand</button></li>`);
          if (!multiSelect.value.isActive) {
            _push(`<!--[--><li data-v-9cbe40bd><button data-v-9cbe40bd>Add Token</button></li><li data-v-9cbe40bd><button data-v-9cbe40bd>Attributes</button></li><!--]-->`);
          } else {
            _push(`<!---->`);
          }
          _push(`</ul>`);
        }
        _push(`</div><img${ssrRenderAttr("src", unref(selectedCard).imageUris.normal)} data-v-9cbe40bd></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section class="pixi-section" data-v-9cbe40bd><div id="pixiContainer" data-v-9cbe40bd></div></section></div>`);
      if (modalState.value.isActive && modalState.value.type == "showAttributes") {
        _push(ssrRenderComponent(_component_ModalsGlobal, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Select Card Face `);
            } else {
              return [
                createTextVNode(" Select Card Face ")
              ];
            }
          }),
          footer: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button data-v-9cbe40bd${_scopeId}>Close</button>`);
            } else {
              return [
                createVNode("button", {
                  onClick: ($event) => modalState.value.isActive = false
                }, "Close", 8, ["onClick"])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(selectedCard)) {
                _push2(`<!--[--><p data-v-9cbe40bd${_scopeId}>Power: ${ssrInterpolate(unref(selectedCard).power + unref(selectedCard).powerCounter)} <button data-v-9cbe40bd${_scopeId}>-</button><button data-v-9cbe40bd${_scopeId}>+</button><button data-v-9cbe40bd${_scopeId}>reset</button></p><p data-v-9cbe40bd${_scopeId}>Toughness: ${ssrInterpolate(unref(selectedCard).toughness + unref(selectedCard).toughnessCounter)} <button data-v-9cbe40bd${_scopeId}>-</button><button data-v-9cbe40bd${_scopeId}>+</button><button data-v-9cbe40bd${_scopeId}>reset</button></p><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                unref(selectedCard) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                  createVNode("p", null, [
                    createTextVNode("Power: " + toDisplayString(unref(selectedCard).power + unref(selectedCard).powerCounter) + " ", 1),
                    createVNode("button", {
                      onClick: ($event) => updateStats("power", unref(selectedCard).powerCounter - 1)
                    }, "-", 8, ["onClick"]),
                    createVNode("button", {
                      onClick: ($event) => updateStats("power", unref(selectedCard).powerCounter + 1)
                    }, "+", 8, ["onClick"]),
                    createVNode("button", {
                      onClick: ($event) => updateStats("power", 0)
                    }, "reset", 8, ["onClick"])
                  ]),
                  createVNode("p", null, [
                    createTextVNode("Toughness: " + toDisplayString(unref(selectedCard).toughness + unref(selectedCard).toughnessCounter) + " ", 1),
                    createVNode("button", {
                      onClick: ($event) => updateStats("toughness", unref(selectedCard).toughnessCounter - 1)
                    }, "-", 8, ["onClick"]),
                    createVNode("button", {
                      onClick: ($event) => updateStats("toughness", unref(selectedCard).toughnessCounter + 1)
                    }, "+", 8, ["onClick"]),
                    createVNode("button", {
                      onClick: ($event) => updateStats("toughness", 0)
                    }, "reset", 8, ["onClick"])
                  ])
                ], 64)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else if (modalState.value.isActive && modalState.value.type == "addToken") {
        _push(ssrRenderComponent(_component_ModalsGlobal, { class: "modal-tokens" }, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Click a token to add to the battlefield `);
            } else {
              return [
                createTextVNode(" Click a token to add to the battlefield ")
              ];
            }
          }),
          footer: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button data-v-9cbe40bd${_scopeId}>Close</button>`);
            } else {
              return [
                createVNode("button", {
                  onClick: ($event) => modalState.value.isActive = false
                }, "Close", 8, ["onClick"])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(selectedCard)) {
                _push2(`<ul data-v-9cbe40bd${_scopeId}><!--[-->`);
                ssrRenderList(modalState.value.data, (data, index2) => {
                  _push2(`<li data-v-9cbe40bd${_scopeId}><img${ssrRenderAttr("src", data.imageUris.small)} data-v-9cbe40bd${_scopeId}></li>`);
                });
                _push2(`<!--]--></ul>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                unref(selectedCard) ? (openBlock(), createBlock("ul", { key: 0 }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(modalState.value.data, (data, index2) => {
                    return openBlock(), createBlock("li", { key: index2 }, [
                      createVNode("img", {
                        src: data.imageUris.small,
                        onClick: ($event) => unref(gameState).addToken(data)
                      }, null, 8, ["src", "onClick"])
                    ]);
                  }), 128))
                ])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GameField.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : undefined;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-9cbe40bd"]]);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Library",
  __ssrInlineRender: true,
  setup(__props) {
    const gameState = useGameStore();
    const modalState = ref({ isActive: false, type: null });
    ref(null);
    const selectedCards = ref([]);
    const hoveredCard = ref(null);
    const drawnCardsCount = ref(1);
    const selectCardFace = (isFaceUp = true) => {
      selectedCards.value.forEach((card) => {
        card.isFaceUp = isFaceUp;
        card.isRevealed = isFaceUp;
        gameState.changeZone(card, "library", "battlefield");
        modalState.value.isActive = false;
      });
      selectedCards.value = [];
    };
    const drawCards = () => {
      modalState.value.isActive = false;
      gameState.drawCards(drawnCardsCount.value);
    };
    const moveTo = (dest) => {
      switch (dest) {
        case "hand":
        case "exile":
        case "graveyard":
          selectedCards.value.forEach((card) => {
            gameState.changeZone(card, "library", dest);
          });
          modalState.value.isActive = false;
          selectedCards.value = [];
          break;
        case "battlefield":
          modalState.value.type = "cardFace";
          break;
        case "bottom":
          selectedCards.value.forEach((card) => {
            gameState.moveToBottomLibrary(card);
          });
          modalState.value.isActive = false;
          selectedCards.value = [];
          break;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_ModalsGlobal = ModalsGlobal;
      _push(`<!--[--><div id="library-zone" class="zone" data-v-ecbd8971>`);
      if (((_d = (_c = (_b = (_a = unref(gameState)) == null ? undefined : _a.you) == null ? undefined : _b.zone) == null ? undefined : _c.library) == null ? undefined : _d.length) > 0) {
        _push(`<div class="zone-con" data-v-ecbd8971><div class="zone-options" data-v-ecbd8971><button data-v-ecbd8971>Draw</button><button data-v-ecbd8971>Reveal</button><button data-v-ecbd8971>Shuffle</button><label data-v-ecbd8971>Selected: ${ssrInterpolate(unref(selectedCards).length)}</label><button data-v-ecbd8971>Move to</button></div><ul data-v-ecbd8971><!--[-->`);
        ssrRenderList(unref(gameState).you.zone.library.slice().reverse(), (card, i) => {
          _push(`<li data-v-ecbd8971>`);
          if (unref(hoveredCard) && unref(hoveredCard).id === card.id && card.isFaceUp) {
            _push(`<img class="magnified-zone"${ssrRenderAttr("src", card.imageUris.normal)} data-v-ecbd8971>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<figure data-v-ecbd8971><img${ssrRenderAttr("src", card.isFaceUp ? card.imageUris.small : "/back-small.jpeg")} class="${ssrRenderClass(["card-img", { selected: unref(selectedCards).length && unref(selectedCards).find((item) => item.id === card.id) }])}" data-v-ecbd8971>`);
          if (unref(selectedCards).length && unref(selectedCards).find((item) => item.id === card.id)) {
            _push(`<figcaption data-v-ecbd8971>${ssrInterpolate(unref(selectedCards).findIndex((item) => item.id === card.id) + 1)}</figcaption>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</figure>`);
          if (card.isFaceUp && !unref(selectedCards).length) {
            _push(`<div class="shift-cards" data-v-ecbd8971>`);
            if (i > 0 && unref(gameState).you.zone.library.slice().reverse()[i - 1].isFaceUp) {
              _push(`<button data-v-ecbd8971> &lt;&lt; </button>`);
            } else {
              _push(`<!---->`);
            }
            if (i < unref(gameState).you.zone.library.slice().reverse().length - 1 && unref(gameState).you.zone.library.slice().reverse()[i + 1].isFaceUp) {
              _push(`<button data-v-ecbd8971> &gt;&gt; </button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(modalState).isActive) {
        _push(`<!--[-->`);
        if (unref(modalState).type == "reveal") {
          _push(ssrRenderComponent(_component_ModalsGlobal, null, {
            header: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Reveal `);
              } else {
                return [
                  createTextVNode(" Reveal ")
                ];
              }
            }),
            footer: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button data-v-ecbd8971${_scopeId}>Close</button>`);
              } else {
                return [
                  createVNode("button", {
                    onClick: ($event) => unref(modalState).isActive = false
                  }, "Close", 8, ["onClick"])
                ];
              }
            }),
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button data-v-ecbd8971${_scopeId}>Reveal 1</button><button data-v-ecbd8971${_scopeId}>Reveal All</button>`);
              } else {
                return [
                  createVNode("button", {
                    onClick: ($event) => unref(gameState).revealTopLibrary()
                  }, "Reveal 1", 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => {
                      unref(gameState).setFaceupLibrary();
                      unref(modalState).isActive = false;
                    }
                  }, "Reveal All", 8, ["onClick"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else if (unref(modalState).type == "moveTo") {
          _push(ssrRenderComponent(_component_ModalsGlobal, null, {
            header: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Move to `);
              } else {
                return [
                  createTextVNode(" Move to ")
                ];
              }
            }),
            footer: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button data-v-ecbd8971${_scopeId}>Close</button>`);
              } else {
                return [
                  createVNode("button", {
                    onClick: ($event) => unref(modalState).isActive = false
                  }, "Close", 8, ["onClick"])
                ];
              }
            }),
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button data-v-ecbd8971${_scopeId}>Bottom of Library</button><button data-v-ecbd8971${_scopeId}>Hand</button><button data-v-ecbd8971${_scopeId}>battlefield</button><button data-v-ecbd8971${_scopeId}>Graveyard</button><button data-v-ecbd8971${_scopeId}>Exile</button>`);
              } else {
                return [
                  createVNode("button", {
                    onClick: ($event) => moveTo("bottom")
                  }, "Bottom of Library", 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => moveTo("hand")
                  }, "Hand", 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => moveTo("battlefield")
                  }, "battlefield", 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => moveTo("graveyard")
                  }, "Graveyard", 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => moveTo("exile")
                  }, "Exile", 8, ["onClick"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else if (unref(modalState).isActive && unref(modalState).type == "cardFace") {
          _push(ssrRenderComponent(_component_ModalsGlobal, null, {
            header: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Select Card Face `);
              } else {
                return [
                  createTextVNode(" Select Card Face ")
                ];
              }
            }),
            footer: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button data-v-ecbd8971${_scopeId}>Close</button>`);
              } else {
                return [
                  createVNode("button", {
                    onClick: ($event) => unref(modalState).isActive = false
                  }, "Close", 8, ["onClick"])
                ];
              }
            }),
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button data-v-ecbd8971${_scopeId}>Face Up</button><button data-v-ecbd8971${_scopeId}>Face Down</button>`);
              } else {
                return [
                  createVNode("button", {
                    onClick: ($event) => selectCardFace(true)
                  }, "Face Up", 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => selectCardFace(false)
                  }, "Face Down", 8, ["onClick"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else if (unref(modalState).isActive && unref(modalState).type == "draw") {
          _push(ssrRenderComponent(_component_ModalsGlobal, null, {
            header: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Draw number of cards `);
              } else {
                return [
                  createTextVNode(" Draw number of cards ")
                ];
              }
            }),
            footer: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button data-v-ecbd8971${_scopeId}>Close</button><button data-v-ecbd8971${_scopeId}>Accept</button>`);
              } else {
                return [
                  createVNode("button", {
                    onClick: ($event) => unref(modalState).isActive = false
                  }, "Close", 8, ["onClick"]),
                  createVNode("button", { onClick: drawCards }, "Accept")
                ];
              }
            }),
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a2, _b2, _c2, _d2, _e, _f, _g, _h;
              if (_push2) {
                _push2(`<input${ssrRenderAttr("value", unref(drawnCardsCount))} type="number" min="1"${ssrRenderAttr("max", (_d2 = (_c2 = (_b2 = (_a2 = unref(gameState)) == null ? undefined : _a2.you) == null ? undefined : _b2.zone) == null ? undefined : _c2.library) == null ? undefined : _d2.length)} data-v-ecbd8971${_scopeId}>`);
              } else {
                return [
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => isRef(drawnCardsCount) ? drawnCardsCount.value = $event : null,
                    type: "number",
                    min: "1",
                    max: (_h = (_g = (_f = (_e = unref(gameState)) == null ? undefined : _e.you) == null ? undefined : _f.zone) == null ? undefined : _g.library) == null ? undefined : _h.length
                  }, null, 8, ["onUpdate:modelValue", "max"]), [
                    [vModelText, unref(drawnCardsCount)]
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Library.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : undefined;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-ecbd8971"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Hand",
  __ssrInlineRender: true,
  setup(__props) {
    const gameState = useGameStore();
    const modalState = useState("modalState", () => ({ isActive: false, type: null, data: null }));
    const selectedCard = ref(null);
    const hoveredCard = ref(null);
    useState("selectedTab");
    const selectCardFace = (isFaceUp = true) => {
      if (selectedCard.value) {
        selectedCard.value.isFaceUp = isFaceUp;
        selectedCard.value.isRevealed = isFaceUp;
        gameState.changeZone(selectedCard.value, "hand", "battlefield");
        modalState.value.isActive = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_ModalsGlobal = ModalsGlobal;
      _push(`<!--[--><div id="hand-zone" class="zone" data-v-f78f77a8>`);
      if (((_d = (_c = (_b = (_a = unref(gameState)) == null ? undefined : _a.you) == null ? undefined : _b.zone) == null ? undefined : _c.hand) == null ? undefined : _d.length) > 0) {
        _push(`<ul data-v-f78f77a8><!--[-->`);
        ssrRenderList(unref(gameState).you.zone.hand, (card, i) => {
          _push(`<li data-v-f78f77a8>`);
          if (unref(hoveredCard) && unref(hoveredCard).id === card.id) {
            _push(`<img class="magnified-zone"${ssrRenderAttr("src", card.imageUris.normal)} data-v-f78f77a8>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<img${ssrRenderAttr("src", card.imageUris.small)} data-v-f78f77a8><button data-v-f78f77a8>To Battlefield</button><button data-v-f78f77a8>To Graveyard</button><button data-v-f78f77a8>To Exile</button><button data-v-f78f77a8>To Library</button>`);
          if (!card.isRevealed) {
            _push(`<button data-v-f78f77a8>Reveal</button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(modalState).isActive && unref(modalState).type == "cardFace") {
        _push(ssrRenderComponent(_component_ModalsGlobal, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Select Card Face `);
            } else {
              return [
                createTextVNode(" Select Card Face ")
              ];
            }
          }),
          footer: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button class="btn bg-primary" data-v-f78f77a8${_scopeId}>Close</button>`);
            } else {
              return [
                createVNode("button", {
                  onClick: ($event) => unref(modalState).isActive = false,
                  class: "btn bg-primary"
                }, "Close", 8, ["onClick"])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button class="btn bg-primary" data-v-f78f77a8${_scopeId}>Face Up</button><button class="btn bg-primary muted" data-v-f78f77a8${_scopeId}>Face Down</button>`);
            } else {
              return [
                createVNode("button", {
                  onClick: ($event) => selectCardFace(true),
                  class: "btn bg-primary"
                }, "Face Up", 8, ["onClick"]),
                createVNode("button", {
                  onClick: ($event) => selectCardFace(false),
                  class: "btn bg-primary muted"
                }, "Face Down", 8, ["onClick"])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Hand.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : undefined;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-f78f77a8"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Graveyard",
  __ssrInlineRender: true,
  setup(__props) {
    const gameState = useGameStore();
    const hoveredCard = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      _push(`<div${ssrRenderAttrs(mergeProps({
        id: "graveyard-zone",
        class: "zone"
      }, _attrs))} data-v-de91d82b>`);
      if (((_d = (_c = (_b = (_a = unref(gameState)) == null ? undefined : _a.you) == null ? undefined : _b.zone) == null ? undefined : _c.graveyard) == null ? undefined : _d.length) > 0) {
        _push(`<ul data-v-de91d82b><!--[-->`);
        ssrRenderList(unref(gameState).you.zone.graveyard, (card, i) => {
          _push(`<li data-v-de91d82b>`);
          if (unref(hoveredCard) && unref(hoveredCard).id === card.id) {
            _push(`<img class="magnified-zone"${ssrRenderAttr("src", card.imageUris.normal)} data-v-de91d82b>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<img${ssrRenderAttr("src", card.imageUris.small)} data-v-de91d82b><button data-v-de91d82b>To Battlefield</button><button data-v-de91d82b>To Hand</button><button data-v-de91d82b>To Exile</button></li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Graveyard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : undefined;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-de91d82b"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Exile",
  __ssrInlineRender: true,
  setup(__props) {
    const gameState = useGameStore();
    const hoveredCard = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      _push(`<div${ssrRenderAttrs(mergeProps({
        id: "exile-zone",
        class: "zone"
      }, _attrs))} data-v-8d0f99ba>`);
      if (((_d = (_c = (_b = (_a = unref(gameState)) == null ? undefined : _a.you) == null ? undefined : _b.zone) == null ? undefined : _c.exile) == null ? undefined : _d.length) > 0) {
        _push(`<ul data-v-8d0f99ba><!--[-->`);
        ssrRenderList(unref(gameState).you.zone.exile, (card, i) => {
          _push(`<li data-v-8d0f99ba>`);
          if (unref(hoveredCard) && unref(hoveredCard).id === card.id) {
            _push(`<img class="magnified-zone"${ssrRenderAttr("src", card.imageUris.normal)} data-v-8d0f99ba>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<img${ssrRenderAttr("src", card.imageUris.small)} data-v-8d0f99ba><button data-v-8d0f99ba>To Battlefield</button><button data-v-8d0f99ba>To Hand</button><button data-v-8d0f99ba>To Graveyard</button></li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Exile.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : undefined;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-8d0f99ba"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    let gameState = useGameStore();
    const selectedTab = useState("selectedTab", () => "library");
    const selectedPlayerTab = ref(null);
    const modalState = useState("modalState", () => ({ isActive: false, type: null, data: null }));
    const fetchedDeck = ref({ data: null, isLoading: false });
    const logsContainer = ref(null);
    const healthPoints = ref(1);
    const getConnectedCount = computed(() => gameState.getConnectedCount);
    const logsScrollReset = () => {
      nextTick(() => {
        if (logsContainer.value) {
          logsContainer.value.scrollTop = logsContainer.value.scrollHeight;
        }
      });
    };
    const join = () => {
      if (fetchedDeck.value.data && fetchedDeck.value.data.length > 0) {
        gameState.join();
        const you = gameState.you;
        you.cards = fetchedDeck.value.data;
        gameState.cardsToLibrary();
        gameState.shuffle();
        gameState.updatePlayer(you);
        modalState.value.isActive = false;
      }
    };
    watch(gameState.getLogs, (newValue) => {
      logsScrollReset();
    }, { deep: false, immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_GameField = __nuxt_component_0;
      const _component_Library = __nuxt_component_1;
      const _component_Hand = __nuxt_component_2;
      const _component_Graveyard = __nuxt_component_3;
      const _component_Exile = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "game-page" }, _attrs))} data-v-1ff6f3ba>`);
      if (Object.keys(unref(gameState).getYourInfo).length > 0 && unref(getConnectedCount) === unref(gameState).getPlayers.length) {
        _push(`<!--[--><div id="players-stats" data-v-1ff6f3ba><!--[-->`);
        ssrRenderList(unref(gameState).players, (player, index2) => {
          _push(`<div class="player-stats-con" data-v-1ff6f3ba><button data-v-1ff6f3ba>${ssrInterpolate(unref(gameState).getYourInfo.id === player.id ? "(You) " : "")} ${ssrInterpolate(player.name)} | h: ${ssrInterpolate(player.health)}</button>`);
          if (unref(selectedPlayerTab) && unref(selectedPlayerTab).id === player.id) {
            _push(`<ul data-v-1ff6f3ba><li data-v-1ff6f3ba>health: ${ssrInterpolate(player.health)} `);
            if (unref(gameState).getYourInfo.id === player.id) {
              _push(`<!--[--><input type="number"${ssrRenderAttr("value", unref(healthPoints))} data-v-1ff6f3ba><button data-v-1ff6f3ba>-</button><button data-v-1ff6f3ba>+</button><!--]-->`);
            } else {
              _push(`<!---->`);
            }
            _push(`</li><li data-v-1ff6f3ba>Library: ${ssrInterpolate(player.zone.library.length)}</li><li data-v-1ff6f3ba>Battlefield: ${ssrInterpolate(player.zone.battlefield.length)}</li><li data-v-1ff6f3ba>Graveyard: ${ssrInterpolate(player.zone.graveyard.length)}</li><li data-v-1ff6f3ba>Exile: ${ssrInterpolate(player.zone.exile.length)}</li><li data-v-1ff6f3ba>Hand: ${ssrInterpolate(player.zone.hand.length)}</li></ul>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
        if (Object.keys(unref(gameState).you).length > 0) {
          _push(ssrRenderComponent(_component_GameField, null, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (Object.keys(unref(gameState).you).length > 0) {
          _push(`<div id="zones" data-v-1ff6f3ba><div class="zone-tab" data-v-1ff6f3ba><ul data-v-1ff6f3ba><li class="tab-library" data-v-1ff6f3ba>Library</li><li class="tab-hand" data-v-1ff6f3ba>Hand</li><li class="tab-graveyard" data-v-1ff6f3ba>Graveyard</li><li class="tab-exile" data-v-1ff6f3ba>Exile</li><li data-v-1ff6f3ba>Minimized</li></ul><div class="logs" data-v-1ff6f3ba><div class="${ssrRenderClass(["logs-container", { minimized: unref(selectedTab) == "minimized" }])}" data-v-1ff6f3ba><!--[-->`);
          ssrRenderList(unref(gameState).getLogs, (logs, index2) => {
            _push(`<p data-v-1ff6f3ba>${ssrInterpolate(logs)}</p>`);
          });
          _push(`<!--]--></div></div></div><div class="zone-content" data-v-1ff6f3ba><section style="${ssrRenderStyle(unref(selectedTab) === "library" ? null : { display: "none" })}" class="tab-library" data-v-1ff6f3ba>`);
          _push(ssrRenderComponent(_component_Library, null, null, _parent));
          _push(`</section><section style="${ssrRenderStyle(unref(selectedTab) === "hand" ? null : { display: "none" })}" class="tab-hand" data-v-1ff6f3ba>`);
          _push(ssrRenderComponent(_component_Hand, null, null, _parent));
          _push(`</section><section style="${ssrRenderStyle(unref(selectedTab) === "graveyard" ? null : { display: "none" })}" class="tab-graveyard" data-v-1ff6f3ba>`);
          _push(ssrRenderComponent(_component_Graveyard, null, null, _parent));
          _push(`</section><section style="${ssrRenderStyle(unref(selectedTab) === "exile" ? null : { display: "none" })}" class="tab-exile" data-v-1ff6f3ba>`);
          _push(ssrRenderComponent(_component_Exile, null, null, _parent));
          _push(`</section></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (unref(modalState).isActive && unref(modalState).type && ["playerGraveyard", "playerExile", "playerHand"].includes(unref(modalState).type)) {
        _push(ssrRenderComponent(unref(ModalsGlobal), null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(modalState).type == "playerGraveyard") {
                _push2(`<!--[-->Graveyard<!--]-->`);
              } else if (unref(modalState).type == "playerExile") {
                _push2(`<!--[-->Exile<!--]-->`);
              } else if (unref(modalState).type == "playerHand") {
                _push2(`<!--[-->Hand<!--]-->`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                unref(modalState).type == "playerGraveyard" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                  createTextVNode("Graveyard")
                ], 64)) : unref(modalState).type == "playerExile" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                  createTextVNode("Exile")
                ], 64)) : unref(modalState).type == "playerHand" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                  createTextVNode("Hand")
                ], 64)) : createCommentVNode("", true)
              ];
            }
          }),
          footer: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button class="btn bg-primary muted" data-v-1ff6f3ba${_scopeId}> Close </button>`);
            } else {
              return [
                createVNode("button", {
                  class: "btn bg-primary muted",
                  onClick: ($event) => unref(modalState).isActive = false
                }, " Close ", 8, ["onClick"])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<ul class="zone-card-list" data-v-1ff6f3ba${_scopeId}><!--[-->`);
              ssrRenderList(unref(modalState).data, (card, index2) => {
                _push2(`<!--[-->`);
                if (card.isRevealed) {
                  _push2(`<li data-v-1ff6f3ba${_scopeId}><img${ssrRenderAttr("src", card.imageUris.small)} data-v-1ff6f3ba${_scopeId}></li>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]--></ul>`);
            } else {
              return [
                createVNode("ul", { class: "zone-card-list" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(modalState).data, (card, index2) => {
                    return openBlock(), createBlock(Fragment, { key: index2 }, [
                      card.isRevealed ? (openBlock(), createBlock("li", { key: 0 }, [
                        createVNode("img", {
                          src: card.imageUris.small
                        }, null, 8, ["src"])
                      ])) : createCommentVNode("", true)
                    ], 64);
                  }), 128))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else if (Object.keys(unref(gameState).you).length === 0 || unref(getConnectedCount) != unref(gameState).getPlayers.length) {
        _push(ssrRenderComponent(unref(ModalsGlobal), { class: "join-modal" }, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Join Game `);
            } else {
              return [
                createTextVNode(" Join Game ")
              ];
            }
          }),
          footer: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (Object.keys(unref(gameState).you).length === 0) {
                _push2(`<button class="${ssrRenderClass(["btn", "bg-primary", { "disabled": !unref(fetchedDeck).data }])}" data-v-1ff6f3ba${_scopeId}> Join </button>`);
              } else {
                _push2(`<p data-v-1ff6f3ba${_scopeId}>Waiting for other players to join...</p>`);
              }
            } else {
              return [
                Object.keys(unref(gameState).you).length === 0 ? (openBlock(), createBlock("button", {
                  key: 0,
                  class: ["btn", "bg-primary", { "disabled": !unref(fetchedDeck).data }],
                  onClick: ($event) => join()
                }, " Join ", 10, ["onClick"])) : (openBlock(), createBlock("p", { key: 1 }, "Waiting for other players to join..."))
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h4 data-v-1ff6f3ba${_scopeId}>Connected: ${ssrInterpolate(unref(getConnectedCount))}</h4> Upload Deck: <input type="file" id="fileInput" accept=".txt" data-v-1ff6f3ba${_scopeId}>`);
              if (unref(fetchedDeck).isLoading) {
                _push2(`<p data-v-1ff6f3ba${_scopeId}>Uploading Deck...</p>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(fetchedDeck).data && unref(fetchedDeck).data.length > 0 && !unref(fetchedDeck).isLoading) {
                _push2(`<ol data-v-1ff6f3ba${_scopeId}><!--[-->`);
                ssrRenderList(unref(fetchedDeck).data, (card, index2) => {
                  _push2(`<li data-v-1ff6f3ba${_scopeId}>`);
                  if (card) {
                    _push2(`<!--[-->${ssrInterpolate(card.name)} - ${ssrInterpolate(card.quantity)}<!--]-->`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</li>`);
                });
                _push2(`<!--]--></ol>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode("h4", null, "Connected: " + toDisplayString(unref(getConnectedCount)), 1),
                createTextVNode(" Upload Deck: "),
                createVNode("input", {
                  type: "file",
                  id: "fileInput",
                  accept: ".txt"
                }),
                unref(fetchedDeck).isLoading ? (openBlock(), createBlock("p", { key: 0 }, "Uploading Deck...")) : createCommentVNode("", true),
                unref(fetchedDeck).data && unref(fetchedDeck).data.length > 0 && !unref(fetchedDeck).isLoading ? (openBlock(), createBlock("ol", { key: 1 }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(fetchedDeck).data, (card, index2) => {
                    return openBlock(), createBlock("li", { key: index2 }, [
                      card ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        createTextVNode(toDisplayString(card.name) + " - " + toDisplayString(card.quantity), 1)
                      ], 64)) : createCommentVNode("", true)
                    ]);
                  }), 128))
                ])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(modalState).isActive && unref(modalState).type == "manaCounter") {
        _push(ssrRenderComponent(unref(ModalsGlobal), null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Mana Counter `);
            } else {
              return [
                createTextVNode(" Mana Counter ")
              ];
            }
          }),
          footer: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button class="btn bg-primary" data-v-1ff6f3ba${_scopeId}>Close</button>`);
            } else {
              return [
                createVNode("button", {
                  onClick: ($event) => unref(modalState).isActive = false,
                  class: "btn bg-primary"
                }, "Close", 8, ["onClick"])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h4 data-v-1ff6f3ba${_scopeId}>Casting &quot;${ssrInterpolate(unref(modalState).data.name)}&quot;</h4><ul data-v-1ff6f3ba${_scopeId}><li data-v-1ff6f3ba${_scopeId}>Black: 0</li><li data-v-1ff6f3ba${_scopeId}>Green: 0</li><li data-v-1ff6f3ba${_scopeId}>Red: 0</li><li data-v-1ff6f3ba${_scopeId}>Blue: 0</li><li data-v-1ff6f3ba${_scopeId}>White: 0</li></ul><h4 data-v-1ff6f3ba${_scopeId}>Total: 0</h4>`);
            } else {
              return [
                createVNode("h4", null, 'Casting "' + toDisplayString(unref(modalState).data.name) + '"', 1),
                createVNode("ul", null, [
                  createVNode("li", null, "Black: 0"),
                  createVNode("li", null, "Green: 0"),
                  createVNode("li", null, "Red: 0"),
                  createVNode("li", null, "Blue: 0"),
                  createVNode("li", null, "White: 0")
                ]),
                createVNode("h4", null, "Total: 0")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/game/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1ff6f3ba"]]);

export { index as default };
//# sourceMappingURL=index-CHOhauDN.mjs.map
