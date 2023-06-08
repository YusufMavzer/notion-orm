
import "reflect-metadata";
import { EmailProperty, IdProperty, PhoneNumberProperty, Property, RichTextProperty, TitleProperty, UrlProperty, CheckboxProperty, DateProperty, NumberProperty } from "../index";

export const Title = () =>
  (target: any, key: string | symbol) =>
    BasePropertyDecorator<TitleProperty>(
      target,
      key,
      new TitleProperty(),
      (val: any) => new TitleProperty(val)
    );

export const RichText = () =>
  (target: any, key: string | symbol) =>
    BasePropertyDecorator<RichTextProperty>(
      target,
      key,
      new RichTextProperty(),
      (val: any) => new RichTextProperty(val)
    );

export const Id = () =>
  (target: any, key: string | symbol) =>
    BasePropertyDecorator<IdProperty>(
      target,
      key,
      new IdProperty(),
      (val: any) => new IdProperty(val)
    );

export const Email = () =>
  (target: any, key: string | symbol) =>
    BasePropertyDecorator<EmailProperty>(
      target,
      key,
      new EmailProperty(),
      (val: any) => new EmailProperty(val)
    );

export const Phone = () =>
  (target: any, key: string | symbol) =>
    BasePropertyDecorator<PhoneNumberProperty>(
      target,
      key,
      new PhoneNumberProperty(),
      (val: any) => new PhoneNumberProperty(val)
    );

export const Url = () =>
  (target: any, key: string | symbol) =>
    BasePropertyDecorator<UrlProperty>(
      target,
      key,
      new UrlProperty(),
      (val: any) => new UrlProperty(val)
    );

export const Checkbox = () =>
  (target: any, key: string | symbol) =>
    BasePropertyDecorator<CheckboxProperty>(
      target,
      key,
      new CheckboxProperty(),
      (val: any) => new CheckboxProperty(val)
    );

export const Date = () =>
  (target: any, key: string | symbol) =>
    BasePropertyDecorator<DateProperty>(
      target,
      key,
      new DateProperty(),
      (val: any) => new DateProperty(val)
    );

export function NotionDatabase(id: string) {
  return function (target: any) {
    target.prototype.toJSON = () => {
      const obj = target.prototype;
      const propertyKeys = Object.keys(obj).filter(k => typeof obj[k] != "function");

      let base = {
        page_id: undefined as undefined | string,
        parent: {
          database_id: id
        },
        properties: {} as Record<string, object>
      };

      propertyKeys.map(k => {
        const property = Reflect.getMetadata(k, obj, k) as Property<any> | undefined;
        if (!property) {
          return;
        }
        if (property.type == "IdProperty") {
          const page_id = (property as IdProperty).get().value;
          if (page_id) {
            base.page_id = page_id;
          }
          return;
        }
        base.properties[k] = property.get();
      });
      return base;
    }
  };
}

const BasePropertyDecorator = <T extends Property<any>>(target: any, key: string | symbol, property: T, set: (val: any) => T) => {
  if (typeof key != "string") {
    return;
  }

  let value = target[key];
  Reflect.defineMetadata(key, property, target!, key);
  Object.defineProperty(target, key, {
    get: () => value,
    set: (newValue: any) => {
      Reflect.defineMetadata(key, set(newValue), target!, key);
      value = newValue;
    },
    enumerable: true,
    configurable: true,
  });
}