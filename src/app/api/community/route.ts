import { getDetailCommunityByUserId } from "@/actions/community";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  const user = await auth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const community = await getDetailCommunityByUserId(user.user.id)();
  return NextResponse.json({ data: community });
};
