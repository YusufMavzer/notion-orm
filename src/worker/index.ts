import { Worker } from 'worker_threads';
import { Message, EventResponse } from '..';
import { EventTask, EventTaskManager } from '../tasks';
import { customEnv } from '../env';

class NotionWorker {

  private static _notionWorker?: NotionWorker;

  private worker: Worker;

  constructor() {
    let workerPath = `./node_modules/@yusufmavzer/notion-orm/dist/worker/workerThread.js`;
    if (customEnv.TEST == "true") {
      workerPath = "./dist/worker/workerThread.js";
    }
    this.worker = new Worker(workerPath);
    this.init();
  }

  private init() {
    this.worker.on('message', (e: { response: EventResponse, eventTaskId: string }) => {
      if (e.eventTaskId) {
        const task = EventTaskManager.get(e.eventTaskId);
        if (!task) {
          return;
        }
        task.onMessage(e.response);
        EventTaskManager.deregister(e.eventTaskId);
      }
    });

    // Listen for errors from the worker
    this.worker.on('error', (error) => {
      console.error(`Worker error: ${error}`);
    });

    // Listen for the worker to exit
    this.worker.on('exit', (code) => {
      console.log(`Worker exited with code ${code}`);
    });
  }

  public static get worker() : Worker {
    if (!NotionWorker._notionWorker) {
      NotionWorker._notionWorker = new NotionWorker();
    }
    return NotionWorker._notionWorker.worker;
  }
  
}

export const WorkerThread = {
  postEventMessage: <T>(message: Message) => {
    const eventTask = new EventTask<T>(message);
    EventTaskManager.register(eventTask);
    NotionWorker.worker.postMessage(eventTask.message);
    return eventTask.promise;
  },
  registerPool: (secrets: string[], version: string, root: string) => {
    return WorkerThread.postEventMessage({
      type: "RegisterNotionPoolManager",
      payload: { secrets, version, root }
    })
  }
};
