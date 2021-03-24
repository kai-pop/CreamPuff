import dayjs from "dayjs";
import "dayjs/locale/ja";

export { };

declare global {
  interface Date {
    toFormatString(format: string): string;
    between(from: Date, to: Date): boolean;
  }

  interface DateConstructor {
    today: () => Date;
  }
}

Date.prototype.toFormatString = function (format) {
  return dayjs(this)
    .locale("ja")
    .format(format);
}

Date.prototype.between = function (from, to) {
  return from <= this && this <= to;
}


Date.today = function (): Date {
  return new Date(new Date().setHours(0, 0, 0, 0));
}