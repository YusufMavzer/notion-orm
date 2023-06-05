import { BaseEvent, Message } from "..";
import { NotionPoolManager } from "../pool";

export class RestoreArchivedNotionRecordEvent implements BaseEvent {
  
  canHandle(message: Message): boolean {
      return message.type == "RestoreArchivedNotionRecordEvent";
  }

  async handle(message: Message) {
    if(!NotionPoolManager.isRegistered()) {
      throw "first register notion pool manager";
    }
    return await NotionPoolManager.exec("RestoreArchivedRecord", message.payload);
  }

}