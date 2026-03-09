import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, Users, Award } from "lucide-react"

const stats = [
  { icon: Building2, value: "150+", label: "Дууссан төсөл" },
  { icon: Users, value: "50+", label: "Мэргэжилтнүүд" },
  { icon: Award, value: "25+", label: "Жилийн туршлага" },
]

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-construction.jpg"
          alt="Барилгын талбай"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/70" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
            Монголын тэргүүлэгч барилгын компани
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-6 leading-tight text-balance">
            Чанартай барилга, итгэлтэй хамтрагч
          </h1>
          <p className="text-lg md:text-xl text-background/80 mb-8 max-w-2xl leading-relaxed">
            Бид орон сууц, оффис барилга, худалдааны төвүүд зэрэг төрөл бүрийн барилга угсралтын 
            ажлыг мэргэжлийн түвшинд гүйцэтгэдэг.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-base">
              Төслүүдийг харах
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-base bg-transparent border-background/30 text-background hover:bg-background/10 hover:text-background">
              Холбоо барих
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 bg-background/10 backdrop-blur-sm rounded-lg p-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-background">{stat.value}</p>
                <p className="text-sm text-background/70">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
