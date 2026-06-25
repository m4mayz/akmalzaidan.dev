export function Field({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm text-muted-foreground">
      {label}
      <input
        className="h-11 rounded-none border border-border bg-black px-3 text-foreground outline-none focus:border-white"
        onChange={(event) => onChange(event.target.value)}
        readOnly={readOnly}
        value={value}
      />
    </label>
  );
}

export function Area({
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

export function LocaleGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}
