import { parentPort } from "worker_threads";
import { BaseEvent, Message, EventResponse } from "..";
import { RegisterNotionPoolManager } from "../events/registerNotionPoolManagerEvent";
import { InsertNotionRecordEvent } from "../events/insertNotionRecordEvent";
import { ListNotionRecordEvent } from "../events/listNotionRecordEvent";
import { UpdateNotionRecordEvent } from "../events/updateNotionRecordEvent";
import { NotionPoolManager } from "../pool";

const registerdEvents: BaseEvent[] = [
  new RegisterNotionPoolManager(),
  new InsertNotionRecordEvent(),
  new UpdateNotionRecordEvent(),
  new ListNotionRecordEvent()
];

parentPort && parentPort.on('message', (message: Message) => {
  for (let i = 0; i < registerdEvents.length; i++) {
    const event = registerdEvents[i];
    if (event.canHandle(message)) {

      if (message.type != "RegisterNotionPoolManager" && !NotionPoolManager.isRegistered()) {
        throw "first register notion pool manager";
      }
      event.handle(message, NotionPoolManager)
        .then((e: any) => {
          const response: EventResponse = {
            result: e,
            success: true,
          }
          parentPort && parentPort.postMessage({
            response,
            eventTaskId: message.id
          });
        });
    }
  }
});
