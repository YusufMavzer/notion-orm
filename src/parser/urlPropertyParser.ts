import { UrlProperty } from "..";
import { BasePropertyParser } from "./basePropertyParser";

export class UrlPropertyParser extends BasePropertyParser<UrlProperty> {
  canParse(value: any): boolean {
    const { type } = value as { id: string; type: string };
    return type === "url";
  }

  parse(value: any): UrlProperty {
      const prop = value as any;
      const url = prop.url;
      return new UrlProperty(url);
  }
}
