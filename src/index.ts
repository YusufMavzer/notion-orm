import { RecordBuilder } from "./util";
import { WorkerThread } from "./worker";

type NumberFormat = "number" | "number_with_commas" | "percent" | "dollar" | "canadian_dollar" | "singapore_dollar" | "euro" | "pound" | "yen" | "ruble" | "rupee" | "won" | "yuan" | "real" | "lira" | "rupiah" | "franc" | "hong_kong_dollar" | "new_zealand_dollar" | "krona" | "norwegian_krone" | "mexican_peso" | "rand" | "new_taiwan_dollar" | "danish_krone" | "zloty" | "baht" | "forint" | "koruna" | "shekel" | "chilean_peso" | "philippine_peso" | "dirham" | "colombian_peso" | "riyal" | "ringgit" | "leu" | "argentine_peso" | "uruguayan_peso" | "peruvian_sol";
export type CustomEvents = "RegisterNotionPoolManager" | "InsertNotionRecordEvent" | "UpdateNotionRecordEvent" | "ArchiveNotionRecordEvent" | "RestoreArchivedNotionRecordEvent";
export type PropertyType = "IdProperty" | "TitleProperty" | "RichTextProperty" | "NumberProperty" | "EmailProperty" | "PhoneNumberProperty" | "UrlProperty" | "CheckboxProperty" | "DateProperty" | "SelectProperty" | "MultiSelectProperty";
export type NotionPropertyType = IdProperty | TitleProperty | RichTextProperty;
export type ExecType = "InsertRecord" | "UpdateRecord" | "ArchiveRecord" | "RestoreArchivedRecord";
export type ColorType = "default" | "brown" | "blue" | "red" | "green" | "yellow" | "orange" | "gray" | "pink" | "purple";
export type SelectOption = { name: string, color?: ColorType, id?: string }
export const RegisterNotionPoolManager = (secrets: string[], version: string, root: string) => {
  WorkerThread.registerPool(secrets, version, root);
}
export abstract class BaseNotionContext<T extends NotionEntity> {
  constructor(private databaseId: string) { }

  public insert(entity: T) {
    const record = new RecordBuilder(this.databaseId);
    Object.keys(entity).forEach(key => {
      const val = (entity as any)[key];
      if (val) {
        record.addProperty(key, val);
      }
    });
    const payload = record.build("Insert");
    // console.log(JSON.stringify(payload, null, 2));
    return WorkerThread.postEventMessage<T>({
      type: "InsertNotionRecordEvent",
      payload
    });
  }

  public update(entity: T) {
    if (!entity.IdProperty) {
      throw "record id missing";
    }
    const id = entity.IdProperty.get().value;
    const record = new RecordBuilder(id);
    Object.keys(entity).forEach(key => {
      const val = (entity as any)[key];
      if (val) {
        record.addProperty(key, val);
      }
    });
    WorkerThread.postEventMessage<T>({
      type: "UpdateNotionRecordEvent",
      payload: record.build("Update")
    });
  }

  public archive(entity: T) {
    if (!entity.IdProperty) {
      throw "record id missing";
    }
    const id = entity.IdProperty.get().value;
    WorkerThread.postEventMessage({
      type: "ArchiveNotionRecordEvent",
      payload: { page_id: id, archived: true }
    });
  }

  public restore(entity: T) {
    if (!entity.IdProperty) {
      throw "record id missing";
    }
    const id = entity.IdProperty.get().value;
    WorkerThread.postEventMessage({
      type: "RestoreArchivedNotionRecordEvent",
      payload: { page_id: id, archived: false }
    });
  }

}

export interface Message {
  id?: string;
  type: CustomEvents;
  payload: any;
}

export interface EventResponse {
  result: any;
  success: boolean;
  reason?: any;
}

export abstract class BaseEvent {
  abstract canHandle(message: Message): boolean;
  abstract handle(message: Message): Promise<any>;
}

export abstract class NotionEntity {
  public IdProperty?: IdProperty;
  constructor() { }
}

export interface DatabaseInfo {
  id: string;
  name: string;
  archived: boolean;
  created_time: string;
  last_edited_time: string;
}

export abstract class Property<T> {
  public abstract readonly type: PropertyType;
  public abstract set(value: T): this;
  public abstract get(): object;
  public abstract schema(): object;
}

export class IdProperty extends Property<string> {
  public readonly type: PropertyType = "IdProperty";
  public constructor(private value: string = "") {
    super();
  }

  public set(value: string): this {
    this.value = value;
    return this
  }

  public get() {
    return {
      value: this.value
    };
  }

  public schema() {
    return {
      value: this.value
    };
  }
}

export class TitleProperty extends Property<string> {
  public readonly type: PropertyType = "TitleProperty";
  public constructor(private value: string = "") {
    super();
  }

  public set(value: string): this {
    this.value = value;
    return this
  }

  public get() {
    return {
      title: [
        {
          text: {
            content: this.value
          }
        }
      ]
    }
  }

  public schema() {
    return {
      title: {}
    }
  }
}

export class RichTextProperty extends Property<string> {
  public readonly type: PropertyType = "RichTextProperty";
  public constructor(private value: string = "") {
    super();
  }

  public set(value: string): this {
    this.value = value;
    return this;
  }

  public get() {
    return {
      rich_text: [
        {
          text: {
            content: this.value
          }
        }
      ]
    }
  }

  public schema() {
    return {
      rich_text: {}
    }
  }
}

export class EmailProperty extends Property<string> {
  public readonly type: PropertyType = "EmailProperty";
  public constructor(private value: string = "") {
    super();
  }

  public set(value: string): this {
    this.value = value;
    return this;
  }

  public get() {
    return {
      email: this.value
    }
  }

  public schema() {
    return {
      email: {}
    }
  }
}

export class PhoneNumberProperty extends Property<string> {
  public readonly type: PropertyType = "PhoneNumberProperty";
  public constructor(private value: string = "") {
    super();
  }

  public set(value: string): this {
    this.value = value;
    return this;
  }

  public get() {
    return {
      phone_number: this.value
    }
  }

  public schema() {
    return {
      phone_number: {}
    }
  }
}

export class UrlProperty extends Property<string> {
  public readonly type: PropertyType = "UrlProperty";
  public constructor(private value: string = "") {
    super();
  }

  public set(value: string): this {
    this.value = value;
    return this;
  }

  public get() {
    return {
      url: this.value
    }
  }

  public schema() {
    return {
      url: {}
    }
  }
}

export class CheckboxProperty extends Property<boolean> {
  public readonly type: PropertyType = "CheckboxProperty";
  public constructor(private value: boolean = false) {
    super();
  }

  public set(value: boolean): this {
    this.value = value;
    return this;
  }

  public get() {
    return {
      checkbox: this.value
    }
  }

  public schema() {
    return {
      checkbox: {}
    }
  }
}

export class DateProperty extends Property<Date> {
  public readonly type: PropertyType = "DateProperty";
  public constructor(private start?: Date, private end?: Date) {
    super();
  }

  public set(value: Date): this {
    return this.setStart(value);
  }

  public setStart(start: Date): this {
    this.start = start;
    return this;
  }
  public setEnd(endDate: Date): this {
    this.end = endDate;
    return this;
  }

  public get() {
    return {
      date:
      {
        start: this.start?.toISOString() || null,
        end: this.end?.toISOString() || null
      }

    }
  }

  public schema() {
    return {
      date: {}
    }
  }
}

export class NumberProperty extends Property<number> {
  public readonly type: PropertyType = "NumberProperty";
  public constructor(private value: number, private format: NumberFormat = "number") {
    super();
  }

  public set(value: number): this {
    this.value = value;
    return this;
  }

  public setFormat(format: NumberFormat): this {
    this.format = format;
    return this;
  }

  public get() {
    return {
      number: this.value

    }
  }

  public schema() {
    return {
      number: {
        format: this.format || "number"
      }
    }
  }
}

export class SelectProperty extends Property<SelectOption> {
  public readonly type: PropertyType = "SelectProperty";
  public constructor(private value: SelectOption) {
    super();
  }

  public set(value: SelectOption): this {
    this.value = value;
    return this;
  }

  public get() {
    if(!this.value.id) {
      delete this.value.id;
    }
    if(!this.value.color) {
      delete this.value.color;
    }
    return {
      select: this.value
    };
  }

  public schema() {
    return {
      select: {
        options: []
      }
    }
  }
}

export class MultiSelectProperty extends Property<SelectOption[]> {
  public readonly type: PropertyType = "MultiSelectProperty";
  public constructor(private value: SelectOption[]) {
    super();
  }

  public set(value: SelectOption[]): this {
    this.value = value;
    return this;
  }

  public get() {
    this.value.forEach(option => {
      if(!option.id) {
        delete option.id;
      }
      if(!option.color) {
        delete option.color;
      }
    });
    return {
      multi_select: this.value
    };
  }

  public schema() {
    return {
      multi_select: {
        options: []
      }
    }
  }
}