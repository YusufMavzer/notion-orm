import { TitleProperty } from "..";
import { BasePropertyParser } from "./basePropertyParser";

export class TitlePropertyParser extends BasePropertyParser<TitleProperty> {
  canParse(value: any): boolean {
    const { type } = value as { id: string; type: string };
    return type === "title";
  }

  parse(value: any): TitleProperty {
      const prop = value as any;
      const text = prop.title[0].plain_text;
      return new TitleProperty(text);
  }
}
