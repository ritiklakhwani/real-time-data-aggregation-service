import { WebSocketServer, WebSocket } from "ws";
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : undefined;

const rediSub = await createClient()
  .on("error", (err) => console.log("Redis Sub Error", err))
  .connect();
const redisReader = await createClient()
  .on("error", (err) => console.log("Redis Reader Error", err))
  .connect();

console.log("redis connected")

const wss = new WebSocketServer({ port: PORT });
console.log(`WebSocket server running on port ${PORT}`);

wss.on("connection", async (ws) => {
  console.log("client connected, total:", clients.size + 1);
  clients.add(ws);

  const existing = await redisReader.get("tokens:solana:latest");
  if (existing) {
    ws.send(JSON.stringify({
      type: "initial_data",
      data: JSON.parse(existing)
    }));
  }

  ws.on("close", () => {
    clients.delete(ws);
    console.log("client disconnected, total:", clients.size);
  });
});
