import Image from "next/image"

const galleryItems = [
  { src: "/images/asa.jpg", title: "Барилгын явц", label: "Construction" },
  { src: "/images/project-1.jpg", title: "Гадна фасад", label: "Exterior" },
  { src: "/images/dsdasdasdasf.jpg", title: "Интерьер шийдэл", label: "Interior" },
  { src: "/images/project-3.jpg", title: "Орчны зураг", label: "Environment" },
  { src: "/images/two-room-1777448384494-0.jpg", title: "2 өрөө layout", label: "Layout" },
  { src: "/images/5-1777617364714-0.jpg", title: "Том талбай", label: "Apartment" },
]

export function Gallery() {
  return (
    <section id="gallery" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Gallery</p>
          <h2 className="text-3xl font-bold text-slate-950 text-balance md:text-4xl">Барилга, интерьер, орчны зураг</h2>
          <p className="mt-4 leading-8 text-slate-600">Төслийн төрх, layout болон орчны мэдрэмжийг том зурагтай clean grid хэлбэрээр харууллаа.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4 md:auto-rows-[220px]">
          {galleryItems.map((item, index) => (
            <figure
              key={item.src}
              className={[
                "group relative overflow-hidden rounded-lg border border-emerald-900/10 bg-slate-100 shadow-sm shadow-emerald-900/5",
                index === 0 ? "md:col-span-2 md:row-span-2" : "",
                index === 2 ? "md:col-span-2" : "",
              ].join(" ")}
            >
              <Image src={item.src} alt={item.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.82))] p-4 pt-16 text-white">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-200">{item.label}</p>
                <p className="mt-1 text-lg font-bold">{item.title}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
