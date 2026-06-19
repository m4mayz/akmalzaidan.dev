import type { Metadata } from "next";

import { PrivacyPage } from "@/components/pages/privacy-page";

export const metadata: Metadata = {
    title: "Kebijakan Privasi - Akmal Zaidan",
    description:
        "Kebijakan privasi untuk website portofolio Akmal Zaidan, contact form, analytics, retensi, dan hak privasi.",
};

export default function Page() {
    return <PrivacyPage locale="id" />;
}
