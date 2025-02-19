import { ssrRenderAttrs } from 'file://D:/cardz/node_modules/vue/server-renderer/index.mjs';
import { useSSRContext } from 'file://D:/cardz/node_modules/vue/index.mjs';

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
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as default };
//# sourceMappingURL=test-BgBDjuBl.mjs.map
