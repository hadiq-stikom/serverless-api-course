"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Coffee,
  CheckCircle2,
  X,
  Smile,
  Bot,
  Zap,
  Flame,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getWarmupPromptForModule,
  WarmupPromptItem,
} from "@/data/warmup-prompts";
import {
  WarmupMessage,
  saveStudentWarmupChatAction,
  getStudentWarmupChatAction,
  continueWarmupConversationAction,
} from "@/actions/quiz-evaluator";

interface WarmupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: number;
  studentNim: string;
  studentName: string;
  onWarmupFinished: () => void;
}

export function WarmupChatModal({
  isOpen,
  onClose,
  moduleId,
  studentNim,
  studentName,
  onWarmupFinished,
}: WarmupChatModalProps) {
  const promptData: WarmupPromptItem = getWarmupPromptForModule(moduleId);
  const [messages, setMessages] = useState<WarmupMessage[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [sentiment, setSentiment] = useState<"enthusiastic" | "neutral" | "anxious" | "brief">("neutral");
  const [dataSufficiency, setDataSufficiency] = useState<number>(0);
  const [studentWordCount, setStudentWordCount] = useState<number>(0);
  const [studentTurnCount, setStudentTurnCount] = useState<number>(0);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);

  // Load existing warmup chat or initialize
  useEffect(() => {
    if (!isOpen) return;

    async function initWarmup() {
      const existing = await getStudentWarmupChatAction(studentNim, moduleId);
      if (existing && existing.messages && existing.messages.length > 0) {
        setMessages(existing.messages);
        const sMsgs = existing.messages.filter((m) => m.role === "student");
        const words = sMsgs.reduce((acc, m) => acc + m.text.trim().split(/\s+/).filter(Boolean).length, 0);
        setStudentWordCount(words);
        setStudentTurnCount(sMsgs.length);
        const sufficiency = Math.min(100, Math.round((words / 45) * 100));
        setDataSufficiency(sufficiency);

        // Jika sudah tuntas dari riwayat sebelumnya
        if (sMsgs.length >= 2 && words >= 30) {
          setIsComplete(true);
        }
      } else {
        // Initial AI greeting + initialQuestion yang variatif sesuai tema modul
        setIsAiTyping(true);
        setTimeout(() => {
          const firstAiMessage: WarmupMessage = {
            role: "ai",
            text: `Halo ${studentName.split(" ")[0]}! 👋 ${promptData.greeting}\n\n${promptData.initialQuestion}`,
            timestamp: new Date().toISOString(),
          };
          setMessages([firstAiMessage]);
          setIsAiTyping(false);
        }, 500);
      }
    }

    initWarmup();
  }, [isOpen, studentNim, moduleId, studentName, promptData]);

  if (!isOpen) return null;

  // Handle Send Student Answer
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanText = inputText.trim();
    if (!cleanText || isSubmitting || isAiTyping || isComplete) return;

    const studentMsg: WarmupMessage = {
      role: "student",
      text: cleanText,
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, studentMsg];
    setMessages(updated);
    setInputText("");
    setIsAiTyping(true);

    try {
      const res = await continueWarmupConversationAction({
        studentNim,
        studentName,
        moduleId,
        messages: updated,
      });

      const aiReplyMsg: WarmupMessage = {
        role: "ai",
        text: res.aiReply,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updated, aiReplyMsg];
      setMessages(finalMessages);
      setSentiment(res.sentimentDetected);
      setDataSufficiency(res.dataSufficiency);
      setStudentWordCount(res.totalStudentWords);
      setStudentTurnCount(res.studentTurns);

      if (res.isComplete) {
        setIsComplete(true);
        setIsSubmitting(true);
        try {
          await saveStudentWarmupChatAction(studentNim, moduleId, finalMessages);
        } finally {
          setIsSubmitting(false);
        }
      }
    } catch (err) {
      console.warn("Failed continue warmup:", err);
      // Fallback message jika jaringan error
      const fallbackAiMsg: WarmupMessage = {
        role: "ai",
        text: `Keren banget caramu memandangnya, ${studentName.split(" ")[0]}! Pikiranmu sekarang sudah segar dan siap fokus. Rileks, dan mari kita mulai Uji Pemahaman!`,
        timestamp: new Date().toISOString(),
      };
      const finalFallback = [...updated, fallbackAiMsg];
      setMessages(finalFallback);
      setIsComplete(true);
      await saveStudentWarmupChatAction(studentNim, moduleId, finalFallback);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Mahasiswa memilih wrap-up manual jika turn >= 2 dan kata >= 25
  const handleEarlyFinish = async () => {
    setIsSubmitting(true);
    try {
      const wrapUpMsg: WarmupMessage = {
        role: "ai",
        text: `Semangat luar biasa, ${studentName.split(" ")[0]}! Baseline stilistika gaya bahasamu sudah tercatat dengan baik. Mari kita mulai Uji Pemahaman sekarang! 🚀`,
        timestamp: new Date().toISOString(),
      };
      const finalMessages = [...messages, wrapUpMsg];
      setMessages(finalMessages);
      setIsComplete(true);
      await saveStudentWarmupChatAction(studentNim, moduleId, finalMessages);
      onWarmupFinished();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishAndStartQuiz = () => {
    onWarmupFinished();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl flex flex-col max-h-[88vh] overflow-hidden"
      >
        {/* Header Modal */}
        <div className="px-4 py-3 border-b border-border bg-muted/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="font-bold text-xs md:text-sm text-foreground">
                  {promptData.themeTitle}
                </h3>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold">
                  Modul {moduleId}
                </Badge>
                <Badge className="text-[10px] px-2 py-0 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 font-semibold">
                  {promptData.formatBadge}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Dialog hangat adaptif membangun kesiapan mental &amp; baseline gaya bahasa sebelum kuis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info & Status Bar Sentimen */}
        <div className="px-4 py-2 bg-amber-500/5 border-b border-amber-500/10 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-1.5">
            {sentiment === "anxious" ? (
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
                <HeartHandshake className="w-3.5 h-3.5 shrink-0" />
                AI Mentor sedang memberi motivasi &amp; mencairkan rasa ragu ❤️
              </span>
            ) : sentiment === "enthusiastic" ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <Flame className="w-3.5 h-3.5 shrink-0" />
                Diskusi seru &amp; energi berpikir tinggi! 🔥
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-medium">
                <Smile className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                Obrolan santai tanpa beban nilai • Bersantai sebelum kuis
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground font-mono text-[10px]">
            <span>Kecukupan Baseline:</span>
            <span className={`font-bold ${dataSufficiency >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
              {dataSufficiency}% ({studentWordCount} kata)
            </span>
          </div>
        </div>

        {/* Chat Stream Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
          {messages.map((m, idx) => {
            const isAi = m.role === "ai";
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${isAi ? "justify-start" : "justify-end"}`}
              >
                {isAi && (
                  <div className="w-7 h-7 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs leading-relaxed whitespace-pre-wrap ${
                    isAi
                      ? "bg-muted/70 text-foreground border border-border/70 rounded-tl-xs"
                      : "bg-amber-600 text-white rounded-tr-xs"
                  }`}
                >
                  <p className="text-xs">{m.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      isAi ? "text-muted-foreground" : "text-white/70"
                    }`}
                  >
                    {new Date(m.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {!isAi && (
                  <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold shadow-xs">
                    {studentName.charAt(0)}
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* AI Typing Indicator */}
          {isAiTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-muted-foreground text-xs pl-2"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-500/15 text-indigo-500 flex items-center justify-center">
                <Sparkles className="w-3 h-3 animate-spin" />
              </div>
              <span className="text-[11px] italic">AI Mentor sedang merangkai balasan ramah...</span>
            </motion.div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Footer / Input Area */}
        <div className="p-3 border-t border-border bg-card">
          {isComplete ? (
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2.5 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">Sesi Pemanasan Tuntas!</p>
                  <p className="text-[11px] font-normal text-emerald-700 dark:text-emerald-300">
                    Baseline gaya bahasa mandiri ({studentWordCount} kata) telah tersimpan untuk verifikasi otentisitas kuis &amp; praktikum.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleFinishAndStartQuiz}
                className="w-full h-11 font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md shadow-amber-600/25 gap-2 text-xs md:text-sm cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Mulai Uji Pemahaman Sekarang ➔</span>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-2">
              <div className="rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-amber-500/40 focus-within:border-amber-500/50 transition-all overflow-hidden shadow-xs">
                <textarea
                  rows={3}
                  disabled={isAiTyping || isComplete}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={
                    studentTurnCount === 0
                      ? "Tuliskan tanggapan santaimu di sini (bisa multi-baris)... Bebas bercerita, tanpa nilai benar/salah!"
                      : "Lanjutkan obrolan santaimu di sini..."
                  }
                  className="w-full p-3 text-xs bg-transparent border-0 resize-y min-h-[76px] max-h-[160px] focus:outline-none disabled:opacity-50 text-foreground leading-relaxed placeholder:text-muted-foreground/70"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-muted/30 border-t border-border/50 text-[11px] text-muted-foreground">
                  <span className="hidden sm:inline">
                    💡 <strong>Shift + Enter</strong> untuk baris baru • <strong>Enter</strong> untuk kirim
                  </span>

                  <div className="flex items-center gap-2 ml-auto">
                    {/* Tombol lewati awal jika mahasiswa sudah merespons minimal 2x dan kata cukup */}
                    {studentTurnCount >= 2 && studentWordCount >= 25 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isSubmitting || isAiTyping}
                        onClick={handleEarlyFinish}
                        className="h-7 px-2.5 text-[11px] text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 font-medium rounded-lg cursor-pointer"
                      >
                        <span>Saya Siap Kuis ➔</span>
                      </Button>
                    )}

                    <Button
                      type="submit"
                      disabled={!inputText.trim() || isAiTyping || isComplete}
                      size="sm"
                      className="h-7 px-3.5 font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg gap-1.5 text-xs shadow-xs cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Kirim</span>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
