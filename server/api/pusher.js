import Pusher from "pusher";

const pusher = new Pusher({
  appId: "1938950",
  key: "6b374c96aafb79469326",
  secret: "769c18b825e806f469cc",
  cluster: "ap1",
  useTLS: true
});

export default defineEventHandler(async (event) => {
  console.log("🔴 API Called: Sending Pusher Event..."); // Debugging log

  await pusher.trigger("my-channel", "my-event", {
    message: "Hello from the server!"
  });

  console.log("✅ Event successfully triggered!"); // Confirmation log

  return { success: true };
});
