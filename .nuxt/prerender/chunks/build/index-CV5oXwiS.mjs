import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, createBlock, openBlock, Fragment, renderList, createCommentVNode, createTextVNode, toDisplayString, toRef, isRef, useSSRContext } from 'file://D:/cardz/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrRenderClass, ssrRenderSlot } from 'file://D:/cardz/node_modules/vue/server-renderer/index.mjs';
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
      ws: null
    };
  },
  getters: {
    getConnectedCount: (state) => state.connectedCount,
    getYourInfo: (state) => state.you,
    getPlayers: (state) => state.players,
    getOpponents: (state) => {
      return state.players.filter((player) => player.id !== state.you.id);
    },
    getPlayerLastId: (state) => state.playerLastId
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
      this.broadcastChanges();
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
      this.broadcastChanges();
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
        this.broadcastChanges();
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
      this.broadcastChanges();
    },
    addToken(card) {
      const timestamp = Date.now();
      const newCard = Object.assign({}, card);
      newCard.id = card.id + "-" + timestamp;
      this.$state.you.zone["battlefield"].push(newCard);
      this.$state.players = this.$state.players.map(
        (player) => player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges();
    },
    destroyCard(card, zone = "battlefield") {
      this.$state.you.zone[zone] = this.$state.you.zone[zone].filter((item) => item.id !== card.id);
      this.$state.players = this.$state.players.map(
        (player) => player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges();
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
      this.$state.you.zone.library = [...this.$state.you.zone.library].sort(() => Math.random() - 0.5);
      this.$state.players = this.$state.players.map(
        (player) => player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges();
    },
    updateHealth(health) {
      this.$state.you.health = health;
      this.$state.players = this.$state.players.map(
        (player) => player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges();
    },
    tapCard(card) {
      this.$state.you.zone.battlefield.map((battleFieldCard) => {
        if (battleFieldCard.id === card.id) {
          battleFieldCard.isTapped = !battleFieldCard.isTapped;
          return battleFieldCard;
        }
        return battleFieldCard;
      });
      this.$state.players = this.$state.players.map((player) => {
        if (player.id === this.$state.you.id)
          return this.$state.you;
        return player;
      });
      this.broadcastChanges();
    },
    untapAllCards() {
      this.$state.you.zone.battlefield.map((battleFieldCard) => {
        battleFieldCard.isTapped = false;
        return battleFieldCard;
      });
      this.$state.players = this.$state.players.map(
        (player) => player.id === this.$state.you.id ? this.$state.you : player
      );
      this.broadcastChanges();
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
      this.broadcastChanges();
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
      this.broadcastChanges();
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
          this.broadcastChanges();
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
    broadcastChanges() {
      if (this.$state.ws && this.$state.ws.readyState === WebSocket.OPEN) {
        const message = {
          player: this.$state.you,
          playerLastId: this.$state.playerLastId
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
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-ff64fd54><div id="gamefield" data-v-ff64fd54><section data-v-ff64fd54>`);
      if (unref(selectedCard)) {
        _push(`<div class="card-info" data-v-ff64fd54>`);
        if (unref(selectedCard).hasOwnProperty("referenceCard")) {
          _push(`<ul data-v-ff64fd54><li data-v-ff64fd54><button data-v-ff64fd54>Tap / Untap</button></li><li data-v-ff64fd54><button data-v-ff64fd54>Destroy</button></li></ul>`);
        } else {
          _push(`<ul data-v-ff64fd54><li data-v-ff64fd54><button data-v-ff64fd54>Tap / Untap</button></li><li data-v-ff64fd54><button data-v-ff64fd54>Untap All</button></li>`);
          if (!unref(selectedCard).isFaceUp) {
            _push(`<li data-v-ff64fd54><button data-v-ff64fd54>Face up / Reveal</button></li>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<li data-v-ff64fd54><button data-v-ff64fd54>To Graveyard</button></li><li data-v-ff64fd54><button data-v-ff64fd54>To Exile</button></li><li data-v-ff64fd54><button data-v-ff64fd54>To Hand</button></li><li data-v-ff64fd54><button data-v-ff64fd54>Add Token</button></li><li data-v-ff64fd54><button data-v-ff64fd54>Attributes</button></li></ul>`);
        }
        _push(`<img${ssrRenderAttr("src", unref(selectedCard).imageUris.normal)} data-v-ff64fd54></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section class="pixi-section" data-v-ff64fd54><div id="pixiContainer" data-v-ff64fd54></div></section></div>`);
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
              _push2(`<button data-v-ff64fd54${_scopeId}>Close</button>`);
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
                _push2(`<!--[--><p data-v-ff64fd54${_scopeId}>Power: ${ssrInterpolate(unref(selectedCard).power + unref(selectedCard).powerCounter)} <button data-v-ff64fd54${_scopeId}>-</button><button data-v-ff64fd54${_scopeId}>+</button><button data-v-ff64fd54${_scopeId}>reset</button></p><p data-v-ff64fd54${_scopeId}>Toughness: ${ssrInterpolate(unref(selectedCard).toughness + unref(selectedCard).toughnessCounter)} <button data-v-ff64fd54${_scopeId}>-</button><button data-v-ff64fd54${_scopeId}>+</button><button data-v-ff64fd54${_scopeId}>reset</button></p><!--]-->`);
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
              _push2(`<button data-v-ff64fd54${_scopeId}>Close</button>`);
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
                _push2(`<ul data-v-ff64fd54${_scopeId}><!--[-->`);
                ssrRenderList(modalState.value.data, (data, index2) => {
                  _push2(`<li data-v-ff64fd54${_scopeId}><img${ssrRenderAttr("src", data.imageUris.small)} data-v-ff64fd54${_scopeId}></li>`);
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
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-ff64fd54"]]);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Library",
  __ssrInlineRender: true,
  setup(__props) {
    const gameState = useGameStore();
    const modalState = ref({ isActive: false, type: null });
    const selectedCard = ref(null);
    const hoveredCard = ref(null);
    const moveToBottomLibrary = () => {
      if (selectedCard.value) {
        gameState.moveToBottomLibrary(selectedCard.value);
        modalState.value.isActive = false;
      }
    };
    const toBattlefield = () => {
      modalState.value.isActive = true;
      modalState.value.type = "cardFace";
    };
    const selectCardFace = (isFaceUp = true) => {
      if (selectedCard.value) {
        selectedCard.value.isFaceUp = isFaceUp;
        selectedCard.value.isRevealed = isFaceUp;
        gameState.changeZone(selectedCard.value, "library", "battlefield");
        modalState.value.isActive = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_ModalsGlobal = ModalsGlobal;
      _push(`<!--[--><div id="library-zone" class="zone" data-v-7642d0a7>`);
      if (((_d = (_c = (_b = (_a = unref(gameState)) == null ? undefined : _a.you) == null ? undefined : _b.zone) == null ? undefined : _c.library) == null ? undefined : _d.length) > 0) {
        _push(`<div class="zone-con" data-v-7642d0a7><div class="zone-options" data-v-7642d0a7><button data-v-7642d0a7>Draw a card</button><button data-v-7642d0a7>Reveal</button><button data-v-7642d0a7>Shuffle</button></div><ul data-v-7642d0a7><!--[-->`);
        ssrRenderList(unref(gameState).you.zone.library.slice().reverse(), (card, i) => {
          _push(`<li data-v-7642d0a7>`);
          if (unref(hoveredCard) && unref(hoveredCard).id === card.id && card.isFaceUp) {
            _push(`<img class="magnified-zone"${ssrRenderAttr("src", card.imageUris.normal)} data-v-7642d0a7>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<img${ssrRenderAttr("src", card.isFaceUp ? card.imageUris.small : "/back-small.jpeg")} data-v-7642d0a7>`);
          if (card.isFaceUp && !unref(modalState).isActive) {
            _push(`<!--[--><button data-v-7642d0a7>Pick</button>`);
            if (i < unref(gameState).you.zone.library.slice().reverse().length - 1 && unref(gameState).you.zone.library.slice().reverse()[i + 1].isFaceUp) {
              _push(`<button data-v-7642d0a7> &gt;&gt; </button>`);
            } else {
              _push(`<!---->`);
            }
            if (i > 0 && unref(gameState).you.zone.library.slice().reverse()[i - 1].isFaceUp) {
              _push(`<button data-v-7642d0a7> &lt;&lt; </button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
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
                _push2(`<button data-v-7642d0a7${_scopeId}>Close</button>`);
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
                _push2(`<button data-v-7642d0a7${_scopeId}>Reveal 1</button><button data-v-7642d0a7${_scopeId}>Reveal All</button>`);
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
        } else if (unref(modalState).type == "pick") {
          _push(ssrRenderComponent(_component_ModalsGlobal, null, {
            header: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Pick `);
              } else {
                return [
                  createTextVNode(" Pick ")
                ];
              }
            }),
            footer: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button data-v-7642d0a7${_scopeId}>Close</button>`);
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
                _push2(`<button data-v-7642d0a7${_scopeId}> Move to Bottom Library </button><button data-v-7642d0a7${_scopeId}>To Battlefield</button><button data-v-7642d0a7${_scopeId}>To Graveyard</button><button data-v-7642d0a7${_scopeId}>To Exile</button>`);
              } else {
                return [
                  createVNode("button", {
                    onClick: ($event) => unref(selectedCard) ? moveToBottomLibrary() : () => {
                    }
                  }, " Move to Bottom Library ", 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => toBattlefield()
                  }, "To Battlefield", 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => unref(selectedCard) ? unref(gameState).changeZone(unref(selectedCard), "library", "graveyard") : () => {
                    }
                  }, "To Graveyard", 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => unref(selectedCard) ? unref(gameState).changeZone(unref(selectedCard), "library", "exile") : () => {
                    }
                  }, "To Exile", 8, ["onClick"])
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
                _push2(`<button data-v-7642d0a7${_scopeId}>Close</button>`);
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
                _push2(`<button data-v-7642d0a7${_scopeId}>Face Up</button><button data-v-7642d0a7${_scopeId}>Face Down</button>`);
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
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-7642d0a7"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Hand",
  __ssrInlineRender: true,
  setup(__props) {
    const gameState = useGameStore();
    const modalState = useState("modalState", () => ({ isActive: false, type: null }));
    const selectedCard = ref(null);
    const hoveredCard = ref(null);
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
      _push(`<!--[--><div id="hand-zone" class="zone" data-v-46a69e3e>`);
      if (((_d = (_c = (_b = (_a = unref(gameState)) == null ? undefined : _a.you) == null ? undefined : _b.zone) == null ? undefined : _c.hand) == null ? undefined : _d.length) > 0) {
        _push(`<ul data-v-46a69e3e><!--[-->`);
        ssrRenderList(unref(gameState).you.zone.hand, (card, i) => {
          _push(`<li data-v-46a69e3e>`);
          if (unref(hoveredCard) && unref(hoveredCard).id === card.id) {
            _push(`<img class="magnified-zone"${ssrRenderAttr("src", card.imageUris.normal)} data-v-46a69e3e>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<img${ssrRenderAttr("src", card.imageUris.small)} data-v-46a69e3e><button data-v-46a69e3e>To Battlefield</button><button data-v-46a69e3e>To Graveyard</button><button data-v-46a69e3e>To Exile</button><button data-v-46a69e3e>To Library</button>`);
          if (!card.isRevealed) {
            _push(`<button data-v-46a69e3e>Reveal</button>`);
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
              _push2(`<button class="btn bg-primary" data-v-46a69e3e${_scopeId}>Close</button>`);
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
              _push2(`<button class="btn bg-primary" data-v-46a69e3e${_scopeId}>Face Up</button><button class="btn bg-primary muted" data-v-46a69e3e${_scopeId}>Face Down</button>`);
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
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-46a69e3e"]]);
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
      }, _attrs))} data-v-e226230b>`);
      if (((_d = (_c = (_b = (_a = unref(gameState)) == null ? undefined : _a.you) == null ? undefined : _b.zone) == null ? undefined : _c.exile) == null ? undefined : _d.length) > 0) {
        _push(`<ul data-v-e226230b><!--[-->`);
        ssrRenderList(unref(gameState).you.zone.exile, (card, i) => {
          _push(`<li data-v-e226230b>`);
          if (unref(hoveredCard) && unref(hoveredCard).id === card.id) {
            _push(`<img class="magnified-zone"${ssrRenderAttr("src", card.imageUris.normal)} data-v-e226230b>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<img${ssrRenderAttr("src", card.imageUris.small)} data-v-e226230b><button data-v-e226230b>To Battlefield</button><button data-v-e226230b>To Hand</button><button data-v-e226230b>To Graveyard</button></li>`);
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
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-e226230b"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    let gameState = useGameStore();
    const selectedTab = ref("library");
    const selectedPlayerTab = ref(null);
    const modalState = ref({ isActive: false, type: "playerGraveyard", data: Object });
    const fetchedDeck = ref({ data: null, isLoading: false });
    const getConnectedCount = computed(() => gameState.getConnectedCount);
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
    return (_ctx, _push, _parent, _attrs) => {
      const _component_GameField = __nuxt_component_0;
      const _component_Library = __nuxt_component_1;
      const _component_Hand = __nuxt_component_2;
      const _component_Graveyard = __nuxt_component_3;
      const _component_Exile = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "game-page" }, _attrs))} data-v-69f74d60>`);
      if (Object.keys(unref(gameState).getYourInfo).length > 0 && unref(getConnectedCount) === unref(gameState).getPlayers.length) {
        _push(`<!--[--><div id="players-stats" data-v-69f74d60><!--[-->`);
        ssrRenderList(unref(gameState).players, (player, index2) => {
          _push(`<div class="player-stats-con" data-v-69f74d60><button data-v-69f74d60>${ssrInterpolate(unref(gameState).getYourInfo.id === player.id ? "(You) " : "")} ${ssrInterpolate(player.name)} | h: ${ssrInterpolate(player.health)}</button>`);
          if (unref(selectedPlayerTab) && unref(selectedPlayerTab).id === player.id) {
            _push(`<ul data-v-69f74d60><li data-v-69f74d60>health: ${ssrInterpolate(player.health)} <button data-v-69f74d60>-</button><button data-v-69f74d60>+</button></li><li data-v-69f74d60>Total Cards: ${ssrInterpolate(player.cards.length)}</li><li data-v-69f74d60>Library: ${ssrInterpolate(player.zone.library.length)}</li><li data-v-69f74d60>Battlefield: ${ssrInterpolate(player.zone.battlefield.length)}</li><li data-v-69f74d60>Graveyard: ${ssrInterpolate(player.zone.graveyard.length)}</li><li data-v-69f74d60>Exile: ${ssrInterpolate(player.zone.exile.length)}</li><li data-v-69f74d60>Hand: ${ssrInterpolate(player.zone.hand.length)}</li></ul>`);
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
          _push(`<div id="zones" data-v-69f74d60><div class="zone-tab" data-v-69f74d60><ul data-v-69f74d60><li class="tab-library" data-v-69f74d60>Library</li><li class="tab-hand" data-v-69f74d60>Hand</li><li class="tab-graveyard" data-v-69f74d60>Graveyard</li><li class="tab-exile" data-v-69f74d60>Exile</li><li data-v-69f74d60>Minimized</li></ul></div><div class="zone-content" data-v-69f74d60><section style="${ssrRenderStyle(unref(selectedTab) === "library" ? null : { display: "none" })}" class="tab-library" data-v-69f74d60>`);
          _push(ssrRenderComponent(_component_Library, null, null, _parent));
          _push(`</section><section style="${ssrRenderStyle(unref(selectedTab) === "hand" ? null : { display: "none" })}" class="tab-hand" data-v-69f74d60>`);
          _push(ssrRenderComponent(_component_Hand, null, null, _parent));
          _push(`</section><section style="${ssrRenderStyle(unref(selectedTab) === "graveyard" ? null : { display: "none" })}" class="tab-graveyard" data-v-69f74d60>`);
          _push(ssrRenderComponent(_component_Graveyard, null, null, _parent));
          _push(`</section><section style="${ssrRenderStyle(unref(selectedTab) === "exile" ? null : { display: "none" })}" class="tab-exile" data-v-69f74d60>`);
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
              _push2(`<button class="btn bg-primary muted" data-v-69f74d60${_scopeId}> Close </button>`);
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
              _push2(`<ul class="zone-card-list" data-v-69f74d60${_scopeId}><!--[-->`);
              ssrRenderList(unref(modalState).data, (card, index2) => {
                _push2(`<!--[-->`);
                if (card.isRevealed) {
                  _push2(`<li data-v-69f74d60${_scopeId}><img${ssrRenderAttr("src", card.imageUris.small)} data-v-69f74d60${_scopeId}></li>`);
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
                _push2(`<button class="${ssrRenderClass(["btn", "bg-primary", { "disabled": !unref(fetchedDeck).data }])}" data-v-69f74d60${_scopeId}> Join </button>`);
              } else {
                _push2(`<p data-v-69f74d60${_scopeId}>Waiting for other players to join...</p>`);
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
              _push2(`<h4 data-v-69f74d60${_scopeId}>Connected: ${ssrInterpolate(unref(getConnectedCount))}</h4> Upload Deck: <input type="file" id="fileInput" accept=".txt" data-v-69f74d60${_scopeId}>`);
              if (unref(fetchedDeck).isLoading) {
                _push2(`<p data-v-69f74d60${_scopeId}>Uploading Deck...</p>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(fetchedDeck).data && unref(fetchedDeck).data.length > 0 && !unref(fetchedDeck).isLoading) {
                _push2(`<ol data-v-69f74d60${_scopeId}><!--[-->`);
                ssrRenderList(unref(fetchedDeck).data, (card, index2) => {
                  _push2(`<li data-v-69f74d60${_scopeId}>`);
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
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-69f74d60"]]);

export { index as default };
//# sourceMappingURL=index-CV5oXwiS.mjs.map
