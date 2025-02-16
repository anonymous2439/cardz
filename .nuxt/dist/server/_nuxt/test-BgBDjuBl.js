import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import "pusher-js";
import "hookable";
import "destr";
import "klona";
import "defu";
import "#internal/nuxt/paths";
const _sfc_main = {
  __name: "test",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1>Game Page</h1><p>Listening for Pusher events...</p><button>Trigger Event</button></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/test.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=test-BgBDjuBl.js.map
