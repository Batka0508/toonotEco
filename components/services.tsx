import { Building2, Home, Store, Hammer, HardHat, Ruler } from "lucide-react"

const services = [
  {
    icon: Building2,
    title: "Оффис барилга",
    description: "Орчин үеийн оффис барилга, бизнес төвүүдийг олон улсын стандартын дагуу барьж байгуулна.",
  },
  {
    icon: Home,
    title: "Орон сууц",
    description: "Тохилог, аюулгүй орон сууцны хороолол, орон сууцны цогцолборыг барьж байгуулна.",
  },
  {
    icon: Store,
    title: "Худалдааны төв",
    description: "Том болон жижиг хэмжээний худалдааны төв, дэлгүүрийн барилгуудыг барьж байгуулна.",
  },
  {
    icon: Hammer,
    title: "Барилга засвар",
    description: "Барилгын засвар үйлчилгээ, шинэчлэлтийн ажлыг мэргэжлийн түвшинд гүйцэтгэнэ.",
  },
  {
    icon: HardHat,
    title: "Дэд бүтэц",
    description: "Зам, гүүр, хоолой шугам сүлжээ зэрэг дэд бүтцийн төслүүдийг хэрэгжүүлнэ.",
  },
  {
    icon: Ruler,
    title: "Зураг төсөл",
    description: "Барилгын архитектур болон инженерийн зураг төслийг мэргэжлийн түвшинд гүйцэтгэнэ.",
  },
]

export function Services() {
  return (
    <section id="services" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
            Үйлчилгээ
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
            Бидний үзүүлдэг үйлчилгээнүүд
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Бид барилга угсралтын бүх төрлийн ажлыг мэргэжлийн түвшинд гүйцэтгэдэг.
            Таны төсөлд тохирсон хамгийн сайн шийдлийг санал болгоно.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
