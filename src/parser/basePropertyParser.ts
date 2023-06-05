import { Property } from "..";

export abstract class BasePropertyParser<T extends Property<any>> {
  abstract canParse(value: any): boolean;
  abstract parse(value: any): T
}