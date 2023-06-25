import { Client } from "@notionhq/client";
import { BaseEventHandler, Message } from "@yusufmavzer/extended_worker_threads"
import { NotionPoolManager } from "../pool";
import { PageParser } from "../parser/pageParser";

export class InsertNotionRecordEventHandler implements BaseEventHandler<any, any> {

  canHandle(message: Message<any>): boolean {
    return message.type == "InsertNotionRecordEvent";
  }

  async handle(message: Message<any>) {
    if (!NotionPoolManager.isRegistered()) {
      throw "first register notion pool manager";
    }
    const fn = async (client: Client) => {
      const results = await client.pages.create(message.payload as any);
      return new PageParser().parse(results);
    };
    return await NotionPoolManager.execute(fn);
  }

}