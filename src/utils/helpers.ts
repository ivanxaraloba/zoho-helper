import axios from "axios";
import { formatInTimeZone } from "date-fns-tz";

export const chunk = (input: any[], size: number) => {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
  }, []);
};

export const log = async (
  type: "success" | "error" | "warning" | "info",
  notes: any,
) => {
  await axios.post("https://lobaadmin-zohofunctionstogit.vercel.app/api/logs", {
    type,
    notes,
    projectUsername: "demo7",
    function: "desk-import",
  });
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const formatDatetime = (date: string) => {
  return formatInTimeZone(date, "Europe/Lisbon", "yyyy-MM-dd HH:mm:ss");
};
