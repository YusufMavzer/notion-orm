import { Client } from "@notionhq/client";
import { ExecType } from "..";
import { PageParser } from "../parser/pageParser";

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
  exec: async (type: ExecType, payload: any) => {
    let results;
    await timeout();
    const client = clients[index];
    //EXEC CODE
    if (type == "InsertRecord") {
      results = await client.pages.create(payload as any);
      return new PageParser().parse(results);
    }
    if (
      type == "UpdateRecord" ||
      type == "ArchiveRecord" ||
      type == "RestoreArchivedRecord") {
      results = await client.pages.update(payload as any);
      return new PageParser().parse(results);
    }
    //END EXEC
    index++;
    if (index > poolSize) {
      index = 0;
    }
    startTime = date.getTime();
    return results;
  }
}