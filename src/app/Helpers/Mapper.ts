import { omit, pick } from 'radash';
import { objectToCamel } from 'ts-case-convert';

export class Mapper {
  static omitArr<T extends object, K extends keyof T>(
    data: T[],
    keys: K[],
  ) {
    return data.map((item) => omit(item, keys));
  }

  static omit<T extends object, K extends keyof T>(data: T, keys: K[]) {
    return omit(data, keys);
  }
  static pickArr<T extends object, K extends keyof T>(data: T[], keys: K[]) {
    return data.map((item) => pick(item, keys));
  }

  static pick<T extends object, K extends keyof T>(data: T, keys: K[]) {
    return pick(data, keys);
  }

  static camel<T extends object>(data: T) {
    if (Array.isArray(data)) {
      return data.map((val) => objectToCamel(val));
    } else {
      return objectToCamel(data);
    }
  }

  static clearNullOrUndefinedKeys<Type extends object>(
    obj?: Type,
  ): Record<string, any> | undefined {
    if (!obj) return undefined;
    let cleanedObject = undefined as Record<string, any> | undefined;
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (!cleanedObject) {
          cleanedObject = {
            [key]: value,
          };
        } else {
          cleanedObject[key] = value;
        }
      }
    });
    return cleanedObject;
  }
}
