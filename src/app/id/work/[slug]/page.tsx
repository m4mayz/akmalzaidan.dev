import type { Metadata } from "next";

import { WorkDetailPage } from "@/components/pages/work-detail-page";
import { getWorkSlugs } from "@/lib/content";
import { getWorkMetadata } from "@/lib/page-metadata";

export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
    return (await getWorkSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;

    return getWorkMetadata("id", slug);
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return <WorkDetailPage locale="id" slug={slug} />;
}
