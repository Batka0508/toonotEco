import { CheckCircle2 } from "lucide-react"

const features = [
  "25 жилийн туршлага",
  "ISO 9001 чанарын баталгаа",
  "Орчин үеийн технологи",
  "Мэргэжлийн баг хамт олон",
  "Цаг хугацааны баталгаа",
  "Хариуцлагатай үйлчилгээ",
]

export function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
              Бидний тухай
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
              Монгол улсын тэргүүлэгч барилгын компани
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Mongol Od нь 1999 онд байгуулагдсан бөгөөд өнөөг хүртэл 150 гаруй томоохон 
              төсөл амжилттай хэрэгжүүлсэн. Бид орон сууцны хороолол, оффис барилга, 
              худалдааны төв зэрэг төрөл бүрийн барилга угсралтын ажлыг гүйцэтгэдэг.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Манай компани нь олон улсын стандартад нийцсэн, орчин үеийн технологи 
              ашигладаг, мэргэжлийн өндөр ур чадвартай баг хамт олонтой.
            </p>
            
            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-foreground font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Numbers */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-background rounded-xl p-8 text-center shadow-sm">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">150+</p>
              <p className="text-muted-foreground">Дууссан төсөл</p>
            </div>
            <div className="bg-background rounded-xl p-8 text-center shadow-sm">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">50+</p>
              <p className="text-muted-foreground">Мэргэжилтнүүд</p>
            </div>
            <div className="bg-background rounded-xl p-8 text-center shadow-sm">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">25</p>
              <p className="text-muted-foreground">Жилийн туршлага</p>
            </div>
            <div className="bg-background rounded-xl p-8 text-center shadow-sm">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">100%</p>
              <p className="text-muted-foreground">Сэтгэл ханамж</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
