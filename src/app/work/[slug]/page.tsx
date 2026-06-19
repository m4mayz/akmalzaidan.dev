import { PlaceholderPage } from "@/components/placeholder-page";

type WorkDetailPageProps = {
    params: Promise<{ slug: string }>;
};

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
    const { slug } = await params;
    const title = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return (
        <PlaceholderPage
            description="This project detail page is being prepared. The route exists so navigation can transition cleanly while the full case study is built."
            eyebrow="Case study"
            title={title}
        />
    );
}
