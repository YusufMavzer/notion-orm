import { NumberProperty } from "..";
import { BasePropertyParser } from "./basePropertyParser";

export class NumberPropertyParser extends BasePropertyParser<NumberProperty> {
  canParse(value: any): boolean {
    const { type } = value as { id: string; type: string };
    return type === "number";
  }

  parse(value: any): NumberProperty {
      const prop = value as any;
      const number = prop.number;
      return new NumberProperty(number);
  }
}
