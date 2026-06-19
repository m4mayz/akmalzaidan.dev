import Link from "next/link";

export function ContactSection() {
  return (
    <section className="px-5 pb-12 pt-16 md:px-10 md:pb-16 md:pt-32" data-reveal>
      <p className="mb-8 text-[11px] uppercase leading-none text-muted-foreground">
        LET&apos;S WORK TOGETHER
      </p>
      <Link
        className="gradient-text inline-block max-w-full break-words font-heading text-[48px] font-light leading-[1.05] tracking-normal md:text-[92px] xl:text-[122px]"
        data-cursor="link"
        href="mailto:kristian.ulrych@gmail.com"
      >
        kristian.ulrych@gmail.com
      </Link>
    </section>
  );
}
