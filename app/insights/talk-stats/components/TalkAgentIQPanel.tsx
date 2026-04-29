"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquare, Sparkles, X } from "lucide-react";
import {
  TALK_AGENTIQ_ACTIONS_BY_VIEW,
  TALK_AGENTIQ_PROMPTS_BY_VIEW,
  type AgentAction,
} from "@/lib/talk-stats/data";

type TalkView = "retention" | "advocacy";
type PanelTab = "actions" | "chat";

interface TalkAgentIQPanelProps {
  open: boolean;
  activeView: TalkView;
  initialTab?: PanelTab;
  prePrompt?: string;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function buildAgentResponse(view: TalkView, input: string) {
  if (view === "advocacy") {
    return `AgentIQ sees the strongest near-term lift in advocacy from scaling low-cost channels first, then harvesting proof from positive-sentiment customers. Based on "${input}", I would prioritize Loyalty Program, Email Nurture, and review-recovery workflows before adding net-new channels.`;
  }

  return `AgentIQ would treat "${input}" as a retention-priority question. The current data says Drifting prevention is still the highest-leverage move, followed by reactivation within the 7–10 day window and CLV expansion in the Stable segment.`;
}

function actionPrompt(action: AgentAction, view: TalkView) {
  return view === "advocacy"
    ? `How should I execute this advocacy action: ${action.title}?`
    : `How should I execute this retention action: ${action.title}?`;
}

export function TalkAgentIQPanel({
  open,
  activeView,
  initialTab = "actions",
  prePrompt,
  onClose,
}: TalkAgentIQPanelProps) {
  const [activeTab, setActiveTab] = useState<PanelTab>(initialTab);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isResponding, setIsResponding] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  const prompts = TALK_AGENTIQ_PROMPTS_BY_VIEW[activeView];
  const actions = TALK_AGENTIQ_ACTIONS_BY_VIEW[activeView];
  const phaseLabel = activeView === "advocacy" ? "Talk Advocacy" : "Talk Retention";
  const questionLabel =
    activeView === "advocacy"
      ? "What do you want to understand about your advocacy?"
      : "What do you want to understand about your retention?";

  useEffect(() => {
    if (!open) return;
    setActiveTab(initialTab);
  }, [initialTab, open]);

  useEffect(() => {
    if (!open || !prePrompt) return;
    setActiveTab("chat");
    setDraft(prePrompt);
  }, [open, prePrompt]);

  useEffect(() => {
    if (!open) return;
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, isResponding]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const headerTitle = useMemo(
    () =>
      activeView === "advocacy"
        ? "AgentIQ - Advocacy Intelligence"
        : "AgentIQ - Retention Intelligence",
    [activeView]
  );

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isResponding) return;

    const nextUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, nextUserMessage]);
    setDraft("");
    setIsResponding(true);

    timerRef.current = window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: buildAgentResponse(activeView, trimmed),
      };

      setMessages((current) => [...current, assistantMessage]);
      setIsResponding(false);
    }, 900);
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.22)",
          backdropFilter: "blur(4px)",
          zIndex: 60,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.28s cubic-bezier(0.32,0,0.24,1)",
        }}
      />

      <aside
        aria-hidden={!open}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 690,
          maxWidth: "100vw",
          background: "#fff",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.12)",
          zIndex: 70,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.28s cubic-bezier(0.32,0,0.24,1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            position: "relative",
            padding: "20px 24px 18px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: "linear-gradient(90deg, #7C5CFC, #A78BFA)",
            }}
          />
          <div className="flex items-center justify-between">
            <div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "var(--neutral-900)",
                  letterSpacing: -0.3,
                  marginBottom: 2,
                }}
              >
                AgentIQ
              </div>
              <div style={{ fontSize: 11, color: "var(--neutral-500)", fontWeight: 500 }}>
                {headerTitle}
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{
                background: "var(--neutral-50)",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              <X size={16} color="var(--neutral-500)" />
            </button>
          </div>
        </div>

        <div
          style={{
            padding: "16px 24px",
            background: "linear-gradient(to right, #F8F7FF, #FAFBFF)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--neutral-500)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 4,
                }}
              >
                Currently Viewing
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--neutral-900)" }}>
                {phaseLabel} Phase
              </div>
            </div>
            <div style={{ fontSize: 11, color: "var(--neutral-500)" }}>Live context</div>
          </div>
        </div>

        <div
          className="flex gap-2 px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)", backgroundColor: "white" }}
        >
          <button
            onClick={() => setActiveTab("actions")}
            className="rounded-lg px-3 py-2"
            style={{
              fontSize: 12,
              fontWeight: 700,
              backgroundColor: activeTab === "actions" ? "var(--purple)" : "var(--neutral-50)",
              color: activeTab === "actions" ? "white" : "var(--neutral-700)",
              border: activeTab === "actions" ? "none" : "1px solid var(--border)",
              cursor: "pointer",
            }}
          >
            All Actions
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className="rounded-lg px-3 py-2"
            style={{
              fontSize: 12,
              fontWeight: 700,
              backgroundColor: activeTab === "chat" ? "var(--purple)" : "var(--neutral-50)",
              color: activeTab === "chat" ? "white" : "var(--neutral-700)",
              border: activeTab === "chat" ? "none" : "1px solid var(--border)",
              cursor: "pointer",
            }}
          >
            Ask AgentIQ
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {activeTab === "actions" && (
            <div className="space-y-3">
              {actions.map((action) => (
                <div
                  key={action.title}
                  className="rounded-xl border p-4"
                  style={{ borderColor: "var(--border)", backgroundColor: "white" }}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--neutral-900)",
                      }}
                    >
                      {action.title}
                    </div>
                    <span
                      className="rounded px-2 py-1"
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        color: action.type === "FIX" ? "var(--red)" : "var(--green)",
                        backgroundColor:
                          action.type === "FIX"
                            ? "rgba(224,74,74,0.08)"
                            : "rgba(54,179,126,0.08)",
                      }}
                    >
                      {action.type}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--neutral-600)",
                      lineHeight: 1.55,
                      marginBottom: 12,
                    }}
                  >
                    {action.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: action.type === "FIX" ? "var(--red)" : "var(--green)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {action.arrImpact}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--neutral-500)" }}>
                        {action.deadline}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab("chat");
                        setDraft(actionPrompt(action, activeView));
                      }}
                      style={{
                        border: "none",
                        background: "none",
                        color: "var(--purple)",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Explore →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "chat" && (
            <div className="flex h-full flex-col">
              {messages.length === 0 && (
                <div
                  className="rounded-xl border p-5"
                  style={{
                    borderColor: "var(--border)",
                    background: "linear-gradient(to right, #F8F7FF, #FAFBFF)",
                    marginBottom: 16,
                  }}
                >
                  <div
                    className="mb-2 flex items-center gap-2"
                    style={{ color: "var(--purple)", fontWeight: 700 }}
                  >
                    <Sparkles size={16} />
                    <span style={{ fontSize: 13 }}>{questionLabel}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {prompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        className="rounded-lg border px-4 py-3 text-left"
                        style={{
                          borderColor: "var(--border)",
                          backgroundColor: "white",
                          fontSize: 12,
                          color: "var(--neutral-900)",
                          cursor: "pointer",
                        }}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex-1 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="max-w-[88%] rounded-2xl px-4 py-3"
                    style={{
                      marginLeft: message.role === "assistant" ? 0 : "auto",
                      backgroundColor:
                        message.role === "assistant" ? "var(--neutral-50)" : "var(--purple)",
                      color: message.role === "assistant" ? "var(--neutral-900)" : "white",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        opacity: 0.7,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: 6,
                      }}
                    >
                      {message.role === "assistant" ? "AgentIQ" : "You"}
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                      {message.content}
                    </div>
                  </div>
                ))}

                {isResponding && (
                  <div
                    className="inline-flex items-center gap-2 rounded-2xl px-4 py-3"
                    style={{ backgroundColor: "var(--neutral-50)" }}
                  >
                    <MessageSquare size={14} color="var(--purple)" />
                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map((index) => (
                        <span
                          key={index}
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            backgroundColor: "var(--purple)",
                            opacity: 0.35 + index * 0.2,
                            animation: "pulse 1s infinite",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: 16,
            background: "#FAFAFA",
          }}
        >
          <div
            className="flex items-end gap-3 rounded-xl border bg-white px-4 py-3"
            style={{ borderColor: "var(--border)" }}
          >
            <Sparkles size={16} color="var(--purple)" style={{ marginBottom: 8 }} />
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend(draft);
                }
              }}
              placeholder={`Ask AgentIQ anything about your ${phaseLabel.toLowerCase()} insights...`}
              rows={2}
              style={{
                flex: 1,
                fontSize: 13,
                color: "var(--neutral-900)",
                border: "none",
                outline: "none",
                resize: "none",
                background: "transparent",
              }}
            />
            <button
              onClick={() => handleSend(draft)}
              disabled={!draft.trim() || isResponding}
              className="rounded-lg px-4 py-2"
              style={{
                background: "linear-gradient(to right, #7C5CFC, #9B8FFF)",
                color: "white",
                fontSize: 12,
                fontWeight: 600,
                border: "none",
                opacity: !draft.trim() || isResponding ? 0.45 : 1,
                cursor: !draft.trim() || isResponding ? "not-allowed" : "pointer",
              }}
            >
              Send
            </button>
          </div>
          <div style={{ fontSize: 10, color: "var(--neutral-500)", marginTop: 8, textAlign: "center" }}>
            Enter sends. Shift+Enter adds a new line.
          </div>
        </div>
      </aside>
    </>
  );
}
