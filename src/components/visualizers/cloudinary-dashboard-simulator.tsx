"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud,
  Key,
  Lock,
  Unlock,
  Settings,
  Folder,
  Image as ImageIcon,
  Sliders,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  Layers,
  Search,
  RefreshCw,
  Zap,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  Info,
  Terminal,
  UploadCloud,
  HelpCircle,
  FileCheck,
  Plus,
  Home,
  CheckSquare,
  Compass,
  Database
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function CloudinaryLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" width="22" height="22" fill="none" {...props}>
      <path
        d="M29.5 15.5C28.8 10.8 24.8 7.2 20 7.2C16.1 7.2 12.8 9.5 11.2 12.8C7.2 13.5 4.2 17 4.2 21.2C4.2 25.8 7.9 29.5 12.5 29.5H29.2C33.2 29.5 36.5 26.2 36.5 22.2C36.5 18.5 33.7 15.8 29.5 15.5Z"
        fill="url(#cldGrad)"
      />
      <circle cx="28.5" cy="15.5" r="2.5" fill="#F48120" />
      <defs>
        <linearGradient id="cldGrad" x1="4" y1="7" x2="36" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4869EE" />
          <stop offset="1" stopColor="#3448C5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface CloudinaryDashboardSimulatorProps {
  initialTab?: "credentials" | "presets" | "media_library" | "walkthrough";
}

export function CloudinaryDashboardSimulator({
  initialTab = "credentials"
}: CloudinaryDashboardSimulatorProps) {
  const [activeTab, setActiveTab] = useState<"credentials" | "presets" | "media_library" | "walkthrough">(initialTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // State Credentials (Settings ➔ API Keys & Product Environments)
  const [cloudName, setCloudName] = useState("d-odyssey-cloud");
  const [apiKey, setApiKey] = useState("839218947291847");
  const [apiSecret, setApiSecret] = useState("cld_sec_demo_9a8f7e6d5c4b3a21");
  const [showSecret, setShowSecret] = useState(false);
  const [testConnectionStatus, setTestConnectionStatus] = useState<"idle" | "testing" | "success">("idle");

  // State Upload Preset (Settings ➔ Upload ➔ Upload presets)
  const [presetName, setPresetName] = useState("tasks_preset");
  const [signingMode, setSigningMode] = useState<"unsigned" | "signed">("unsigned");
  const [targetFolder, setTargetFolder] = useState("serverless-odyssey/tasks");
  const [maxFileSizeMb, setMaxFileSizeMb] = useState(10);
  const [activePresets, setActivePresets] = useState<Array<{
    name: string;
    mode: "unsigned" | "signed";
    folder: string;
    status: "active" | "inactive";
    created: string;
  }>>([
    {
      name: "ml_default",
      mode: "signed",
      folder: "",
      status: "active",
      created: "Default (Signed)"
    },
    {
      name: "tasks_preset",
      mode: "unsigned",
      folder: "serverless-odyssey/tasks",
      status: "active",
      created: "Aktif (Unsigned)"
    }
  ]);
  const [presetSavedNotice, setPresetSavedNotice] = useState(false);

  // State Media Library Playground
  const [selectedAsset, setSelectedAsset] = useState<"task_cover" | "avatar">("task_cover");
  const [enableAutoFormat, setEnableAutoFormat] = useState(true);
  const [enableAutoQuality, setEnableAutoQuality] = useState(true);
  const [cropMode, setCropMode] = useState<"fill" | "thumb" | "scale">("fill");
  const [gravityMode, setGravityMode] = useState<"face" | "auto" | "center">("face");
  const [targetWidth, setTargetWidth] = useState(600);
  const [targetHeight, setTargetHeight] = useState(400);

  // State Walkthrough
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSavePreset = () => {
    const existingIndex = activePresets.findIndex((p) => p.name === presetName.trim());
    const newEntry = {
      name: presetName.trim() || "tasks_preset",
      mode: signingMode,
      folder: targetFolder.trim() || "serverless-odyssey/tasks",
      status: "active" as const,
      created: "Aktif (Baru)"
    };

    if (existingIndex >= 0) {
      const updated = [...activePresets];
      updated[existingIndex] = newEntry;
      setActivePresets(updated);
    } else {
      setActivePresets([...activePresets, newEntry]);
    }

    setPresetSavedNotice(true);
    setTimeout(() => setPresetSavedNotice(false), 3000);
  };

  const handleTestConnection = () => {
    setTestConnectionStatus("testing");
    setTimeout(() => {
      setTestConnectionStatus("success");
      setTimeout(() => setTestConnectionStatus("idle"), 3500);
    }, 900);
  };

  const envSnippet = `# ========================================================
# KREDENSIAL RESMI CLOUDINARY - "The Serverless Odyssey"
# ========================================================

# 1. Kredensial Publik (Aman dibaca di Browser Client untuk <CldUploadWidget> & <CldImage>)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="${cloudName}"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="${presetName}"

# 2. Kredensial Rahasia Server (HANYA dibaca di Server Actions untuk Two-Phase Deletion)
# DILARANG memberi prefix NEXT_PUBLIC_ agar tidak bocor ke browser!
CLOUDINARY_API_KEY="${apiKey}"
CLOUDINARY_API_SECRET="${apiSecret}"`;

  // Dynamic URL preview calculations
  const publicId = selectedAsset === "task_cover" ? "serverless-odyssey/tasks/task_cover_kanban" : "serverless-odyssey/avatars/user_profile";
  const transformParts: string[] = [];
  if (enableAutoFormat) transformParts.push("f_auto");
  if (enableAutoQuality) transformParts.push("q_auto");
  if (targetWidth) transformParts.push(`w_${targetWidth}`);
  if (targetHeight) transformParts.push(`h_${targetHeight}`);
  transformParts.push(`c_${cropMode}`);
  if (cropMode === "fill" || cropMode === "thumb") {
    transformParts.push(`g_${gravityMode}`);
  }
  const transformString = transformParts.join(",");
  const liveUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;

  // Estimasi penghematan
  const originalBytes = selectedAsset === "task_cover" ? 3850000 : 1620000;
  const optimizedBytes = enableAutoFormat
    ? Math.round((originalBytes * (enableAutoQuality ? 0.045 : 0.08) * (targetWidth / 1920)))
    : Math.round(originalBytes * 0.4);
  const savingsPct = Math.round(((originalBytes - optimizedBytes) / originalBytes) * 100);

  return (
    <div className="rounded-2xl border border-indigo-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/95 shadow-md overflow-hidden text-zinc-900 dark:text-zinc-100">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR: Real Cloudinary Console (Programmable Media v2026 UI)  */}
      {/* ========================================================================= */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-white p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & Product Environment Switcher */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
              <CloudinaryLogo />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
                  Cloudinary Console
                </span>
                <span className="text-zinc-600">/</span>
                {/* Product Environment Badge (Latest Cloudinary Architecture) */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-xs font-mono font-medium text-zinc-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Env: {cloudName}</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Replika Arsitektur Resmi Cloudinary: Product Environments, API Keys &amp; Unsigned Presets
              </p>
            </div>
          </div>

          {/* Quick Stats: Credits & Real Console Link */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-700/50 text-[11px] font-medium text-blue-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>21.4 / 25 Credits (Free Plan)</span>
            </div>
            <a
              href="https://console.cloudinary.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] font-semibold text-zinc-200 flex items-center gap-1 transition-colors"
              title="Buka Cloudinary Console Asli di Tab Baru"
            >
              <span>Buka Console Asli</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CONSOLE SHELL: Real Cloudinary Navigation (Sidebar + Main Content Area) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
        {/* LEFT SIDEBAR NAVIGATION (Replicating Modern Cloudinary Left Nav) */}
        <div className="md:col-span-3 lg:col-span-3 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/70 p-3 sm:p-4 space-y-4">
          {/* Section 1: Main Products */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 px-2 block">
              Core Products
            </span>

            <button
              type="button"
              onClick={() => setActiveTab("credentials")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === "credentials"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/80"
              }`}
            >
              <Key className="w-4 h-4 shrink-0" />
              <div className="truncate">
                <span className="block font-bold">API Keys &amp; Env</span>
                <span className={`text-[10px] block font-normal ${activeTab === "credentials" ? "text-blue-100" : "text-zinc-600 dark:text-zinc-300"}`}>
                  Settings ➔ API Keys
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("presets")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === "presets"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/80"
              }`}
            >
              <UploadCloud className="w-4 h-4 shrink-0" />
              <div className="truncate">
                <span className="block font-bold">Upload Presets</span>
                <span className={`text-[10px] block font-normal ${activeTab === "presets" ? "text-blue-100" : "text-zinc-600 dark:text-zinc-300"}`}>
                  Settings ➔ Upload
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("media_library")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === "media_library"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/80"
              }`}
            >
              <ImageIcon className="w-4 h-4 shrink-0" />
              <div className="truncate">
                <span className="block font-bold">Media Library</span>
                <span className={`text-[10px] block font-normal ${activeTab === "media_library" ? "text-blue-100" : "text-zinc-600 dark:text-zinc-300"}`}>
                  Asset Inspector &amp; URLs
                </span>
              </div>
            </button>
          </div>

          {/* Section 2: Panduan & Walkthrough Mahasiswa */}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 px-2 block">
              Panduan Praktis
            </span>

            <button
              type="button"
              onClick={() => setActiveTab("walkthrough")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                activeTab === "walkthrough"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/80"
              }`}
            >
              <Compass className="w-4 h-4 shrink-0 text-amber-500" />
              <div className="truncate">
                <span className="block font-bold">Panduan 4 Langkah</span>
                <span className={`text-[10px] block font-normal ${activeTab === "walkthrough" ? "text-indigo-100" : "text-zinc-600 dark:text-zinc-300"}`}>
                  Checklist &amp; Troubleshooting
                </span>
              </div>
            </button>
          </div>

          {/* Context Callout: Modern Architecture Note */}
          <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-[11px] text-zinc-700 dark:text-zinc-300 space-y-1">
            <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>Arsitektur Console Terbaru:</span>
            </span>
            <p className="leading-tight">
              Cloudinary mengelompokkan pengaturan ke dalam <strong>Product Environments</strong>. Menu <em>Settings (ikon roda gigi)</em> di kiri bawah memuat submenu <strong>API Keys</strong> dan <strong>Upload</strong>.
            </p>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT AREA */}
        <div className="md:col-span-9 lg:col-span-9 p-4 sm:p-6 space-y-5 bg-white dark:bg-zinc-900">
          {/* ========================================================================= */}
          {/* TAB 1: SETTINGS ➔ API KEYS (PRODUCT ENVIRONMENT CREDENTIALS)              */}
          {/* ========================================================================= */}
          {activeTab === "credentials" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Breadcrumb Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                  <Settings className="w-3.5 h-3.5 text-blue-600" />
                  <span>Settings</span>
                  <span>/</span>
                  <span className="text-zinc-900 dark:text-zinc-100 font-bold">API Keys</span>
                </div>
                <Badge variant="outline" className="text-[11px] font-mono border-blue-400 text-blue-700 dark:text-blue-300 self-start sm:self-auto">
                  📍 Lokasi Asli: Settings ➔ API Keys
                </Badge>
              </div>

              {/* Guide Callout */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/40 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200/80 dark:border-blue-900/60 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
                  <Key className="w-4 h-4" />
                </div>
                <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-1">
                  <span className="font-bold text-zinc-900 dark:text-white block">
                    Cara Menemukan Kredensial di Console Terbaru Cloudinary
                  </span>
                  <p>
                    Klik <strong>Settings (ikon roda gigi di pojok kiri bawah)</strong> ➔ pilih <strong>API Keys</strong>. Di sini Anda akan melihat <strong>Cloud Name</strong> (pengenal unik lingkungan), <strong>API Key</strong>, dan <strong>API Secret</strong>.
                  </p>
                </div>
              </div>

              {/* 3 Credential Cards (Replicating Modern Cloudinary API Keys Page) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Cloud Name */}
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Cloud className="w-3.5 h-3.5 text-blue-500" />
                      <span>Cloud Name</span>
                    </label>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Public (Client)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={cloudName}
                      onChange={(e) => setCloudName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(cloudName, "cloud_name")}
                      className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shrink-0"
                      title="Salin Cloud Name"
                    >
                      {copiedKey === "cloud_name" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
                    Nama Product Environment Anda. Disimpan di <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code>.
                  </p>
                </div>

                {/* 2. API Key */}
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-500" />
                      <span>API Key</span>
                    </label>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      API Identifier
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(apiKey, "api_key")}
                      className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shrink-0"
                      title="Salin API Key"
                    >
                      {copiedKey === "api_key" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
                    Pengenal publik untuk SDK backend. Disimpan di <code>CLOUDINARY_API_KEY</code>.
                  </p>
                </div>

                {/* 3. API Secret */}
                <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-red-500" />
                      <span>API Secret</span>
                    </label>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-500/10 text-red-600 dark:text-red-400">
                      Secret (Server Only)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type={showSecret ? "text" : "password"}
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md border border-amber-300 dark:border-amber-800 bg-white dark:bg-zinc-900 text-xs font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="p-2 rounded hover:bg-amber-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shrink-0"
                      title={showSecret ? "Sembunyikan Secret" : "Tampilkan Secret (Show)"}
                    >
                      {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(apiSecret, "api_secret")}
                      className="p-2 rounded hover:bg-amber-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shrink-0"
                      title="Salin Secret"
                    >
                      {copiedKey === "api_secret" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-amber-800 dark:text-amber-300/80 leading-tight">
                    Kunci master administratif! Dilarang memberi prefix <code>NEXT_PUBLIC_</code>!
                  </p>
                </div>
              </div>

              {/* Combined Environment Connection String in Cloudinary Console */}
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-600" />
                    <span>API Environment Variable (CLOUDINARY_URL format):</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`cloudinary://${apiKey}:${apiSecret}@${cloudName}`, "cld_url")}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {copiedKey === "cld_url" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Salin CLOUDINARY_URL</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950 text-zinc-300 font-mono text-[11px] truncate select-all border border-zinc-800">
                  cloudinary://{apiKey}:••••••••••••@{cloudName}
                </div>
              </div>

              {/* Warning Box: Anti-Leak */}
              <div className="p-3.5 rounded-xl border border-red-300 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/30 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs text-red-950 dark:text-red-200 space-y-1">
                  <span className="font-bold block">
                    Standar Keamanan Next.js 16: Zero Client Bundle Leak
                  </span>
                  <p className="leading-relaxed">
                    Setiap variabel yang diawali <code>NEXT_PUBLIC_</code> akan dikirimkan utuh ke browser klien. <strong>CLOUDINARY_API_SECRET</strong> hanya boleh dibaca oleh Server Actions (Node.js runtime) untuk memanggil <code>cloudinary.uploader.destroy()</code> saat Two-Phase Cleanup.
                  </p>
                </div>
              </div>

              {/* .env.local Generator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Konfigurasi Lengkap Berkas .env.local:</span>
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleCopy(envSnippet, "env_full")}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold h-8 cursor-pointer"
                  >
                    {copiedKey === "env_full" ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-300" />
                        <span>Tersalin ke Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        <span>Salin Seluruh .env.local</span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="p-3.5 rounded-lg bg-zinc-950 text-zinc-200 font-mono text-[11px] leading-relaxed border border-zinc-800 overflow-x-auto select-all">
                  <pre>{envSnippet}</pre>
                </div>
              </div>

              {/* Connection Test Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-200 dark:border-zinc-800">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Uji koneksi simulasi ke CDN Cloudinary dengan kredensial di atas:
                </span>
                <Button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testConnectionStatus === "testing"}
                  variant={testConnectionStatus === "success" ? "default" : "outline"}
                  className="text-xs font-bold h-8 cursor-pointer"
                >
                  {testConnectionStatus === "testing" ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" />
                      <span>Menguji Ping Cloudinary...</span>
                    </>
                  ) : testConnectionStatus === "success" ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 mr-1" />
                      <span>200 OK: Terhubung ke {cloudName}!</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-500 mr-1" />
                      <span>Uji Handshake Koneksi</span>
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: SETTINGS ➔ UPLOAD ➔ UPLOAD PRESETS (UNSIGNED VS SIGNED)            */}
          {/* ========================================================================= */}
          {activeTab === "presets" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Breadcrumb Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                  <Settings className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Settings</span>
                  <span>/</span>
                  <span>Upload</span>
                  <span>/</span>
                  <span className="text-zinc-900 dark:text-zinc-100 font-bold">Upload presets</span>
                </div>
                <Badge variant="outline" className="text-[11px] font-mono border-emerald-400 text-emerald-700 dark:text-emerald-300 self-start sm:self-auto">
                  📍 Lokasi Asli: Settings ➔ Upload ➔ Upload presets
                </Badge>
              </div>

              {/* Guide Callout */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/40 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-900/60 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-1">
                  <span className="font-bold text-zinc-900 dark:text-white block">
                    Mengapa Harus &quot;Unsigned&quot; di Cloudinary Console Terbaru?
                  </span>
                  <p>
                    Secara default, Cloudinary memberi opsi <strong>Signed</strong>. Namun untuk <code>&lt;CldUploadWidget&gt;</code> yang mengunggah langsung dari browser pengguna (*zero server compute*), Anda <strong>WAJIB membuat preset bertipe Unsigned</strong>. Jika dibiarkan Signed, peramban akan memunculkan error <em>400 Bad Request</em>.
                  </p>
                </div>
              </div>

              {/* Interactive Form & Presets Table */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Preset Form */}
                <div className="lg:col-span-7 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-emerald-600" />
                      <span>Formulir: &quot;Add upload preset&quot;</span>
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-500">Cloudinary UI</span>
                  </div>

                  {/* Preset Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                      <span>Upload preset name</span>
                      <span className="text-[10px] text-zinc-500 font-mono">Wajib diisi</span>
                    </label>
                    <input
                      type="text"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      placeholder="misal: tasks_preset"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono font-bold"
                    />
                  </div>

                  {/* Signing Mode: Unsigned vs Signed */}
                  <div className="space-y-2 p-3.5 rounded-xl border-2 border-emerald-300 dark:border-emerald-800/80 bg-white dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-amber-500" />
                        <span>Signing Mode (Titik Kritis Sukses Unggah)</span>
                      </label>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Wajib Diubah
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setSigningMode("unsigned")}
                        className={`py-1.5 px-3 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          signingMode === "unsigned"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                        }`}
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Unsigned (Direkomendasikan)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSigningMode("signed")}
                        className={`py-1.5 px-3 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          signingMode === "signed"
                            ? "bg-red-600 text-white shadow-xs"
                            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Signed (Default Cloudinary)</span>
                      </button>
                    </div>

                    {signingMode === "unsigned" ? (
                      <div className="p-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-900 dark:text-emerald-300 leading-relaxed space-y-1">
                        <div className="font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Pilihan Benar! Unsigned Mode Aktif</span>
                        </div>
                        <p>
                          Mengizinkan browser mengunggah file langsung ke CDN tanpa memerlukan tanda tangan backend Next.js. Sangat hemat komputasi dan membypass batasan payload 4.5MB Serverless Vercel!
                        </p>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-md bg-red-500/10 border border-red-500/20 text-[11px] text-red-900 dark:text-red-300 leading-relaxed space-y-1">
                        <div className="font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                          <span>Peringatan Error di Komponen Klien!</span>
                        </div>
                        <p>
                          Jika tetap <strong>Signed</strong>, komponen <code>&lt;CldUploadWidget&gt;</code> akan melempar error <em>&quot;Upload preset must be specified or signature missing&quot;</em> karena browser tidak memiliki tanda tangan HMAC SHA-1.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Target Folder */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5 text-blue-500" />
                      <span>Folder Penampung Otomatis</span>
                    </label>
                    <input
                      type="text"
                      value={targetFolder}
                      onChange={(e) => setTargetFolder(e.target.value)}
                      placeholder="misal: serverless-odyssey/tasks"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono font-bold"
                    />
                  </div>

                  {/* Max File Size */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-zinc-700 dark:text-zinc-300">Batas Ukuran Berkas:</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">{maxFileSizeMb} MB</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={maxFileSizeMb}
                      onChange={(e) => setMaxFileSizeMb(Number(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  {/* Save Preset Button */}
                  <div className="pt-2 flex items-center justify-between">
                    {presetSavedNotice ? (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Upload preset tersimpan di Cloudinary Console!</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-zinc-500">
                        Klik untuk menyimpan pengaturan ke daftar preset:
                      </span>
                    )}
                    <Button
                      type="button"
                      onClick={handleSavePreset}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-9 cursor-pointer"
                    >
                      <Check className="w-4 h-4 mr-1.5" />
                      <span>Simpan Upload Preset</span>
                    </Button>
                  </div>
                </div>

                {/* Right Column: Presets List */}
                <div className="lg:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>Daftar Presets di Cloudinary</span>
                    </h4>
                    <span className="text-xs text-zinc-500 font-mono">
                      {activePresets.length} presets
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {activePresets.map((preset) => (
                      <div
                        key={preset.name}
                        className={`p-3 rounded-lg border transition-all ${
                          preset.name === presetName
                            ? "border-emerald-400 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20"
                            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">
                            {preset.name}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold ${
                              preset.mode === "unsigned"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                            }`}
                          >
                            {preset.mode.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                          <span className="truncate max-w-[170px]">
                            📁 {preset.folder || "(Root folder)"}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {preset.created}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Integration Snippet */}
                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Cara Pemakaian di Komponen Next.js:</span>
                    </span>
                    <div className="p-3 rounded-lg bg-zinc-950 text-zinc-200 font-mono text-[11px] leading-relaxed border border-zinc-800 select-all">
                      <code>
                        {`<CldUploadWidget\n  uploadPreset="${presetName}"\n  onSuccess={(result) => {\n    const publicId = result.info.public_id;\n    console.log("Uploaded:", publicId);\n  }}\n/>`}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: MEDIA LIBRARY & DYNAMIC URL PLAYGROUND                             */}
          {/* ========================================================================= */}
          {activeTab === "media_library" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Breadcrumb Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                  <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                  <span>Media Library</span>
                  <span>/</span>
                  <span>Folders</span>
                  <span>/</span>
                  <span className="text-zinc-900 dark:text-zinc-100 font-bold">serverless-odyssey/tasks</span>
                </div>
                <Badge variant="outline" className="text-[11px] font-mono border-purple-400 text-purple-700 dark:text-purple-300 self-start sm:self-auto">
                  📍 Lokasi Asli: Media Library ➔ Asset Details
                </Badge>
              </div>

              {/* Guide Callout */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50/80 to-indigo-50/40 dark:from-purple-950/30 dark:to-indigo-950/20 border border-purple-200/80 dark:border-purple-900/60 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-600 text-white shrink-0 mt-0.5">
                  <Sliders className="w-4 h-4" />
                </div>
                <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-1">
                  <span className="font-bold text-zinc-900 dark:text-white block">
                    Konsep Public ID &amp; Transformasi URL di Cloudinary
                  </span>
                  <p>
                    Database Supabase kita hanya menyimpan <code>image_public_id</code>. Komponen <code>&lt;CldImage&gt;</code> Next.js secara dinamis merangkai URL CDN dengan parameter cerdas (seperti <code>f_auto,q_auto,g_face</code>). Coba ubah kontrol di bawah untuk melihat live URL dan penghematan bandwidth!
                  </p>
                </div>
              </div>

              {/* Playground Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Parameter Controls */}
                <div className="lg:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 p-4 sm:p-5 space-y-4">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-600" />
                    <span>Parameter Transformasi Gambar</span>
                  </h4>

                  {/* Asset Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Pilih Aset dari Media Library:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAsset("task_cover")}
                        className={`p-2 rounded-lg border text-xs font-bold transition-all text-left cursor-pointer ${
                          selectedAsset === "task_cover"
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 shadow-xs"
                            : "border-zinc-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800"
                        }`}
                      >
                        <div className="font-mono text-[11px] truncate">task_cover_kanban</div>
                        <div className="text-[10px] text-zinc-500 font-normal">3840×2160 (3.8MB)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedAsset("avatar")}
                        className={`p-2 rounded-lg border text-xs font-bold transition-all text-left cursor-pointer ${
                          selectedAsset === "avatar"
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 shadow-xs"
                            : "border-zinc-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800"
                        }`}
                      >
                        <div className="font-mono text-[11px] truncate">user_profile</div>
                        <div className="text-[10px] text-zinc-500 font-normal">Avatar Foto Profil</div>
                      </button>
                    </div>
                  </div>

                  {/* f_auto & q_auto */}
                  <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                      <div className="text-xs">
                        <span className="font-bold font-mono text-purple-600 dark:text-purple-400">f_auto</span>
                        <p className="text-[10px] text-zinc-500">Transcode ke AVIF / WebP</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={enableAutoFormat}
                        onChange={(e) => setEnableAutoFormat(e.target.checked)}
                        className="w-4 h-4 accent-purple-600 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                      <div className="text-xs">
                        <span className="font-bold font-mono text-purple-600 dark:text-purple-400">q_auto</span>
                        <p className="text-[10px] text-zinc-500">Kompresi visual perseptual SSIM</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={enableAutoQuality}
                        onChange={(e) => setEnableAutoQuality(e.target.checked)}
                        className="w-4 h-4 accent-purple-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* AI Gravity */}
                  <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                      <span>AI Gravity (Smart Salience):</span>
                      <span className="font-mono text-[10px] text-purple-600">g_{gravityMode}</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setGravityMode("face")}
                        className={`py-1.5 px-2 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                          gravityMode === "face"
                            ? "bg-purple-600 text-white border-purple-600"
                            : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                      >
                        g_face (Wajah)
                      </button>
                      <button
                        type="button"
                        onClick={() => setGravityMode("auto")}
                        className={`py-1.5 px-2 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                          gravityMode === "auto"
                            ? "bg-purple-600 text-white border-purple-600"
                            : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                      >
                        g_auto (Subjek)
                      </button>
                      <button
                        type="button"
                        onClick={() => setGravityMode("center")}
                        className={`py-1.5 px-2 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                          gravityMode === "center"
                            ? "bg-purple-600 text-white border-purple-600"
                            : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                      >
                        g_center (Tengah)
                      </button>
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-zinc-700 dark:text-zinc-300">Resolusi (w_ &amp; h_):</span>
                      <span className="font-mono text-purple-600">{targetWidth} × {targetHeight} px</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="1200"
                      step="50"
                      value={targetWidth}
                      onChange={(e) => {
                        const w = Number(e.target.value);
                        setTargetWidth(w);
                        setTargetHeight(Math.round(w * (selectedAsset === "task_cover" ? 0.667 : 1)));
                      }}
                      className="w-full accent-purple-600"
                    />
                  </div>
                </div>

                {/* Right: Live Dynamic URL & Savings */}
                <div className="lg:col-span-7 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>Live CDN URL &amp; Bandwidth Gauge</span>
                    </h4>
                    <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                      -{savingsPct}% Hemat Bandwidth
                    </Badge>
                  </div>

                  {/* Live URL */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-600 dark:text-zinc-400">
                      <span>URL Edge Delivery Otomatis:</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(liveUrl, "live_url")}
                        className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                      >
                        {copiedKey === "live_url" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Salin URL</span>
                      </button>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-950 text-zinc-200 font-mono text-[11px] leading-relaxed border border-zinc-800 break-all select-all">
                      <span className="text-zinc-500">https://res.cloudinary.com/{cloudName}/image/upload/</span>
                      <span className="text-amber-400 font-bold">{transformString}</span>
                      <span className="text-emerald-400">/{publicId}</span>
                    </div>
                  </div>

                  {/* Visual Simulation Canvas */}
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-col items-center justify-center space-y-3">
                    <div
                      className="relative overflow-hidden rounded-lg border-2 border-purple-500/60 shadow-lg bg-zinc-900 flex items-center justify-center transition-all duration-300"
                      style={{
                        width: Math.min(targetWidth * 0.45, 320),
                        height: Math.min(targetHeight * 0.45, 220)
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 to-purple-950/80 flex flex-col items-center justify-center p-3 text-center">
                        {selectedAsset === "avatar" ? (
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 border-2 border-white flex items-center justify-center text-xl shadow-md">
                              👤
                            </div>
                            {gravityMode === "face" && (
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="absolute -inset-2 border-2 border-dashed border-emerald-400 rounded-full flex items-center justify-center pointer-events-none"
                              >
                                <span className="absolute -top-3 px-1 rounded text-[8px] font-bold bg-emerald-500 text-white">
                                  AI Face Bounding Box
                                </span>
                              </motion.div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="text-2xl">📋</div>
                            <div className="text-xs font-bold text-white tracking-wide">
                              Cover Tugas Odyssey
                            </div>
                            <div className="text-[10px] text-zinc-300 font-mono">
                              {targetWidth}×{targetHeight} px • {enableAutoFormat ? "AVIF/WebP" : "JPG"}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bandwidth Savings Gauge */}
                    <div className="w-full grid grid-cols-3 gap-2 text-center pt-2 border-t border-zinc-200 dark:border-zinc-800">
                      <div className="p-2 rounded bg-zinc-100 dark:bg-zinc-800">
                        <div className="text-[10px] text-zinc-500">Ukuran Asli:</div>
                        <div className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          {(originalBytes / 1000000).toFixed(2)} MB
                        </div>
                      </div>

                      <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Ukuran CDN:</div>
                        <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {optimizedBytes > 1000 ? `${(optimizedBytes / 1000).toFixed(0)} KB` : `${optimizedBytes} B`}
                        </div>
                      </div>

                      <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20">
                        <div className="text-[10px] text-purple-600 dark:text-purple-400">Penghematan:</div>
                        <div className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                          -{savingsPct}% Bandwidth
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: INTERACTIVE 4-STEP WALKTHROUGH & SOLUSI KENDALA                    */}
          {/* ========================================================================= */}
          {activeTab === "walkthrough" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Breadcrumb Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                  <Compass className="w-3.5 h-3.5 text-amber-500" />
                  <span>Panduan Mahasiswa</span>
                  <span>/</span>
                  <span className="text-zinc-900 dark:text-zinc-100 font-bold">Alur 4 Langkah &amp; Solusi Kendala</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-400">
                  Step-by-Step Practical Guide
                </Badge>
              </div>

              {/* 4 Steps Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step 1 */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    completedSteps.includes(1)
                      ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40"
                  } space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold">
                      1
                    </span>
                    <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-400">
                      Settings ➔ API Keys
                    </Badge>
                  </div>
                  <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Daftar Akun &amp; Salin Cloud Name
                  </h5>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Buka <strong>cloudinary.com</strong> ➔ Sign Up. Di Console baru, klik <strong>Settings (ikon roda gigi)</strong> ➔ pilih <strong>API Keys</strong> untuk melihat <code>Cloud name</code> Anda.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant={completedSteps.includes(1) ? "default" : "outline"}
                    onClick={() => {
                      if (completedSteps.includes(1)) {
                        setCompletedSteps(completedSteps.filter((s) => s !== 1));
                      } else {
                        setCompletedSteps([...completedSteps, 1]);
                      }
                    }}
                    className="w-full text-xs font-bold h-8 cursor-pointer"
                  >
                    {completedSteps.includes(1) ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-300" />
                        <span>Langkah 1 Selesai</span>
                      </>
                    ) : (
                      <span>Tandai Selesai</span>
                    )}
                  </Button>
                </div>

                {/* Step 2 */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    completedSteps.includes(2)
                      ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40"
                  } space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold">
                      2
                    </span>
                    <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-400">
                      Settings ➔ API Keys
                    </Badge>
                  </div>
                  <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Salin API Key &amp; API Secret
                  </h5>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Masih di menu <strong>API Keys</strong>, salin nilai <code>API Key</code> dan klik tombol <em>Show</em> pada <code>API Secret</code> untuk menyalin kunci rahasia backend.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant={completedSteps.includes(2) ? "default" : "outline"}
                    onClick={() => {
                      if (completedSteps.includes(2)) {
                        setCompletedSteps(completedSteps.filter((s) => s !== 2));
                      } else {
                        setCompletedSteps([...completedSteps, 2]);
                      }
                    }}
                    className="w-full text-xs font-bold h-8 cursor-pointer"
                  >
                    {completedSteps.includes(2) ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-300" />
                        <span>Langkah 2 Selesai</span>
                      </>
                    ) : (
                      <span>Tandai Selesai</span>
                    )}
                  </Button>
                </div>

                {/* Step 3 */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    completedSteps.includes(3)
                      ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40"
                  } space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold">
                      3
                    </span>
                    <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-400">
                      Settings ➔ Upload
                    </Badge>
                  </div>
                  <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Buat Unsigned Upload Preset
                  </h5>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Buka tab <strong>Upload</strong> ➔ klik <strong>Add upload preset</strong>. Beri nama <code>tasks_preset</code>, ubah <strong>Signing Mode</strong> ke <strong>Unsigned</strong>, lalu klik <em>Save</em>.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant={completedSteps.includes(3) ? "default" : "outline"}
                    onClick={() => {
                      if (completedSteps.includes(3)) {
                        setCompletedSteps(completedSteps.filter((s) => s !== 3));
                      } else {
                        setCompletedSteps([...completedSteps, 3]);
                      }
                    }}
                    className="w-full text-xs font-bold h-8 cursor-pointer"
                  >
                    {completedSteps.includes(3) ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-300" />
                        <span>Langkah 3 Selesai</span>
                      </>
                    ) : (
                      <span>Tandai Selesai</span>
                    )}
                  </Button>
                </div>

                {/* Step 4 */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    completedSteps.includes(4)
                      ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40"
                  } space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-purple-600 text-white text-xs font-bold">
                      4
                    </span>
                    <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-400">
                      Next.js .env.local
                    </Badge>
                  </div>
                  <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Konfigurasi Berkas .env.local
                  </h5>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Tempelkan 4 baris konfigurasi ke berkas <code>.env.local</code> proyek Next.js Anda. Jalankan <code>npm run dev</code> untuk memulai!
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant={completedSteps.includes(4) ? "default" : "outline"}
                    onClick={() => {
                      if (completedSteps.includes(4)) {
                        setCompletedSteps(completedSteps.filter((s) => s !== 4));
                      } else {
                        setCompletedSteps([...completedSteps, 4]);
                      }
                    }}
                    className="w-full text-xs font-bold h-8 cursor-pointer"
                  >
                    {completedSteps.includes(4) ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-300" />
                        <span>Langkah 4 Selesai</span>
                      </>
                    ) : (
                      <span>Tandai Selesai</span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Troubleshooting FAQ */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 space-y-3">
                <h5 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  <span>Pusat Solusi Kendala Lapangan (Cloudinary Troubleshooting):</span>
                </h5>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                    <div className="font-bold text-red-600 dark:text-red-400">
                      ❌ Error: &quot;Upload preset must be specified&quot; saat tombol upload diklik?
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                      <strong>Solusi:</strong> Pastikan nama preset di berkas <code>.env.local</code> (<code>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code>) sama persis dengan yang ada di Cloudinary Console, dan pastikan Signing Mode-nya disetel ke <strong>Unsigned</strong> (bukan Signed).
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                    <div className="font-bold text-red-600 dark:text-red-400">
                      ❌ Error Next.js: &quot;Invalid src prop on next/image, hostname &apos;res.cloudinary.com&apos; is not configured&quot;?
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                      <strong>Solusi:</strong> Tambahkan domain <code>res.cloudinary.com</code> ke dalam array <code>images.remotePatterns</code> pada berkas <code>next.config.ts</code>, lalu restart server (<code>Ctrl+C</code> kemudian <code>npm run dev</code>).
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
