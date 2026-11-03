"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MousePointer, Smartphone, Keyboard, Sliders, CheckCircle2, AlertTriangle, ArrowDown, ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DndSensorsAnimator() {
  const [activeSensor, setActiveSensor] = useState<"pointer" | "touch" | "keyboard">("pointer");
  const [distanceConstraint, setDistanceConstraint] = useState<number>(8); // px
  const [touchDelay, setTouchDelay] = useState<number>(250); // ms
  const [touchTimer, setTouchTimer] = useState<number>(0);
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [isGrabbed, setIsGrabbed] = useState<boolean>(false);
  const [cardPosition, setCardPosition] = useState<number>(1); // 1, 2, 3
  const [ariaAnnouncement, setAriaAnnouncement] = useState<string>(
    "Item 1 terfokus. Tekan Spasi untuk mengangkat kartu."
  );

  const handleTouchStart = () => {
    setIsPressing(true);
    setTouchTimer(0);
    const interval = setInterval(() => {
      setTouchTimer((prev) => {
        if (prev >= touchDelay) {
          clearInterval(interval);
          setIsGrabbed(true);
          return touchDelay;
        }
        return prev + 50;
      });
    }, 50);
  };

  const handleTouchEnd = () => {
    setIsPressing(false);
    setIsGrabbed(false);
    setTouchTimer(0);
  };

  const handleKeyboardAction = (action: "grab" | "up" | "down" | "drop") => {
    if (action === "grab") {
      setIsGrabbed(true);
      setAriaAnnouncement(`Kartu #${cardPosition} terangkat. Gunakan tombol panah atas/bawah untuk mengubah urutan.`);
    } else if (action === "up" && isGrabbed && cardPosition > 1) {
      setCardPosition((prev) => prev - 1);
      setAriaAnnouncement(`Kartu dipindahkan ke posisi ${cardPosition - 1} dari 3.`);
    } else if (action === "down" && isGrabbed && cardPosition < 3) {
      setCardPosition((prev) => prev + 1);
      setAriaAnnouncement(`Kartu dipindahkan ke posisi ${cardPosition + 1} dari 3.`);
    } else if (action === "drop") {
      setIsGrabbed(false);
      setAriaAnnouncement(`Kartu dijatuhkan pada posisi akhir ${cardPosition} dari 3.`);
    }
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-xs font-semibold">
              Pilar 1.2: Sensor Primitives
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Pointer • Touch • Keyboard WAI-ARIA
            </span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Rekayasa Sensor & Batasan Aktivasi (activationConstraint)
          </h4>
        </div>

        {/* Sensor Mode Switcher */}
        <div className="flex bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => { setActiveSensor("pointer"); setIsGrabbed(false); }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
              activeSensor === "pointer"
                ? "bg-white dark:bg-zinc-900 text-purple-600 dark:text-purple-400 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <MousePointer className="w-3.5 h-3.5" /> Pointer
          </button>
          <button
            onClick={() => { setActiveSensor("touch"); setIsGrabbed(false); }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
              activeSensor === "touch"
                ? "bg-white dark:bg-zinc-900 text-purple-600 dark:text-purple-400 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Touch Mobile
          </button>
          <button
            onClick={() => { setActiveSensor("keyboard"); setIsGrabbed(false); }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
              activeSensor === "keyboard"
                ? "bg-white dark:bg-zinc-900 text-purple-600 dark:text-purple-400 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" /> Keyboard ARIA
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Stage: Interactive Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/50 min-h-[260px] relative">
          {/* Pointer Sensor Simulation */}
          {activeSensor === "pointer" && (
            <div className="w-full max-w-sm space-y-4">
              <div className="text-center text-xs text-zinc-500 font-mono">
                Toleransi: <span className="font-bold text-purple-600">{distanceConstraint}px</span> sebelum drag aktif
              </div>

              <motion.div
                drag="y"
                dragConstraints={{ top: -40, bottom: 40 }}
                onDragStart={() => setIsGrabbed(true)}
                onDragEnd={() => setIsGrabbed(false)}
                className={`p-4 rounded-xl border cursor-grab active:cursor-grabbing select-none transition-shadow ${
                  isGrabbed
                    ? "border-purple-500 bg-purple-600 text-white shadow-xl ring-4 ring-purple-400/20"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Task #202: Pointer Sensor Target</span>
                  <MousePointer className="w-4 h-4 opacity-70" />
                </div>
                <p className="text-[11px] mt-1 opacity-80">
                  {distanceConstraint === 0
                    ? "⚠️ Klik biasa (0px) langsung memicu drag! Tombol klik dalam kartu terblokir."
                    : `✅ Klik normal aman! Perlu geser ${distanceConstraint}px untuk mulai mendrag.`}
                </p>
              </motion.div>

              <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 text-[11px] space-y-1">
                <div className="font-semibold text-zinc-700 dark:text-zinc-300">Konfigurasi PointerSensor:</div>
                <code className="text-purple-600 dark:text-purple-400 font-mono block">
                  activationConstraint: &#123; distance: {distanceConstraint} &#125;
                </code>
              </div>
            </div>
          )}

          {/* Touch Mobile Sensor Simulation */}
          {activeSensor === "touch" && (
            <div className="w-full max-w-sm space-y-4 text-center">
              <div className="text-xs text-zinc-500 font-mono">
                Hold Delay: <span className="font-bold text-purple-600">{touchDelay}ms</span> untuk membedakan Scroll Layar
              </div>

              <div
                onMouseDown={handleTouchStart}
                onMouseUp={handleTouchEnd}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className={`p-5 rounded-2xl border cursor-pointer select-none transition-all ${
                  isGrabbed
                    ? "border-emerald-500 bg-emerald-600 text-white shadow-xl scale-105"
                    : isPressing
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 scale-95"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 shadow-sm"
                }`}
              >
                <Smartphone className="w-6 h-6 mx-auto mb-2 opacity-80" />
                <div className="text-xs font-bold">
                  {isGrabbed
                    ? "🎉 Kartu Terangkat! Siap Digeser"
                    : isPressing
                    ? `Menahan Sentuhan: ${touchTimer}ms...`
                    : "Tekan & Tahan (Hold) Kartu"}
                </div>
                {isPressing && !isGrabbed && (
                  <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full transition-all duration-75"
                      style={{ width: `${(touchTimer / touchDelay) * 100}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="text-[11px] text-zinc-500">
                Pola ini menjamin pengguna ponsel tetap bisa melakukan *page scrolling* tanpa sengaja memindahkan kartu.
              </div>
            </div>
          )}

          {/* Keyboard ARIA Sensor Simulation */}
          {activeSensor === "keyboard" && (
            <div className="w-full max-w-sm space-y-3">
              <div className="space-y-1.5">
                {[1, 2, 3].map((pos) => (
                  <div
                    key={pos}
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                      cardPosition === pos
                        ? isGrabbed
                          ? "border-purple-500 bg-purple-600 text-white shadow-lg ring-2 ring-purple-300"
                          : "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500"
                    }`}
                  >
                    <span>Posisi #{pos}: Kartu Tugas WAI-ARIA</span>
                    {cardPosition === pos && (
                      <Badge variant="outline" className="text-[10px]">
                        {isGrabbed ? "GRABBED" : "FOCUSED"}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              {/* Virtual Keyboard Buttons */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                <Button
                  size="sm"
                  variant={isGrabbed ? "secondary" : "default"}
                  onClick={() => handleKeyboardAction(isGrabbed ? "drop" : "grab")}
                  className="text-[11px] h-8 col-span-2"
                >
                  {isGrabbed ? "Enter: Drop" : "Space: Grab"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!isGrabbed || cardPosition === 1}
                  onClick={() => handleKeyboardAction("up")}
                  className="text-[11px] h-8"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!isGrabbed || cardPosition === 3}
                  onClick={() => handleKeyboardAction("down")}
                  className="text-[11px] h-8"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Stage: Parameter Controls & ARIA Live Announcer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-3">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-purple-500" /> Pengatur Batasan Sensor
            </span>

            {activeSensor === "pointer" && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
                  <span>Pointer Distance Constraint</span>
                  <span className="font-mono font-bold text-purple-600">{distanceConstraint}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={distanceConstraint}
                  onChange={(e) => setDistanceConstraint(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>0px (Bahaya: Blokir Klik)</span>
                  <span>8px (Standar)</span>
                  <span>20px (Ketat)</span>
                </div>
              </div>
            )}

            {activeSensor === "touch" && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
                  <span>Touch Delay Constraint</span>
                  <span className="font-mono font-bold text-purple-600">{touchDelay}ms</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="50"
                  value={touchDelay}
                  onChange={(e) => setTouchDelay(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>100ms (Cepat)</span>
                  <span>250ms (Ideal)</span>
                  <span>500ms (Lambat)</span>
                </div>
              </div>
            )}

            {activeSensor === "keyboard" && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  WAI-ARIA Live Region Output:
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950 text-emerald-400 font-mono text-[11px] border border-zinc-800 min-h-[50px] flex items-center">
                  &gt; {ariaAnnouncement}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 space-y-1">
              <div className="font-semibold text-zinc-700 dark:text-zinc-300">Pelajaran Kunci:</div>
              <p>
                Gabungan <code>PointerSensor</code> + <code>KeyboardSensor</code> menjamin aksesibilitas penuh untuk semua jenis pengguna (mouse, stylus, sentuh, dan screen reader).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

