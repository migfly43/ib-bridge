import * as sanitize from "sanitize-filename";
import { format } from 'date-fns';

export const getFileName = (instrument: string, date: Date) => {
  return "./data/" + sanitize(`${instrument}-${format(date, "YYYYMMDD")}.rdata`);
};