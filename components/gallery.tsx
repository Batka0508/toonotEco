import Image from "next/image"
import type { HomepageContent } from "@/lib/homepage-content"

export function Gallery({ content }: { content: HomepageContent["gallery"] }) {
  return (
    <section id="gallery" className="relative overflow-hidden bg-black py-16 text-white md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(16,185,129,0.14),transparent_26rem),radial-gradient(circle_at_12%_82%,rgba(20,184,166,0.1),transparent_24rem),linear-gradient(180deg,#020617,#000)]" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-black uppercase tracking-wide text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">{content.eyebrow}</p>
          <h2 className="text-3xl font-black text-white text-balance md:text-4xl">{content.title}</h2>
          <p className="mt-4 leading-8 text-cyan-50/72">{content.description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4 md:auto-rows-[220px]">
          {content.items.map((item, index) => (
            <figure
              key={item.src}
              className={[
                "group relative min-h-[260px] overflow-hidden rounded-[1.35rem] border border-cyan-200/16 bg-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_70px_rgba(0,0,0,0.22)] sm:min-h-[320px] md:min-h-0",
                index === 0 ? "md:col-span-2 md:row-span-2" : "",
                index === 2 ? "md:col-span-2" : "",
              ].join(" ")}
            >
              <Image src={item.src} alt={item.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover opacity-88 transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 border border-white/5 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.82))] transition-colors group-hover:bg-[linear-gradient(180deg,rgba(16,185,129,0.06),rgba(0,0,0,0.86))]" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 pt-16 text-white">
                <p className="text-xs font-black uppercase tracking-wide text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.7)]">{item.label}</p>
                <p className="mt-1 text-lg font-black">{item.title}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
