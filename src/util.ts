import { Property } from ".";

export class DatabaseBuilder {
  private properties: Record<string, object> = {};

  constructor(private pageId: string, private name: string) { }

  public addProperty<T extends Property<any>>(name: string, property: T) {
    this.properties[name] = property.schema();
    return this;
  }

  public build(): any {
    return {
      parent: {
        type: "page_id",
        page_id: this.pageId
      },
      icon: {
        type: "emoji",
        emoji: "📁"
      },
      title: [
        {
          type: "text",
          text: {
            content: this.name,
            link: null
          }
        }
      ],
      properties: this.properties
    }
  }
}

export class RecordBuilder {
  private properties: Record<string, object> = {};

  constructor(private id: string) { }

  public addProperty<T extends Property<any>>(name: string, property: T) {
    if (property.type !== "IdProperty") {
      this.properties[name] = property.get();
    }
    return this;
  }

  public build(type: "Insert" | "Update" | "List"): any {
    if (type == "List") {
      return {
        database_id: this.id
      }
    }
    if (type == "Insert") {
      return {
        parent: {
          type: "database_id",
          database_id: this.id
        },
        properties: this.properties
      }
    } else {
      return {
        page_id: this.id,
        properties: this.properties
      }
    }

  }
}
