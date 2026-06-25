import type { Metadata } from "next";

import { PrivacyPage } from "@/components/pages/privacy-page";
import { getPrivacyData, getSiteData } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
    const site = await getSiteData("id");
    const privacy = await getPrivacyData("id");

    return {
        title: `${privacy.title} - ${site.name}`,
        description:
            "Kebijakan privasi tentang contact form, hosting, analytics, retensi, dan hak privasi di portofolio Akmal Zaidan.",
    };
}

export default function Page() {
    return <PrivacyPage locale="id" />;
}
