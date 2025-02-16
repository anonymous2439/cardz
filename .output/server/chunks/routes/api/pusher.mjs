import { c as defineEventHandler } from '../../_/nitro.mjs';
import Pusher from 'pusher';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:url';
import 'node:path';

const pusher = new Pusher({
  appId: "1938950",
  key: "6b374c96aafb79469326",
  secret: "769c18b825e806f469cc",
  cluster: "ap1",
  useTLS: true
});
const pusher$1 = defineEventHandler(async (event) => {
  console.log("\u{1F534} API Called: Sending Pusher Event...");
  await pusher.trigger("my-channel", "my-event", {
    message: "Hello from the server!"
  });
  console.log("\u2705 Event successfully triggered!");
  return { success: true };
});

export { pusher$1 as default };
//# sourceMappingURL=pusher.mjs.map
