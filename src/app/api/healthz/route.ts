import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const [articles, users, communities, products, hubs] = await Promise.all([
      db.article.findMany(),
      db.user.findMany(),
      db.community.findMany(),
      db.product.findMany(),
      db.hub.findMany(),
    ]);
    const count = {
      articles: articles.length,
      users: users.length,
      communities: communities.length,
      products: products.length,
      hubs: hubs.length,
    };
    return NextResponse.json({ message: "OK", count });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
