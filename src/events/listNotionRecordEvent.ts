import { Client } from "@notionhq/client";
import { BaseEventHandler, Message } from "@yusufmavzer/extended_worker_threads"
import { NotionPoolManager } from "../pool";

export class ListNotionRecordEventHandler implements BaseEventHandler<any, any> {

  canHandle(message: Message<any>): boolean {
    return message.type == "ListNotionRecordEvent";
  }

  async handle(message: Message<any>) {
    if (!NotionPoolManager.isRegistered()) {
      throw "first register notion pool manager";
    }
    const fn = async (client: Client) => await client.databases.query(message.payload as any);
    return await NotionPoolManager.execute(fn);
  }
}