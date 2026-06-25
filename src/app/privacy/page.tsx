import type { Metadata } from "next";

import { PrivacyPage } from "@/components/pages/privacy-page";
import { getPrivacyData, getSiteData } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
    const site = await getSiteData("en");
    const privacy = await getPrivacyData("en");

    return {
        title: `${privacy.title} - ${site.name}`,
        description:
            "How this portfolio handles contact messages, hosting, analytics, retention, and privacy rights.",
    };
}

export default function Page() {
    return <PrivacyPage locale="en" />;
}
