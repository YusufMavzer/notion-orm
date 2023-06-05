import { BaseEvent, Message } from "..";
import { NotionPoolManager } from "../pool";

export class UpdateNotionRecordEvent implements BaseEvent {
  
  canHandle(message: Message): boolean {
      return message.type == "UpdateNotionRecordEvent";
  }

  async handle(message: Message) {
    if(!NotionPoolManager.isRegistered()) {
      throw "first register notion pool manager";
    }
    return await NotionPoolManager.exec("UpdateRecord", message.payload);
  }

}