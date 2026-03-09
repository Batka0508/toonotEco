import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const projects = [
  {
    title: "Хан-Уул Резиденс",
    category: "Орон сууц",
    image: "/images/project-1.jpg",
    year: "2024",
  },
  {
    title: "Central Tower",
    category: "Оффис барилга",
    image: "/images/project-2.jpg",
    year: "2023",
  },
  {
    title: "Номин Молл",
    category: "Худалдааны төв",
    image: "/images/project-3.jpg",
    year: "2023",
  },
]

export function Projects() {
  return (
    <section id="projects" className="py-20 md:py-28 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
              Төслүүд
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-balance">
              Сүүлийн үеийн ажлууд
            </h2>
          </div>
          <Button variant="outline">
            Бүх төслүүд
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group relative bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {project.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{project.year}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
