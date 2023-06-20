import { DateProperty } from "..";
import { BasePropertyParser } from "./basePropertyParser";

export class DatePropertyParser extends BasePropertyParser<DateProperty> {
  canParse(value: any): boolean {
    const { type } = value as { id: string; type: string };
    return type === "date";
  }

  parse(value: any): DateProperty {
      const prop = value as any;
      let startDate: Date | undefined = undefined;
      let endDate: Date | undefined = undefined;

      const {start, end, time_zone} = prop.date;

      if(start) {
        startDate = new Date(Date.parse(`${start}T00:00:00Z`));
      }
      if(end) {
        endDate = new Date(Date.parse(`${end}T00:00:00Z`));
      }

      return new DateProperty(startDate, endDate);
  }
}
