import { ArticlesIndexPage } from "@/components/pages/articles-index-page";

export const dynamic = "force-static";

export default async function Page() {
    return <ArticlesIndexPage locale="en" />;
}
