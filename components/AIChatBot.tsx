"use client"

import { useRef, useState } from "react"
import {
  BedDouble,
  Bot,
  Calculator,
  Home,
  Loader2,
  MapPin,
  Phone,
  Send,
  Sparkles,
  Wallet,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

type ChatMessage = {
  id: string
  role: "assistant" | "user"
  content: string
}

const quickReplies = [
  { label: "1 өрөө", icon: BedDouble },
  { label: "2 өрөө", icon: BedDouble },
  { label: "3 өрөө", icon: Home },
  { label: "Үнэ", icon: Wallet },
  { label: "Зээлийн нөхцөл", icon: Calculator },
  { label: "Зогсоол", icon: Home },
  { label: "Байршил", icon: MapPin },
  { label: "Борлуулалттай холбогдох", icon: Phone },
]

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Сайн байна уу! Би Тоонот Эко хотхоны AI зөвлөх. Та байр, үнэ, зогсоол, зээлийн нөхцөлийн талаар асуугаарай.",
  },
]

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function AIChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const sendMessage = async (text: string) => {
    const content = text.trim()

    if (!content || loading) {
      return
    }

    const nextMessages: ChatMessage[] = [...messages, { id: makeId(), role: "user", content }]
    setMessages(nextMessages)
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role === "assistant" ? "assistant" : "user",
            content: message.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("chat_failed")
      }

      const data = await response.json()
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content:
            data.reply ||
            "Энэ мэдээллийг борлуулалтын ажилтнаас тодруулж өгье. Та нэр, утсаа үлдээвэл бид холбогдоно.",
        },
      ])
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content: "Түр алдаа гарлаа. Дахин оролдоно уу.",
        },
      ])
    } finally {
      setLoading(false)
      window.setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5">
      {open && (
        <div className="mb-2 flex h-[min(500px,calc(100svh-5.5rem))] w-[calc(100vw-1rem)] max-w-[300px] flex-col overflow-hidden rounded-2xl border border-emerald-200/80 bg-white/92 shadow-2xl shadow-emerald-950/25 backdrop-blur-xl">
          <div className="bg-[linear-gradient(135deg,#1b8f3a,#237b31)] px-3 py-2.5 text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-lg">
                  <Bot className="h-5 w-5 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black">AI зөвлөх</p>
                  <p className="truncate text-[0.68rem] font-medium text-emerald-50">Тоонот Эко хотхон</p>
                  <p className="flex items-center gap-1 text-xs text-emerald-50">
                    <span className="h-2 w-2 rounded-full bg-lime-300" />
                    Онлайн
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                aria-label="Чат хаах"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <ScrollArea className="min-h-0 flex-1 bg-[radial-gradient(circle_at_top,#f0fdf4,transparent_32%),#ffffff] px-3 py-3">
            <div className="grid gap-2.5">
              {messages.map((message) => (
                <div key={message.id} className={message.role === "user" ? "flex justify-end" : "flex items-start gap-2"}>
                  {message.role === "assistant" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <div
                    className={
                      message.role === "user"
                        ? "max-w-[82%] rounded-2xl rounded-br-md bg-emerald-600 px-2.5 py-1.5 text-xs leading-5 text-white shadow-sm"
                        : "max-w-[82%] rounded-2xl rounded-tl-md bg-slate-100 px-2.5 py-1.5 text-xs leading-5 text-slate-800 shadow-sm"
                    }
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-slate-100 px-3 py-2 text-slate-500">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span className="text-xs font-medium">Бичиж байна...</span>
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-sm">
                <p className="mb-1.5 text-[0.65rem] font-black uppercase text-slate-500">Түгээмэл асуултууд</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickReplies.map((item) => {
                    const Icon = item.icon

                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => sendMessage(item.label)}
                        className="flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-left text-[0.62rem] font-bold text-slate-800 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                          <Icon className="h-3 w-3" />
                        </span>
                        <span className="leading-3">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="border-t border-slate-200 bg-white p-2.5">
            <form
              onSubmit={(event) => {
                event.preventDefault()
                sendMessage(input)
              }}
              autoComplete="off"
              className="mb-2 flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-lg shadow-slate-900/5"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Асуултаа бичнэ үү..."
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="h-8 border-0 bg-transparent text-xs shadow-none focus-visible:ring-0"
              />
              <Button type="submit" size="icon" disabled={loading} className="h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-700">
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              </Button>
            </form>

            <p className="mt-2 text-center text-[0.65rem] font-medium text-slate-400">Powered by Тоонот Эко AI</p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="ml-auto grid h-12 w-12 place-items-center rounded-full bg-[linear-gradient(135deg,#168a35,#38b65a)] text-white shadow-2xl shadow-emerald-950/30 ring-4 ring-emerald-100 transition hover:scale-105"
        aria-label="AI chatbot нээх"
      >
        {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </button>
    </div>
  )
}
