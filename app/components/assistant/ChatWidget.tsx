"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import s from "./chat-widget.module.css";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  cars?: CarResult[];
}

interface CarResult {
  _id: string;
  year: number;
  make: string;
  carModel: string;
  price: number;
  condition: string;
  location: string;
  image?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ChatWidget() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I can help you find a vehicle or answer questions about buying and selling on VIBES. What are you looking for?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Assistant failed to respond");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, cars: data.cars },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble right now — please try again in a moment.",
        },
      ]);
      console.error("Chat widget error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.root}>
      {open && (
        <div className={s.panel}>
          <div className={s.header}>
            <span>VIBES Assistant</span>
            <button className={s.closeBtn} onClick={() => setOpen(false)} aria-label="Close">
              ✕
            </button>
          </div>

          <div className={s.messages} ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? s.bubbleUser : s.bubbleAssistant}>
                <div>{m.content}</div>
                {m.cars && m.cars.length > 0 && (
                  <div className={s.carResults}>
                    {m.cars.map((car) => {
                      const imgSrc = car.image
                        ? car.image.startsWith("http")
                          ? car.image
                          : `${API_BASE}${car.image}`
                        : undefined;
                      return (
                        <button
                          key={car._id}
                          className={s.carCard}
                          onClick={() => router.push(`/cars/${car._id}`)}
                        >
                          {imgSrc && <img src={imgSrc} alt={car.make} className={s.carImg} />}
                          <div className={s.carInfo}>
                            <div className={s.carName}>
                              {car.year} {car.make} {car.carModel}
                            </div>
                            <div className={s.carPrice}>Rs.{car.price.toLocaleString()}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className={s.bubbleAssistant}>Thinking…</div>}
          </div>

          <form className={s.inputRow} onSubmit={handleSend}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about cars, booking, financing..."
              className={s.input}
              disabled={loading}
            />
            <button type="submit" className={s.sendBtn} disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}

      <button className={s.bubbleBtn} onClick={() => setOpen((o) => !o)} aria-label="Open assistant">
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}