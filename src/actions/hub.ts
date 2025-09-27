"use server";

import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

// GET ALL HUBS

const _getHubs = async () => {
  const hubs = await db.hubCategory.findMany({
    select: {
      id: true,
      name: true,
      hubs: {
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          status: true,
          slug: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },

      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return hubs;
};

const makeGetHubs = () =>
  unstable_cache(async () => _getHubs(), [`hubs`, "v1"], {
    tags: [`hubs`],
    revalidate: 300,
  });

export const getAllHubs = makeGetHubs();

// GET DETAIL HUB

const _getDetailHub = async (slug: string) => {
  const hub = await db.hub.findUnique({
    where: { slug },
    include: {
      hubCategory: {
        include: {
          hubs: true,
        },
      },
    },
  });
  return hub;
};

const makeGetDetailHub = () =>
  unstable_cache(async (slug: string) => _getDetailHub(slug), [`hub`, "v1"], {
    tags: [`detail-hub`],
    revalidate: 300,
  });

export const getDetailHub = makeGetDetailHub();

// GET CATEGORY HUB BY ID

const _getCategoryHub = async (categoryId: string) => {
  const hubs = await db.hubCategory.findUnique({
    where: { id: categoryId },
    include: {
      hubs: true,
    },
  });
  return hubs;
};

export const makeGetCategoryHub = async () =>
  unstable_cache(
    async (categoryId: string) => _getCategoryHub(categoryId),
    [`hubs-by-category`, "v1"],
    {
      tags: [`hubs-by-category`],
      revalidate: 300,
    }
  );

export const getCategoryHub = makeGetCategoryHub;
