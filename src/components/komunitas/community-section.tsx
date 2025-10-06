"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CommunityCard, CommunityCardProps } from "./community-card";
import { useMemo, useState } from "react";
import { useFilter } from "../filter/filter-context";
import { Filter } from "../filter/filter";
import { COMMUNITY_CATEGORIES } from "@/data/community";
import { Reveal } from "@/components/ui/reveal";
import { computeSearchScore } from "@/lib/search";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
	CardAction,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Pagination, usePagination } from "@/components/ui/pagination";

export interface CommunitySectionProps {
  title?: string;
  description?: string;
  communities: CommunityCardProps[];
  limit?: number;
  viewAllHref?: string;
  className?: string;
}

export function CommunitySection({
  title = "Komunitas",
  description = "Temukan komunitas dan bergabung bersama.",
  communities,
  limit,
  viewAllHref,
  className,
}: CommunitySectionProps) {
  const { search, category } = useFilter();
  const categories = useMemo(() => {
    return COMMUNITY_CATEGORIES;
  }, []);
  const data = useMemo(() => {
    const filtered = communities
      .map((c) => ({
        item: c,
        score: computeSearchScore(c, search, {
          name: { weight: 3, accessor: (x) => x.name },
          description: { weight: 1.5, accessor: (x) => x.description },
          category: { weight: 1.2, accessor: (x) => x.category },
        }),
      }))
      .filter(({ score }) => (search ? score > 0 : true))
      .filter(({ item }) => (category === "" ? true : item.category === category))
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
    return filtered;
  }, [communities, search, category]);
  const [page, setPage] = useState(1);
  const pageSize = 16;
  const pager = usePagination(page, pageSize, data.length);
  const visible = useMemo(() => data.slice(pager.start, pager.end), [data, pager.start, pager.end]);

  return (
		<section
			className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
		>
			<Card className="bg-card/50 backdrop-blur">
				<CardHeader className="border-b">
					<Reveal>
						<div>
							<CardTitle className="text-xl sm:text-2xl font-semibold">{title}</CardTitle>
							{description && (
								<CardDescription className="mt-1">{description}</CardDescription>
							)}
						</div>
					</Reveal>
					{viewAllHref && (
						<CardAction>
							<Button asChild variant="ghost" className="hidden sm:inline-flex">
								<Link href={viewAllHref}>Lihat semua →</Link>
							</Button>
						</CardAction>
					)}
				</CardHeader>

				<CardContent>
					<Reveal delayMs={80}>
						<Filter
							categories={categories}
							className="mb-4"
							placeholder="Cari komunitas..."
							hideReset
						/>
					</Reveal>

					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{visible.map((t, i) => (
							<Reveal key={t.slug} delayMs={i * 80}>
								<CommunityCard {...t} />
							</Reveal>
						))}
					</div>
					<Pagination
						page={pager.page}
						totalPages={pager.totalPages}
						onPageChange={setPage}
						className="mt-6"
					/>

					{data.length === 0 && (
						<div className="mt-2 flex flex-col gap-5 max-w-4xl mx-auto h-40 items-center justify-center">
							<p className="text-center text-sm text-muted-foreground">
								Tidak ada komunitas yang cocok dengan pencarian
							</p>
						</div>
					)}
				</CardContent>

				{viewAllHref && (
					<CardFooter className="sm:hidden">
						<Button asChild variant="outline" className="w-full">
							<Link href={viewAllHref}>Lihat semua</Link>
						</Button>
					</CardFooter>
				)}
			</Card>
		</section>
  );
}
