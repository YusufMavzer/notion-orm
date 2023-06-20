import { Client } from "@notionhq/client";
import { BaseEvent, Message } from "..";
import { NotionManager } from "../pool";

export class ListNotionRecordEvent implements BaseEvent {

  canHandle(message: Message): boolean {
    return message.type == "ListNotionRecordEvent";
  }

  async handle(message: Message, notionManager: NotionManager) {
    const fn = async (client: Client) => await client.databases.query(message.payload as any);
    return await notionManager.execute(fn);
  }
}