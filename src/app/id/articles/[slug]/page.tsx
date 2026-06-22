import { ArticleDetailPage } from "@/components/pages/article-detail-page";
import { getArticleSlugs } from "@/lib/content";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
    return getArticleSlugs().map((slug) => ({ slug }));
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return <ArticleDetailPage locale="id" slug={slug} />;
}
