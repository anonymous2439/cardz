import { ssrRenderAttrs } from 'file://D:/cardz/node_modules/vue/server-renderer/index.mjs';
import { useSSRContext } from 'file://D:/cardz/node_modules/vue/index.mjs';
import { _ as _export_sfc } from './server.mjs';
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
import 'file://D:/cardz/node_modules/pinia/dist/pinia.prod.cjs';
import 'file://D:/cardz/node_modules/vue-router/dist/vue-router.node.mjs';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1>Welcome to the homepage</h1></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-Dag9p3LN.mjs.map
