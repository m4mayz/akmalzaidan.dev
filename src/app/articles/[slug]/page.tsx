import { PlaceholderPage } from "@/components/placeholder-page";

type ArticleDetailPageProps = {
    params: Promise<{ slug: string }>;
};

export default async function ArticleDetailPage({
    params,
}: ArticleDetailPageProps) {
    const { slug } = await params;
    const title = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return (
        <PlaceholderPage
            description="This article page is being prepared. The route exists so navigation can transition cleanly while the full article is built."
            eyebrow="Article"
            title={title}
        />
    );
}
