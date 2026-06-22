import { notFound } from "next/navigation";

import { ContentCms } from "@/components/cms/content-cms";

export const dynamic = "force-dynamic";

export default function CmsPage() {
    if (process.env.NODE_ENV !== "development") {
        notFound();
    }

    return <ContentCms />;
}
