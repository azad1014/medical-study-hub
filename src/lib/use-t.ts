import zh from "@/messages/zh-CN.json";

type Messages = typeof zh;

export function useT() {
  function t(path: string, params?: Record<string, string | number>): string {
    const keys = path.split(".");
    let value: any = zh;
    for (const key of keys) {
      value = value?.[key];
    }
    if (typeof value !== "string") return path;
    if (!params) return value;
    return Object.entries(params).reduce(
      (str, [k, v]) => str.replace(`{${k}}`, String(v)),
      value
    );
  }
  return { t };
}

export type { Messages };
