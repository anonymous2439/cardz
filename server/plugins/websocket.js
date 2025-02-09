import { WebSocketServer } from "ws";

export default defineNitroPlugin(() => {
    if (process.client) return; // Prevent execution on the client

    const wss = new WebSocketServer({ port: 8080 });

    const broadcastPlayerCount = () => {
        const playerCount = wss.clients.size;
        wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify({ type: "updatePlayerCount", data: playerCount }));
            }
        });
    };

    wss.on("connection", (ws) => {
        console.log("Client connected");
        broadcastPlayerCount();

        ws.on("message", (message) => {
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === client.OPEN) {
                    client.send(JSON.stringify({ type: "updatePlayers", data: JSON.parse(message.toString()) }));
                }
            });
        });

        ws.on("close", () => {
            console.log("Client disconnected");
            setTimeout(() => broadcastPlayerCount(), 100);
        });
    });

    console.log("✅ WebSocket server is running on ws://localhost:8080");
});
