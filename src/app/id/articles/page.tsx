import { ArticlesIndexPage } from "@/components/pages/articles-index-page";

export const dynamic = "force-static";

export default function Page() {
    return <ArticlesIndexPage locale="id" />;
}
