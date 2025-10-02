export interface ArticleCardProps {
  title: string;
  thumbnail: string | null;
  category: string; // (tidak ditampilkan di desain baru, tapi tetap dipertahankan)
  content: string; // HTML string -> dipakai untuk teaser (excerpt)
  tags: string[]; // (tidak ditampilkan di desain baru)
  author: {
    name: string;
    image: string | null;
    profession?: string; // (tidak ditampilkan di desain baru)
  };
  slug: string;
  publishedAt: Date;
  likesCount: number;
  commentsCount: number;
  className?: string;
  isTalent: boolean;
  isCommunity: boolean;
}

export interface ArticleSectionProps {
  title?: string;
  description?: string;
  articles: ArticleCardProps[];
  viewAllHref?: string;
  className?: string;
}
