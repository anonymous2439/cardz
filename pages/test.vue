<template>
  <div>
    <h1>Game Page</h1>
    <p>Listening for Pusher events...</p>
    <button @click="sendPusherEvent">Trigger Event</button>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import Pusher from "pusher-js";
import { useFetch } from "#app";

onMounted(async () => {
  const pusher = new Pusher("6b374c96aafb79469326", {
    cluster: "ap1"
  });

  const channel = pusher.subscribe("my-channel");
  channel.bind("my-event", (data) => {
    console.log("✅ Event received!", data);
    alert("Received event: " + JSON.stringify(data));
  });

  // Manually triggering event for debugging
  console.log("🔵 Calling /api/pusher...");
  const response = await useFetch("/api/pusher");
  console.log("🟢 Response from API:", response);
});

const sendPusherEvent = async () => {
  console.log("🟡 Manually triggering event...");
  const response = await useFetch("/api/pusher");
  console.log("🟢 Manual event response:", response);
};
</script>
