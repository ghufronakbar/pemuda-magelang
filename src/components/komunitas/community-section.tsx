"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CommunityCard, CommunityCardProps } from "./community-card";
import { useMemo } from "react";
import { useFilter } from "../filter/filter-context";
import { Filter } from "../filter/filter";
import { COMMUNITY_CATEGORIES } from "@/data/community";
import { Reveal } from "@/components/ui/reveal";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
	CardAction,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";

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
    const bySearch = (c: CommunityCardProps) =>
      c.name.toLowerCase().includes(search.toLowerCase());
    const byCategory = (c: CommunityCardProps) =>
      category === "" ? true : c.category === category;
    return communities.filter((c) => bySearch(c) && byCategory(c));
  }, [communities, search, category]);

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
						{data.map((t, i) => (
							<Reveal key={t.slug} delayMs={i * 80}>
								<CommunityCard {...t} />
							</Reveal>
						))}
					</div>

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
