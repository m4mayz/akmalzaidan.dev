import { WorkDetailPage } from "@/components/pages/work-detail-page";
import { getWorkSlugs } from "@/lib/content";

export function generateStaticParams() {
    return getWorkSlugs().map((slug) => ({ slug }));
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return <WorkDetailPage locale="id" slug={slug} />;
}
