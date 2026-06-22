"use client";

import { useEffect, useMemo, useState } from "react";

import type {
    ArticleContentData,
    Locale,
    WorkContentData,
    WorkGalleryItemData,
    WorkSectionSlot,
} from "@/types/content";

type ContentType = "work" | "articles";
type Status = "draft" | "published";

type CmsWork = WorkContentData & {
    id?: number;
    locale: Locale;
    status: Status;
    sortOrder?: number;
};

type CmsArticle = ArticleContentData & {
    id?: number;
    locale: Locale;
    status: Status;
    sortOrder?: number;
};

type CmsItem = CmsWork | CmsArticle;

const slots: WorkSectionSlot[] = ["overview", "challenge", "approach", "outcome"];

const emptyWork: CmsWork = {
    locale: "en",
    status: "draft",
    slug: "",
    title: "",
    year: "",
    description: "",
    image: "",
    alt: "",
    category: "",
    role: "",
    client: "",
    summary: "",
    sections: slots.map((slot) => ({
        slot,
        heading: slot[0].toUpperCase() + slot.slice(1),
        body: [""],
    })),
    gallery: [],
};

const emptyArticle: CmsArticle = {
    locale: "en",
    status: "draft",
    slug: "",
    title: "",
    description: "",
    image: "",
    alt: "",
    publishedAt: "",
    lead: "",
    blocks: [{ heading: "", paragraphs: [""] }],
};

function splitParagraphs(value: string) {
    return value
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);
}

function joinParagraphs(value: string[]) {
    return value.join("\n\n");
}

function cloneWork(locale: Locale): CmsWork {
    return structuredClone({ ...emptyWork, locale });
}

function cloneArticle(locale: Locale): CmsArticle {
    return structuredClone({ ...emptyArticle, locale });
}

function isWork(type: ContentType, item: CmsItem): item is CmsWork {
    return type === "work";
}

function Field({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="grid gap-2 text-sm text-muted-foreground">
            {label}
            <input
                className="h-11 rounded-none border border-border bg-black px-3 text-foreground outline-none focus:border-white"
                onChange={(event) => onChange(event.target.value)}
                value={value}
            />
        </label>
    );
}

function Area({
    label,
    rows = 6,
    value,
    onChange,
}: {
    label: string;
    rows?: number;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="grid gap-2 text-sm text-muted-foreground">
            {label}
            <textarea
                className="rounded-none border border-border bg-black p-3 text-foreground outline-none focus:border-white"
                onChange={(event) => onChange(event.target.value)}
                rows={rows}
                value={value}
            />
        </label>
    );
}

export function ContentCms() {
    const [type, setType] = useState<ContentType>("work");
    const [locale, setLocale] = useState<Locale>("en");
    const [items, setItems] = useState<CmsItem[]>([]);
    const [current, setCurrent] = useState<CmsItem>(cloneWork("en"));
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const currentTitle = current.title || "Untitled";
    const galleryText = useMemo(
        () =>
            isWork(type, current)
                ? JSON.stringify(current.gallery, null, 2)
                : "[]",
        [current, type],
    );

    const loadItems = async () => {
        setIsLoading(true);
        const response = await fetch(
            `/api/cms/content?type=${type}&locale=${locale}`,
        );
        const data = (await response.json()) as { items: CmsItem[] };
        setItems(data.items);
        setIsLoading(false);
    };

    useEffect(() => {
        void loadItems();
        setCurrent(type === "work" ? cloneWork(locale) : cloneArticle(locale));
    }, [locale, type]);

    const update = (patch: Partial<CmsItem>) => {
        setCurrent((item) => ({ ...item, ...patch }) as CmsItem);
    };

    const save = async () => {
        if (!current.slug.trim()) {
            setMessage("Slug is required.");
            return;
        }

        await fetch("/api/cms/content", {
            body: JSON.stringify({ type, item: current }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        });
        setMessage(`Saved ${current.title || current.slug}.`);
        await loadItems();
    };

    const remove = async () => {
        if (!current.slug.trim()) return;

        await fetch("/api/cms/content", {
            body: JSON.stringify({ locale, slug: current.slug, type }),
            headers: { "Content-Type": "application/json" },
            method: "DELETE",
        });
        setCurrent(type === "work" ? cloneWork(locale) : cloneArticle(locale));
        setMessage("Deleted.");
        await loadItems();
    };

    const upload = async (file: File) => {
        if (!current.slug.trim()) {
            setMessage("Set slug before uploading.");
            return;
        }

        const form = new FormData();
        form.set("file", file);
        form.set("type", type);
        form.set("slug", current.slug);

        const response = await fetch("/api/cms/upload", {
            body: form,
            method: "POST",
        });
        const data = (await response.json()) as { src?: string; error?: string };

        if (!data.src) {
            setMessage(data.error ?? "Upload failed.");
            return;
        }

        update({ image: data.src });
        setMessage(`Uploaded ${data.src}`);
    };

    return (
        <main className="min-h-screen bg-background px-5 py-8 text-foreground md:px-10">
            <div className="mx-auto grid max-w-[89.5rem] gap-8 md:grid-cols-[320px_1fr]">
                <aside className="space-y-5">
                    <div>
                        <h1 className="font-heading text-4xl font-light leading-none">
                            CMS
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Local dev only
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {(["work", "articles"] as ContentType[]).map((item) => (
                            <button
                                className={`h-10 border px-4 text-sm ${
                                    type === item
                                        ? "border-white bg-white text-black"
                                        : "border-border text-muted-foreground"
                                }`}
                                key={item}
                                onClick={() => setType(item)}
                                type="button"
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        {(["en", "id"] as Locale[]).map((item) => (
                            <button
                                className={`h-9 border px-4 text-sm uppercase ${
                                    locale === item
                                        ? "border-white bg-white text-black"
                                        : "border-border text-muted-foreground"
                                }`}
                                key={item}
                                onClick={() => setLocale(item)}
                                type="button"
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <button
                        className="h-10 w-full border border-white bg-white px-4 text-sm text-black"
                        onClick={() =>
                            setCurrent(
                                type === "work"
                                    ? cloneWork(locale)
                                    : cloneArticle(locale),
                            )
                        }
                        type="button"
                    >
                        New {type === "work" ? "work" : "article"}
                    </button>

                    <div className="space-y-2">
                        {isLoading ? (
                            <p className="text-sm text-muted-foreground">
                                Loading...
                            </p>
                        ) : null}
                        {items.map((item) => (
                            <button
                                className="block w-full border border-border p-3 text-left transition-colors hover:border-white"
                                key={`${item.locale}-${item.slug}`}
                                onClick={() => setCurrent(structuredClone(item))}
                                type="button"
                            >
                                <span className="block text-sm">
                                    {item.title || item.slug}
                                </span>
                                <span className="mt-1 block text-xs text-muted-foreground">
                                    {item.status} / {item.slug}
                                </span>
                            </button>
                        ))}
                    </div>
                </aside>

                <section className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
                        <div>
                            <h2 className="text-2xl leading-tight">
                                {currentTitle}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {type} / {locale}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="h-10 border border-border px-4 text-sm text-muted-foreground"
                                onClick={remove}
                                type="button"
                            >
                                Delete
                            </button>
                            <button
                                className="h-10 border border-white bg-white px-5 text-sm text-black"
                                onClick={save}
                                type="button"
                            >
                                Save
                            </button>
                        </div>
                    </div>

                    {message ? (
                        <p className="border border-border px-3 py-2 text-sm text-muted-foreground">
                            {message}
                        </p>
                    ) : null}

                    <div className="grid gap-4 md:grid-cols-2">
                        <Field
                            label="Slug"
                            onChange={(slug) => update({ slug })}
                            value={current.slug}
                        />
                        <Field
                            label="Title"
                            onChange={(title) => update({ title })}
                            value={current.title}
                        />
                        <Field
                            label="Description"
                            onChange={(description) => update({ description })}
                            value={current.description}
                        />
                        <Field
                            label="Cover image"
                            onChange={(image) => update({ image })}
                            value={current.image}
                        />
                        <Field
                            label="Alt"
                            onChange={(alt) => update({ alt })}
                            value={current.alt}
                        />
                        <label className="grid gap-2 text-sm text-muted-foreground">
                            Status
                            <select
                                className="h-11 rounded-none border border-border bg-black px-3 text-foreground outline-none focus:border-white"
                                onChange={(event) =>
                                    update({ status: event.target.value as Status })
                                }
                                value={current.status}
                            >
                                <option value="draft">draft</option>
                                <option value="published">published</option>
                            </select>
                        </label>
                        <label className="grid gap-2 text-sm text-muted-foreground">
                            Upload cover
                            <input
                                className="h-11 border border-border bg-black px-3 py-2 text-sm"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) void upload(file);
                                }}
                                type="file"
                            />
                        </label>
                    </div>

                    {isWork(type, current) ? (
                        <WorkForm
                            item={current}
                            onChange={(patch) => update(patch)}
                            galleryText={galleryText}
                        />
                    ) : (
                        <ArticleForm
                            item={current}
                            onChange={(patch) => update(patch)}
                        />
                    )}
                </section>
            </div>
        </main>
    );
}

function WorkForm({
    galleryText,
    item,
    onChange,
}: {
    galleryText: string;
    item: CmsWork;
    onChange: (patch: Partial<CmsWork>) => void;
}) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <Field
                    label="Year"
                    onChange={(year) => onChange({ year })}
                    value={item.year}
                />
                <Field
                    label="Category"
                    onChange={(category) => onChange({ category })}
                    value={item.category}
                />
                <Field
                    label="Role"
                    onChange={(role) => onChange({ role })}
                    value={item.role}
                />
                <Field
                    label="Client"
                    onChange={(client) => onChange({ client })}
                    value={item.client}
                />
            </div>
            <Area
                label="Summary"
                rows={3}
                onChange={(summary) => onChange({ summary })}
                value={item.summary}
            />
            {item.sections.map((section, index) => (
                <div className="grid gap-3" key={section.slot}>
                    <Field
                        label={`${section.slot} heading`}
                        onChange={(heading) => {
                            const sections = [...item.sections];
                            sections[index] = { ...section, heading };
                            onChange({ sections });
                        }}
                        value={section.heading}
                    />
                    <Area
                        label={`${section.slot} body`}
                        onChange={(value) => {
                            const sections = [...item.sections];
                            sections[index] = {
                                ...section,
                                body: splitParagraphs(value),
                            };
                            onChange({ sections });
                        }}
                        value={joinParagraphs(section.body)}
                    />
                </div>
            ))}
            <Area
                label="Gallery JSON"
                rows={8}
                onChange={(value) => {
                    try {
                        onChange({
                            gallery: JSON.parse(value) as WorkGalleryItemData[],
                        });
                    } catch {
                        return;
                    }
                }}
                value={galleryText}
            />
        </div>
    );
}

function ArticleForm({
    item,
    onChange,
}: {
    item: CmsArticle;
    onChange: (patch: Partial<CmsArticle>) => void;
}) {
    const block = item.blocks[0] ?? { heading: "", paragraphs: [""] };

    return (
        <div className="space-y-6">
            <Field
                label="Published at"
                onChange={(publishedAt) => onChange({ publishedAt })}
                value={item.publishedAt}
            />
            <Area
                label="Lead"
                rows={4}
                onChange={(lead) => onChange({ lead })}
                value={item.lead}
            />
            <Field
                label="Block heading"
                onChange={(heading) =>
                    onChange({ blocks: [{ ...block, heading }] })
                }
                value={block.heading ?? ""}
            />
            <Area
                label="Article paragraphs"
                rows={12}
                onChange={(value) =>
                    onChange({
                        blocks: [
                            {
                                ...block,
                                paragraphs: splitParagraphs(value),
                            },
                        ],
                    })
                }
                value={joinParagraphs(block.paragraphs)}
            />
        </div>
    );
}
