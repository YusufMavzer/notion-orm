import { QueryDatabaseResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { IdProperty, NotionEntity } from "..";
import { TitlePropertyParser } from "./titlePropertyParser";
import { RichTextPropertyParser } from "./richTextPropertyParser";
import { PageParser} from "./pageParser";

export class ListParser<T extends NotionEntity> {
  canParse(value: any): boolean {
    const { object } = value as { id: string; object: string };
    return object == "list"
  }
  parse(value: any): T[] {
    const lst = value as QueryDatabaseResponse;
    const parser = new PageParser<T>();
    const results: T[] = [];
    lst.results.forEach(i => {
      const obj = i as PageObjectResponse;
      if(!parser.canParse(obj)) { return; }
      const page = parser.parse(obj);
      results.push(page);
    })
    return results;
  }
}

const propertyParsers = [
  new TitlePropertyParser(),
  new RichTextPropertyParser()
];