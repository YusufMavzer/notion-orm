import { EventResponse, Message } from "..";
import { v4 as uuidv4 } from 'uuid';

const tasks: Record<string, EventTask<any>> = {};
export const EventTaskManager = {
  register: (task: EventTask<any>) => {
    tasks[task.id] = task;
  },
  get: (taskId: string) => {
    return tasks[taskId];
  },
  deregister: (taskId: string) => {
    if (tasks[taskId]) {
      delete tasks[taskId];
    }
  }
}

export class EventTask<T> {
  private _id: string;
  private resolveFn: ((value: T) => void) | undefined;
  private rejectFn: ((reason?: any) => void) | undefined;
  private state: 'pending' | 'fulfilled' | 'rejected';
  private value?: T;
  private reason?: any;
  private _message: any;

  constructor(message: Message) {
    this.state = 'pending';
    this._id = uuidv4();
    message.id = this._id ;
    this._message = message;
  }

  private transitionToFulfilled(value: T) {
    if (this.state === 'pending') {
      this.state = 'fulfilled';
      this.value = value;
      this.resolveFn && this.resolveFn(value);
    }
  }

  private transitionToRejected(reason?: any) {
    if (this.state === 'pending') {
      this.state = 'rejected';
      this.reason = reason;
      this.rejectFn && this.rejectFn(reason);
    }
  }

  public get id(): string {
    return this._id;
  }

  public get message(): string {
    return this._message;
  }

  public onMessage(eventResponse: EventResponse) {
    const { result, success, reason } = eventResponse;
    if (success) {
      this.setState(result);
    } else {
      this.setError(reason);
    }
  }

  public get promise(): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.resolveFn = resolve;
      this.rejectFn = reject;

      if (this.state === 'fulfilled') {
        resolve(this.value!);
      } else if (this.state === 'rejected') {
        reject(this.reason);
      }
    });
  }

  public setState(value: T) {
    this.transitionToFulfilled(value);
  }

  public setError(reason?: any) {
    this.transitionToRejected(reason);
  }
}