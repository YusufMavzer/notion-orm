import { BaseEventHandler, Message } from "@yusufmavzer/extended_worker_threads"
import { NotionPoolManager } from "../pool";

export class RegisterNotionPoolManagerEventHandler implements BaseEventHandler<any, string> {
  canHandle(message: Message<any>): boolean {
      return message.type == "RegisterNotionPoolManagerEvent";
  }

  async handle(message: Message<any>) {
    const options = message.payload as {
      secrets: string[];
      version: string;
      root: string;
    };
    NotionPoolManager.register(options.secrets, options.version, options.root);
    return "Notion Pool Manager is registered" as any;
  }
}