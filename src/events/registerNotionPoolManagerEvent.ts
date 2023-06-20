import { BaseEvent, Message } from "..";
import { NotionManager } from "../pool";

export class RegisterNotionPoolManager implements BaseEvent {
  canHandle(message: Message): boolean {
      return message.type == "RegisterNotionPoolManager";
  }

  async handle(message: Message, notionManager: NotionManager) {
    const options = message.payload as {
      secrets: string[];
      version: string;
      root: string;
    };
    notionManager.register(options.secrets, options.version, options.root);
    return "Notion Pool Manager is registered" as any;
  }
}