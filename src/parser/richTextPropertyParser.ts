import { RichTextProperty } from "..";
import { BasePropertyParser } from "./basePropertyParser";

export class RichTextPropertyParser extends BasePropertyParser<RichTextProperty> {
  canParse(value: any): boolean {
    const { type } = value as { id: string; type: string };
    return type === "rich_text";
  }

  parse(value: any): RichTextProperty {
      const prop = value as any;
      const text = prop.rich_text[0].plain_text;
      return new RichTextProperty(text);
  }
}
