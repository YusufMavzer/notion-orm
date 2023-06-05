import { parentPort } from "worker_threads";
import { BaseEvent, Message, EventResponse } from "..";
import { RegisterNotionPoolManager } from "../events/registerNotionPoolManagerEvent";
import { InsertNotionRecordEvent } from "../events/insertNotionRecordEvent";
import { UpdateNotionRecordEvent } from "../events/updateNotionRecordEvent";
import { ArchiveNotionRecordEvent } from "../events/archiveNotionRecordEvent";
import { RestoreArchivedNotionRecordEvent } from "../events/restoreArchivedNotionRecordEvent";

const registerdEvents: BaseEvent[] = [
  new RegisterNotionPoolManager(),
  new InsertNotionRecordEvent(),
  new UpdateNotionRecordEvent(),
  new ArchiveNotionRecordEvent(),
  new RestoreArchivedNotionRecordEvent()
];

parentPort && parentPort.on('message', (message: Message) => {
  for (let i = 0; i < registerdEvents.length; i++) {
    const event = registerdEvents[i];
    if (event.canHandle(message)) {
      event.handle(message).then((e: any) => {
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
