import type { Metadata } from "next";

import { ArticleDetailPage } from "@/components/pages/article-detail-page";
import { getArticleSlugs } from "@/lib/content";
import { getArticleMetadata } from "@/lib/page-metadata";

export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
    return (await getArticleSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;

    return getArticleMetadata("en", slug);
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return <ArticleDetailPage locale="en" slug={slug} />;
}
