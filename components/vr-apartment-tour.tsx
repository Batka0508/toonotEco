"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Bath, BedDouble, ChefHat, Leaf, Sofa } from "lucide-react"
import * as THREE from "three"
import type { HomepageContent } from "@/lib/homepage-content"

const baseRooms = [
  {
    id: "living",
    label: "Зочны өрөө",
    icon: Sofa,
    position: new THREE.Vector3(0, 1.7, 6),
    lookAt: new THREE.Vector3(0, 1.4, 0),
    info: "Панорам шилэн цонх, хотхоны харагдац, дулаан мэдрэмжтэй орчин үеийн тавилга.",
  },
  {
    id: "kitchen",
    label: "Гал тогоо",
    icon: ChefHat,
    position: new THREE.Vector3(-6, 1.7, 0),
    lookAt: new THREE.Vector3(-2.5, 1.2, 0),
    info: "Аралтай гал тогоо, чулуун тавцан, чанартай гэрэлтүүлэг.",
  },
  {
    id: "bedroom",
    label: "Унтлагын өрөө",
    icon: BedDouble,
    position: new THREE.Vector3(5.5, 1.7, -4.5),
    lookAt: new THREE.Vector3(2.5, 1.2, -2.6),
    info: "Тайван өнгөний шийдэл, том шүүгээтэй мастер өрөө.",
  },
  {
    id: "bathroom",
    label: "Ариун цэврийн өрөө",
    icon: Bath,
    position: new THREE.Vector3(-5.8, 1.7, -5),
    lookAt: new THREE.Vector3(-3.3, 1.2, -3.2),
    info: "Чанартай плита, шилэн душ, бодит тусгалтай интерьер.",
  },
]

export function VrApartmentTour({ content }: { content: HomepageContent["vrTour"] }) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const rooms = useMemo(
    () =>
      baseRooms.map((room) => {
        const roomContent = content.rooms.find((item) => item.id === room.id)

        return {
          ...room,
          label: roomContent?.label ?? room.label,
          info: roomContent?.info ?? room.info,
        }
      }),
    [content.rooms],
  )
  const [activeRoom, setActiveRoom] = useState(rooms[0])
  const [hoverLabel, setHoverLabel] = useState("")
  const [panoramaReady, setPanoramaReady] = useState(false)

  useEffect(() => {
    setActiveRoom(rooms[0])
  }, [rooms])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    setPanoramaReady(false)

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(62, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 0.01)
    camera.lookAt(0, 0, -1)

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

    const textureLoader = new THREE.TextureLoader()
    const panoramaTexture = textureLoader.load("/360.png", () => setPanoramaReady(true))
    panoramaTexture.colorSpace = THREE.SRGBColorSpace
    panoramaTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()
    const panorama = new THREE.Mesh(
      new THREE.SphereGeometry(45, 96, 48),
      new THREE.MeshBasicMaterial({ map: panoramaTexture, side: THREE.BackSide, toneMapped: false }),
    )
    panorama.name = "360 apartment panorama"
    scene.add(panorama)

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
    const targetPosition = new THREE.Vector3(0, 0, 0.01)
    const targetLookAt = new THREE.Vector3(0, 0, -1)
    const currentLookAt = targetLookAt.clone()
    let isDraggingView = false
    let didDragView = false
    let lastPointerX = 0
    let lastPointerY = 0
    let yaw = 0
    let pitch = 0
    let manualLook = false
    let frame = 0
    let animationId = 0

    function moveToRoom(roomId: string) {
      const next = rooms.find((room) => room.id === roomId)
      if (!next) return
      targetPosition.set(0, 0, 0.01)
      targetLookAt.copy(next.lookAt).normalize().multiplyScalar(10)
      manualLook = false
      yaw = 0
      pitch = 0
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
      if (isDraggingView) {
        const deltaX = event.clientX - lastPointerX
        const deltaY = event.clientY - lastPointerY
        lastPointerX = event.clientX
        lastPointerY = event.clientY
        didDragView = didDragView || Math.abs(deltaX) + Math.abs(deltaY) > 2
        yaw -= deltaX * 0.0045
        pitch = THREE.MathUtils.clamp(pitch - deltaY * 0.0035, -0.7, 0.7)
        manualLook = true
        renderer.domElement.style.cursor = "grabbing"
        return
      }

      const hit = updatePointer(event)
      renderer.domElement.style.cursor = hit ? "pointer" : "grab"
      setHoverLabel(hit?.object.userData.label ?? "")
    }

    function onClick(event: PointerEvent) {
      if (didDragView) {
        didDragView = false
        return
      }

      const hit = updatePointer(event)
      if (hit) moveToRoom(hit.object.userData.roomId)
    }

    function onPointerDown(event: PointerEvent) {
      if (!manualLook) {
        const direction = currentLookAt.clone().sub(camera.position).normalize()
        yaw = Math.atan2(direction.x, -direction.z)
        pitch = Math.asin(THREE.MathUtils.clamp(direction.y, -1, 1))
      }

      isDraggingView = true
      didDragView = false
      lastPointerX = event.clientX
      lastPointerY = event.clientY
      renderer.domElement.setPointerCapture(event.pointerId)
      renderer.domElement.style.cursor = "grabbing"
    }

    function onPointerUp(event: PointerEvent) {
      isDraggingView = false
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId)
      }
      renderer.domElement.style.cursor = "grab"
    }

    function onKeyDown(event: KeyboardEvent) {
      if (typeof event.key === "string") {
        keys.add(event.key.toLowerCase())
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      if (typeof event.key === "string") {
        keys.delete(event.key.toLowerCase())
      }
    }

    function onRoomChange(event: Event) {
      moveToRoom((event as CustomEvent<string>).detail)
    }

    function onResize() {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown)
    renderer.domElement.addEventListener("pointermove", onPointerMove)
    renderer.domElement.addEventListener("pointerup", onPointerUp)
    renderer.domElement.addEventListener("pointercancel", onPointerUp)
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
      if (manualLook) {
        const lookDirection = new THREE.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch))
        camera.lookAt(camera.position.clone().add(lookDirection.multiplyScalar(10)))
      } else {
        camera.lookAt(currentLookAt)
      }
      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      renderer.domElement.removeEventListener("pointerdown", onPointerDown)
      renderer.domElement.removeEventListener("pointermove", onPointerMove)
      renderer.domElement.removeEventListener("pointerup", onPointerUp)
      renderer.domElement.removeEventListener("pointercancel", onPointerUp)
      renderer.domElement.removeEventListener("click", onClick)
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("room-change", onRoomChange)
      window.removeEventListener("resize", onResize)
      panorama.geometry.dispose()
      panoramaTexture.dispose()
      if (Array.isArray(panorama.material)) {
        panorama.material.forEach((material) => material.dispose())
      } else {
        panorama.material.dispose()
      }
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [rooms])

  const ActiveIcon = activeRoom.icon

  return (
    <section id="vr-tour" className="overflow-hidden bg-slate-950 py-12 text-white sm:py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-bold uppercase tracking-wide text-emerald-300 sm:px-4 sm:text-sm">
              <Leaf className="h-4 w-4 shrink-0" />
              <span className="truncate">{content.badge}</span>
            </p>
            <h2 className="text-2xl font-black leading-tight text-white text-balance sm:text-3xl md:text-5xl">
              {content.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              {content.description}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-200 backdrop-blur">
            <p className="font-bold text-white">{content.controlsTitle}</p>
            <p className="mt-1">{content.controlsDescription}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-emerald-950/30 sm:rounded-3xl">
          <div className="grid lg:min-h-[44rem] lg:grid-cols-[1fr_21rem]">
            <div className="relative min-h-[24rem] sm:min-h-[32rem] lg:min-h-[36rem]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/360.png')" }}
              />
              {!panoramaReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(52,211,153,0.22),transparent_32%),linear-gradient(135deg,#07130f,#0f1f1a)] text-center">
                <div className="mx-4 rounded-2xl border border-emerald-300/20 bg-white/10 px-5 py-4 backdrop-blur sm:px-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-300 sm:text-sm">{content.loadingTitle}</p>
                  <p className="mt-2 text-xs text-slate-300">{content.loadingDescription}</p>
                </div>
              </div>
              )}
              <div ref={mountRef} className="relative z-10 h-full min-h-[24rem] w-full sm:min-h-[32rem] lg:min-h-[36rem]" />

              {hoverLabel && (
                <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-emerald-300/25 bg-slate-950/65 px-3 py-2 text-xs font-bold text-emerald-200 backdrop-blur sm:left-6 sm:top-6 sm:px-4 sm:text-sm">
                  {hoverLabel}
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 hidden gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl md:grid md:grid-cols-3 lg:bottom-6 lg:left-6 lg:right-6">
                {content.infoPills.map((item) => (
                  <InfoPill key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
            </div>

            <aside className="border-t border-white/10 bg-slate-950/90 p-4 backdrop-blur sm:p-5 lg:border-l lg:border-t-0">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white sm:h-12 sm:w-12">
                    <ActiveIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-300">Одоогийн өрөө</p>
                    <h3 className="truncate text-lg font-black text-white sm:text-xl">{activeRoom.label}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{activeRoom.info}</p>
              </div>

              <div className="mt-5">
                <p className="text-sm font-bold uppercase tracking-wide text-slate-400">Өрөө сонгох</p>
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
                <p className="text-sm font-bold text-white">{content.panelTitle}</p>
                <dl className="mt-4 grid gap-3 text-sm">
                  {content.panelRows.map((item) => (
                    <PanelRow key={item.label} label={item.label} value={item.value} />
                  ))}
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
