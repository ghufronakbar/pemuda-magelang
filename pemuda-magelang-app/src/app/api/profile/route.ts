import { getDetailUser } from "@/actions/user";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  const user = await auth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const detailUser = await getDetailUser(user.user.id)();
  return NextResponse.json({ data: detailUser });
};
