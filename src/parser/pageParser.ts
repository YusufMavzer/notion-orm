import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { IdProperty, NotionEntity } from "..";
import { TitlePropertyParser } from "./titlePropertyParser";
import { RichTextPropertyParser } from "./richTextPropertyParser";
import { DatePropertyParser } from "./datePropertyParser";
import { UrlPropertyParser } from "./urlPropertyParser";
import { NumberPropertyParser } from "./numberPropertyParser";

export class PageParser<T extends NotionEntity> {
  canParse(value: any): boolean {
    const { object } = value as { id: string; object: string};
    return object == "page"
  }
  parse(value: any): T {
    const obj = value as PageObjectResponse;
    const result: T = {} as T;
    result.IdProperty = new IdProperty(obj.id);
    var propertyNames = Object.keys(obj.properties);
    propertyNames.forEach(key => {
      const property = obj.properties[key];
      propertyParsers.forEach(parser => {
        const canParse = parser.canParse(property);
        if(canParse) {
          var parsedProperty = parser.parse(property);
          (result as any)[key] = parsedProperty;
        }
      });
    })
    return result;
  }
}

const propertyParsers = [
  new TitlePropertyParser(),
  new RichTextPropertyParser(),
  new UrlPropertyParser(),
  new DatePropertyParser(),
  new NumberPropertyParser()
];