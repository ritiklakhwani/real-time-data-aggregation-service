import { WebSocketServer, WebSocket } from "ws";
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3002;

//redis connection
const rediSub = await createClient()
  .on("error", (err) => console.log("Redis Sub Error", err))
  .connect();
console.log("redis connected")

const wss = new WebSocketServer({ port: PORT });
console.log(`WebSocket server running on port ${PORT}`);

const clients = new Set<WebSocket>();

//websocket connection
wss.on("connection", async (ws) => {
  console.log("client connected, total:", clients.size + 1);
  clients.add(ws);

  await rediSub.subscribe("token:updates", (message) => {
    for(const client of clients){
        if(client.readyState === WebSocket.OPEN){
            client.send(JSON.stringify({
                type: "price_updates",
                data: JSON.parse(message)
            }))
        }
    }
})

  ws.on("close", () => {
    clients.delete(ws);
    console.log("client disconnected, total:", clients.size);
  });
});

console.log("subscribed to token:updates channel");
