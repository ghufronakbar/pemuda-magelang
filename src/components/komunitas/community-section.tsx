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
import { usePagination } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
					{/* Pagination - match user management style */}
					{pager.totalPages > 1 && (
						<div className="mt-6 flex items-center justify-between">
							<div className="text-sm text-muted-foreground">
								Menampilkan {data.length === 0 ? 0 : pager.start + 1}
								–{Math.min(pager.end, data.length)} dari {data.length} komunitas
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
									disabled={pager.page === 1}
								>
									<ChevronLeft className="w-4 h-4" />
									Sebelumnya
								</Button>
								<div className="flex items-center gap-1">
									{Array.from({ length: Math.min(pager.totalPages, 5) }, (_, i) => {
										let pageNum: number;
										if (pager.totalPages <= 5) {
											pageNum = i + 1;
										} else if (pager.page <= 3) {
											pageNum = i + 1;
										} else if (pager.page >= pager.totalPages - 2) {
											pageNum = pager.totalPages - 4 + i;
										} else {
											pageNum = pager.page - 2 + i;
										}
										return (
											<Button
												key={pageNum}
												variant={pager.page === pageNum ? "default" : "outline"}
												size="sm"
												className="w-8 h-8 p-0"
												onClick={() => setPage(pageNum)}
											>
												{pageNum}
											</Button>
										);
									})}
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPage((prev) => Math.min(prev + 1, pager.totalPages))}
									disabled={pager.page === pager.totalPages}
								>
									Selanjutnya
									<ChevronRight className="w-4 h-4" />
								</Button>
							</div>
						</div>
					)}

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
