"use server";

import { db } from "@/lib/db";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { HubCategorySchema, HubInputSchema } from "@/validator/zhub";
import { generateSlug } from "@/lib/helper";

// GET ALL HUBS

const _getHubs = async () => {
  const hubs = await db.hubCategory.findMany({
    include: {
      hubs: {
        orderBy: {
          createdAt: "desc",
        },
      },
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
  const normalizedSlug = decodeURIComponent(slug);
  const hub = await db.hub.findUnique({
    where: { slug: normalizedSlug },
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

// CREATE CATEGORY HUB

const _createUpdateCategoryHub = async (formData: FormData) => {
  const input = HubCategorySchema.safeParse(
    JSON.parse(String(formData.get("payload")))
  );
  if (!input.success) {
    return { ok: false, error: input.error.message };
  }
  if (input.data.id) {
    const categoryHub = await db.hubCategory.update({
      where: { id: input.data.id },
      data: {
        name: input.data.name,
      },
    });
    revalidateTag(`hubs-by-category:${input.data.id}`);
    revalidateTag("hubs");
    return { ok: true, result: categoryHub };
  } else {
    const categoryHub = await db.hubCategory.create({
      data: {
        name: input.data.name,
      },
    });
    revalidateTag(`hubs-by-category:${categoryHub.id}`);
    revalidateTag("hubs");
    revalidatePath("dashboard/manajemen");
    return { ok: true, result: categoryHub };
  }
};

export const createUpdateCategoryHub = _createUpdateCategoryHub;

// CREATE HUB

const _createUpdateHub = async (formData: FormData) => {
  const input = HubInputSchema.safeParse(
    JSON.parse(String(formData.get("payload")))
  );
  if (!input.success) {
    return { ok: false, error: input.error.message };
  }
  if (input.data.id) {
    const hub = await db.hub.update({
      where: { id: input.data.id },
      data: {
        name: input.data.name,
        description: input.data.description,
        image: input.data.image,
        ctaLink: input.data.ctaLink,
        hubCategoryId: input.data.hubCategoryId,
        status: input.data.status,
        slug: generateSlug(input.data.name),
      },
      select: {
        id: true,
        slug: true,
        hubCategoryId: true,
      },
    });
    revalidateTag(`detail-hub:${hub.id}`);
    revalidateTag(`hubs-by-category:${hub.hubCategoryId}`);
    revalidateTag(`detail-hub:${hub.slug}`);
    revalidateTag("hubs");
    revalidateTag("hubs-by-category");
    revalidateTag("detail-hub");
    revalidateTag("hub");
    return { ok: true, result: hub };
  } else {
    const hub = await db.hub.create({
      data: {
        name: input.data.name,
        description: input.data.description,
        image: input.data.image,
        ctaLink: input.data.ctaLink,
        hubCategoryId: input.data.hubCategoryId,
        slug: generateSlug(input.data.name),
      },
    });
    revalidateTag(`detail-hub:${hub.id}`);
    revalidateTag(`hubs-by-category:${hub.hubCategoryId}`);
    revalidateTag(`detail-hub:${hub.slug}`);
    revalidateTag("hubs");
    revalidateTag("hubs-by-category");
    revalidateTag("detail-hub");
    revalidateTag("hub");
    return { ok: true, result: hub };
  }
};

export const createUpdateHub = _createUpdateHub;

// GET HUB BY ID

const _getHubById = async (id: string) => {
  const hub = await db.hub.findUnique({
    where: { id },
    include: {
      hubCategory: true,
    },
  });
  return { ok: true, result: hub };
};

const makeGetHubById = (id: string) =>
  unstable_cache(async () => _getHubById(id), [`hub-by-id`, "v1"], {
    tags: [`hub-by-id:${id}`],
    revalidate: 300,
  });

export const getHubById = makeGetHubById;

// DELETE HUB

const _deleteHub = async (id: string) => {
  console.log("deleteHub", id);
  const hub = await db.hub.delete({
    where: { id },
    select: {
      slug: true,
      hubCategoryId: true,
      id: true,
    },
  });
  revalidateTag(`detail-hub:${hub.id}`);
  revalidateTag(`hubs-by-category:${hub.hubCategoryId}`);
  revalidateTag(`detail-hub:${hub.slug}`);
  revalidateTag("hubs");
  revalidateTag("hubs-by-category");
  return { ok: true, result: hub };
};

export const deleteHub = _deleteHub;

// DELETE CATEGORY HUB

const _deleteCategoryHub = async (id: string) => {
  const categoryHub = await db.hubCategory.delete({
    where: { id },
    select: {
      id: true,
      hubs: {
        select: {
          id: true,
          slug: true,
        },
      },
    },
  });
  revalidateTag(`hubs-by-category:${categoryHub.id}`);
  revalidateTag("hubs");
  categoryHub.hubs.forEach((hub) => {
    revalidateTag(`detail-hub:${hub.id}`);
    revalidateTag(`detail-hub:${hub.slug}`);
  });
  revalidateTag("hubs-by-category");
  return { ok: true, result: categoryHub };
};

export const deleteCategoryHub = _deleteCategoryHub;
