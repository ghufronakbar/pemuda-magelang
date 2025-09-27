import { getAppData } from "@/actions/app-data";
import { NextResponse } from "next/server";

export const GET = async () => {
  const appData = await getAppData();
  return NextResponse.json({
    data: appData,
  });
};
