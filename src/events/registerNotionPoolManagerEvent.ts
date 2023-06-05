import { BaseEvent, Message } from "..";
import { NotionPoolManager } from "../pool";

export class RegisterNotionPoolManager implements BaseEvent {
  canHandle(message: Message): boolean {
      return message.type == "RegisterNotionPoolManager";
  }

  async handle(message: Message) {
    const options = message.payload as {
      secrets: string[];
      version: string;
      root: string;
    };
    NotionPoolManager.register(options.secrets, options.version, options.root);
    return "Notion Pool Manager is registered" as any;
  }
}