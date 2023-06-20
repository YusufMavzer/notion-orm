import { Client } from "@notionhq/client";

const date: Date = new Date();
const clients: Client[] = [];
let root: string = "";
let poolSize: number = 0;
let index: number = 0;
let startTime: number;
let minTimeoutPerRequestInMs: number = 0;

async function timeout(): Promise<void> {
  const pause = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
  const stopTime = date.getTime();
  const stopWatchResults = stopTime - startTime;
  const remainingTime = minTimeoutPerRequestInMs - stopWatchResults;
  if (remainingTime > 0) {
    await pause(remainingTime);
  }
}
export type NotionManager = typeof NotionPoolManager

export const NotionPoolManager = {
  isRegistered: () => {
    return clients.length > 0;
  },
  register: (secrets: string[], notionVersion: string, rootPageId: string) => {
    root = rootPageId;
    secrets.forEach(secret => {
      clients.push(new Client({
        auth: secret.trim(),
        notionVersion
      }));
    });
    poolSize = clients.length - 1;
    minTimeoutPerRequestInMs = 1000 / (clients.length * 3); // 3 requests per second according to `Notion Documentation`
    startTime = date.getTime();
  },
  execute: async (fn: (client: Client) => Promise<any>) => {
    let results;
    await timeout();
    const client = clients[index];
    results = await fn(client);
    index++;
    if (index > poolSize) {
      index = 0;
    }
    startTime = date.getTime();
    return results;
  }
}