"use server";

import { headers } from "next/headers";

export const getIp = async () => {
  try {
    const headerList = await headers();
    const ip = (headerList?.get?.("x-forwarded-for") ?? "127.0.0.1")?.split(
      ","
    )[0];
    return ip || "127.0.0.1";
  } catch (error) {
    console.error(error);
    return "127.0.0.1";
  }
};
