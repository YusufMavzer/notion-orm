import { BaseEventHandler } from "@yusufmavzer/extended_worker_threads";
import { RegisterNotionPoolManagerEventHandler } from "./registerNotionPoolManagerEvent";
import { InsertNotionRecordEventHandler } from "./insertNotionRecordEvent";
import { ListNotionRecordEventHandler } from "./listNotionRecordEvent";
import { UpdateNotionRecordEventHandler } from "./updateNotionRecordEvent";

const EventHandlers: Map<string, BaseEventHandler<unknown, unknown>> = new Map();

EventHandlers
  .set("RegisterNotionPoolManagerEvent", new RegisterNotionPoolManagerEventHandler())
  .set("InsertNotionRecordEvent", new InsertNotionRecordEventHandler())
  .set("ListNotionRecordEvent", new ListNotionRecordEventHandler())
  .set("UpdateNotionRecordEvent", new UpdateNotionRecordEventHandler());

export default EventHandlers;