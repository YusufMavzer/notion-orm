import { BaseEvent, Message } from "..";
import { NotionPoolManager } from "../pool";

export class ArchiveNotionRecordEvent implements BaseEvent {
  
  canHandle(message: Message): boolean {
      return message.type == "ArchiveNotionRecordEvent";
  }

  async handle(message: Message) {
    if(!NotionPoolManager.isRegistered()) {
      throw "first register notion pool manager";
    }
    return await NotionPoolManager.exec("ArchiveRecord", message.payload);
  }

}