import { BaseEvent, Message } from "..";
import { NotionPoolManager } from "../pool";

export class InsertNotionRecordEvent implements BaseEvent {
  
  canHandle(message: Message): boolean {
      return message.type == "InsertNotionRecordEvent";
  }

  async handle(message: Message) {
    if(!NotionPoolManager.isRegistered()) {
      throw "first register notion pool manager";
    }
    return await NotionPoolManager.exec("InsertRecord", message.payload);
  }

}