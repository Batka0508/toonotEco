"use client"

import { useEffect, useRef, useState } from "react"
import { Bath, BedDouble, ChefHat, Leaf, Sofa } from "lucide-react"
import * as THREE from "three"

const rooms = [
  {
    id: "living",
    label: "Зочны өрөө",
    icon: Sofa,
    position: new THREE.Vector3(0, 1.7, 6),
    lookAt: new THREE.Vector3(0, 1.4, 0),
    info: "Панорам шилэн цонх, eco city view, дулаан мэдрэмжтэй modern тавилга.",
  },
  {
    id: "kitchen",
    label: "Гал тогоо",
    icon: ChefHat,
    position: new THREE.Vector3(-6, 1.7, 0),
    lookAt: new THREE.Vector3(-2.5, 1.2, 0),
    info: "Luxury kitchen island, stone countertop, premium гэрэлтүүлэг.",
  },
  {
    id: "bedroom",
    label: "Унтлагын өрөө",
    icon: BedDouble,
    position: new THREE.Vector3(5.5, 1.7, -4.5),
    lookAt: new THREE.Vector3(2.5, 1.2, -2.6),
    info: "Тайван ambiance, soft gray palette, том wardrobe бүхий master room.",
  },
  {
    id: "bathroom",
    label: "Ариун цэврийн өрөө",
    icon: Bath,
    position: new THREE.Vector3(-5.8, 1.7, -5),
    lookAt: new THREE.Vector3(-3.3, 1.2, -3.2),
    info: "Premium tiles, glass shower, realistic reflection detail.",
  },
]

export function VrApartmentTour() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [activeRoom, setActiveRoom] = useState(rooms[0])
  const [hoverLabel, setHoverLabel] = useState("")

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0b1511)
    scene.fog = new THREE.Fog(0x0b1511, 14, 34)

    const camera = new THREE.PerspectiveCamera(62, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.copy(rooms[0].position)
    camera.lookAt(rooms[0].lookAt)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.domElement.style.display = "block"
    renderer.domElement.style.height = "100%"
    renderer.domElement.style.width = "100%"
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.08
    mount.appendChild(renderer.domElement)

    const ambient = new THREE.HemisphereLight(0xffffff, 0x163326, 2.4)
    scene.add(ambient)

    const sun = new THREE.DirectionalLight(0xfff4d0, 4.2)
    sun.position.set(6, 10, 7)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    scene.add(sun)

    const accent = new THREE.PointLight(0x37c871, 2.5, 18)
    accent.position.set(-3.8, 3.2, 2.6)
    scene.add(accent)

    const floorMat = new THREE.MeshStandardMaterial({ color: 0xe9ece8, roughness: 0.28, metalness: 0.08 })
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf7f7f3, roughness: 0.42 })
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x2f7d4c, roughness: 0.38, metalness: 0.12 })
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x111a16, roughness: 0.32, metalness: 0.25 })
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b6748, roughness: 0.45 })
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xdff7ff,
      transparent: true,
      opacity: 0.28,
      roughness: 0.04,
      metalness: 0,
      transmission: 0.35,
    })
    const textureLoader = new THREE.TextureLoader()

    function imagePanel(name: string, src: string, size: [number, number], pos: [number, number, number], rot: [number, number, number]) {
      const texture = textureLoader.load(src)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(size[0], size[1]), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }))
      panel.name = name
      panel.position.set(...pos)
      panel.rotation.set(...rot)
      scene.add(panel)
      return panel
    }

    function box(name: string, size: [number, number, number], pos: [number, number, number], mat: THREE.Material, cast = true) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat)
      mesh.name = name
      mesh.position.set(...pos)
      mesh.castShadow = cast
      mesh.receiveShadow = true
      scene.add(mesh)
      return mesh
    }

    box("floor", [15, 0.18, 13], [0, -0.1, 0], floorMat, false)
    box("ceiling", [15, 0.14, 13], [0, 3.4, 0], wallMat, false)
    box("back wall", [15, 3.5, 0.18], [0, 1.65, -6.5], wallMat, false)
    box("left wall", [0.18, 3.5, 13], [-7.5, 1.65, 0], wallMat, false)
    box("right partial wall", [0.18, 3.5, 6], [7.5, 1.65, -3.5], wallMat, false)
    box("kitchen divider", [0.16, 2.5, 4], [-2.2, 1.25, -1.5], wallMat, false)
    box("bedroom divider", [4.8, 2.7, 0.16], [3.2, 1.35, -2.2], wallMat, false)
    box("bath divider", [3.2, 2.7, 0.16], [-5.7, 1.35, -2.6], wallMat, false)
    box("glass window", [9, 2.4, 0.08], [2.5, 1.7, 6.45], glassMat, false)
    box("balcony glass", [0.08, 1.6, 5], [7.45, 1.2, 2.5], glassMat, false)

    box("sofa", [3.2, 0.75, 1.15], [0, 0.42, 2.1], darkMat)
    box("sofa back", [3.2, 1.05, 0.22], [0, 0.85, 2.65], darkMat)
    box("coffee table", [1.8, 0.22, 0.9], [0, 0.28, 0.55], woodMat)
    box("media wall", [2.8, 1.5, 0.12], [0, 1.2, -1.2], greenMat)
    box("kitchen island", [2.5, 0.9, 1.05], [-4.8, 0.45, 0.8], woodMat)
    box("countertop", [2.6, 0.12, 1.12], [-4.8, 0.95, 0.8], darkMat)
    box("kitchen cabinets", [2.8, 1.9, 0.5], [-6.7, 1.0, -0.8], greenMat)
    imagePanel("kitchen.webp visual", "/images/kitchen.webp", [2.9, 1.75], [-6.58, 1.85, 1.65], [0, Math.PI / 2, 0])
    box("bed base", [2.8, 0.55, 2.15], [4.7, 0.32, -4.5], woodMat)
    box("mattress", [2.65, 0.32, 2], [4.7, 0.75, -4.5], wallMat)
    box("headboard", [3, 1.25, 0.22], [4.7, 1.15, -5.65], darkMat)
    imagePanel("bedroom.jpg visual", "/images/bedroom.jpg", [3.6, 2.15], [4.7, 1.85, -6.38], [0, 0, 0])
    box("bath vanity", [1.8, 0.8, 0.6], [-5.8, 0.45, -4.4], woodMat)
    box("shower glass", [0.08, 2, 1.8], [-4.2, 1.1, -5.35], glassMat, false)

    for (let i = 0; i < 9; i++) {
      const trunk = box("eco trunk", [0.14, 1.1, 0.14], [-7 + i * 1.8, 0.45, 9.5], woodMat)
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.6, 18, 12), greenMat)
      crown.position.set(trunk.position.x, 1.35, 9.5)
      crown.castShadow = true
      scene.add(crown)
    }

    for (let i = 0; i < 6; i++) {
      box("city tower", [0.7 + (i % 3) * 0.22, 3 + (i % 2) * 1.4, 0.7], [-6 + i * 2.4, 1.5, 13], darkMat)
    }

    const hotspots: THREE.Mesh[] = []
    rooms.forEach((room, index) => {
      const hotspot = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 24, 16),
        new THREE.MeshStandardMaterial({ color: 0x45df86, emissive: 0x1f8f4b, emissiveIntensity: 1.3 }),
      )
      hotspot.position.copy(room.lookAt).add(new THREE.Vector3(index % 2 ? -0.55 : 0.55, 0.55, index > 1 ? 0.35 : -0.35))
      hotspot.userData.roomId = room.id
      hotspot.userData.label = room.label
      scene.add(hotspot)
      hotspots.push(hotspot)
    })

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const keys = new Set<string>()
    const targetPosition = rooms[0].position.clone()
    const targetLookAt = rooms[0].lookAt.clone()
    const currentLookAt = rooms[0].lookAt.clone()
    let frame = 0
    let animationId = 0

    function moveToRoom(roomId: string) {
      const next = rooms.find((room) => room.id === roomId)
      if (!next) return
      targetPosition.copy(next.position)
      targetLookAt.copy(next.lookAt)
      setActiveRoom(next)
    }

    function updatePointer(event: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      return raycaster.intersectObjects(hotspots)[0]
    }

    function onPointerMove(event: PointerEvent) {
      const hit = updatePointer(event)
      renderer.domElement.style.cursor = hit ? "pointer" : "grab"
      setHoverLabel(hit?.object.userData.label ?? "")
    }

    function onClick(event: PointerEvent) {
      const hit = updatePointer(event)
      if (hit) moveToRoom(hit.object.userData.roomId)
    }

    function onKeyDown(event: KeyboardEvent) {
      keys.add(event.key.toLowerCase())
    }

    function onKeyUp(event: KeyboardEvent) {
      keys.delete(event.key.toLowerCase())
    }

    function onRoomChange(event: Event) {
      moveToRoom((event as CustomEvent<string>).detail)
    }

    function onResize() {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }

    renderer.domElement.addEventListener("pointermove", onPointerMove)
    renderer.domElement.addEventListener("click", onClick)
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    window.addEventListener("room-change", onRoomChange)
    window.addEventListener("resize", onResize)

    function animate() {
      frame += 0.016
      hotspots.forEach((hotspot, index) => {
        hotspot.position.y += Math.sin(frame * 2 + index) * 0.0018
        hotspot.scale.setScalar(1 + Math.sin(frame * 3 + index) * 0.08)
      })

      const direction = new THREE.Vector3()
      camera.getWorldDirection(direction)
      direction.y = 0
      direction.normalize()
      const side = new THREE.Vector3().crossVectors(direction, camera.up).normalize()
      const speed = 0.035
      if (keys.has("w")) targetPosition.addScaledVector(direction, speed)
      if (keys.has("s")) targetPosition.addScaledVector(direction, -speed)
      if (keys.has("a")) targetPosition.addScaledVector(side, -speed)
      if (keys.has("d")) targetPosition.addScaledVector(side, speed)
      targetPosition.x = THREE.MathUtils.clamp(targetPosition.x, -6.6, 6.6)
      targetPosition.z = THREE.MathUtils.clamp(targetPosition.z, -5.8, 6.1)

      camera.position.lerp(targetPosition, 0.035)
      currentLookAt.lerp(targetLookAt, 0.045)
      camera.lookAt(currentLookAt)
      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      renderer.domElement.removeEventListener("pointermove", onPointerMove)
      renderer.domElement.removeEventListener("click", onClick)
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("room-change", onRoomChange)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  const ActiveIcon = activeRoom.icon

  return (
    <section id="vr-tour" className="overflow-hidden bg-slate-950 py-12 text-white sm:py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-bold uppercase tracking-wide text-emerald-300 sm:px-4 sm:text-sm">
              <Leaf className="h-4 w-4 shrink-0" />
              <span className="truncate">Toonot Eco Town VR Tour</span>
            </p>
            <h2 className="text-2xl font-black leading-tight text-white text-balance sm:text-3xl md:text-5xl">
              Premium 3D apartment walkthrough experience
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              Зочны өрөө, гал тогоо, унтлагын өрөө, ариун цэврийн өрөөг immersive VR-like tour хэлбэрээр үзээрэй.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-200 backdrop-blur">
            <p className="font-bold text-white">Controls</p>
            <p className="mt-1">Hotspot дээр дарна. Desktop дээр WASD ашиглаж алхана.</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-emerald-950/30 sm:rounded-3xl">
          <div className="grid lg:min-h-[44rem] lg:grid-cols-[1fr_21rem]">
            <div className="relative min-h-[24rem] sm:min-h-[32rem] lg:min-h-[36rem]">
              <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(52,211,153,0.22),transparent_32%),linear-gradient(135deg,#07130f,#0f1f1a)] text-center">
                <div className="mx-4 rounded-2xl border border-emerald-300/20 bg-white/10 px-5 py-4 backdrop-blur sm:px-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-300 sm:text-sm">Loading 3D VR tour</p>
                  <p className="mt-2 text-xs text-slate-300">WebGL apartment scene ачаалж байна...</p>
                </div>
              </div>
              <div ref={mountRef} className="relative h-full min-h-[24rem] w-full sm:min-h-[32rem] lg:min-h-[36rem]" />

              {hoverLabel && (
                <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-emerald-300/25 bg-slate-950/65 px-3 py-2 text-xs font-bold text-emerald-200 backdrop-blur sm:left-6 sm:top-6 sm:px-4 sm:text-sm">
                  {hoverLabel}
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 hidden gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl md:grid md:grid-cols-3 lg:bottom-6 lg:left-6 lg:right-6">
                <InfoPill label="Материал" value="Glass, stone, warm wood" />
                <InfoPill label="Гэрэл" value="Natural sunlight" />
                <InfoPill label="Орчин" value="Eco city + green park" />
              </div>
            </div>

            <aside className="border-t border-white/10 bg-slate-950/90 p-4 backdrop-blur sm:p-5 lg:border-l lg:border-t-0">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white sm:h-12 sm:w-12">
                    <ActiveIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-300">Current room</p>
                    <h3 className="truncate text-lg font-black text-white sm:text-xl">{activeRoom.label}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{activeRoom.info}</p>
              </div>

              <div className="mt-5">
                <p className="text-sm font-bold uppercase tracking-wide text-slate-400">Floor navigation</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {rooms.map((room) => {
                    const Icon = room.icon
                    const isActive = activeRoom.id === room.id
                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => {
                          setActiveRoom(room)
                          window.dispatchEvent(new CustomEvent("room-change", { detail: room.id }))
                        }}
                        className={[
                          "min-h-20 rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5",
                          isActive
                            ? "border-emerald-400 bg-emerald-500 text-white"
                            : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                        ].join(" ")}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="mt-2 block text-xs font-bold leading-4">{room.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-bold text-white">Apartment panel</p>
                <dl className="mt-4 grid gap-3 text-sm">
                  <PanelRow label="Зэрэглэл" value="Business luxury" />
                  <PanelRow label="Өрөө" value="2-3 өрөө" />
                  <PanelRow label="Experience" value="360 panoramic" />
                  <PanelRow label="Style" value="Eco futuristic" />
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-emerald-300">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

function PanelRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2 last:border-0 last:pb-0">
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-right font-bold text-white">{value}</dd>
    </div>
  )
}
