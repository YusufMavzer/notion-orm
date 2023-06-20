import { Client } from "@notionhq/client";
import { BaseEvent, Message } from "..";
import { NotionManager } from "../pool";
import { PageParser } from "../parser/pageParser";

export class UpdateNotionRecordEvent implements BaseEvent {

  canHandle(message: Message): boolean {
    return message.type == "UpdateNotionRecordEvent" ||
      message.type == "ArchiveNotionRecordEvent" ||
      message.type == "RestoreArchivedNotionRecordEvent";
  }

  async handle(message: Message, notionManager: NotionManager) {
    const fn = async (client: Client) => {
      const results = await client.pages.update(message.payload as any);
      return new PageParser().parse(results);
    };
    return await notionManager.execute(fn);
  }

}