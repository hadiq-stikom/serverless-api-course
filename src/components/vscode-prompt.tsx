"use client";

import { CopyButton } from "@/components/copy-button";
import { Sparkles, Bot, Lightbulb, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VsCodePromptProps {
  role: string;
  prompt: string;
  tip?: string;
  className?: string;
}

function formatPromptLine(line: string) {
  if (!line.trim()) return <span>&nbsp;</span>;

  // Headings & Section breaks (e.g., "Bertindaklah sebagai...", "Batasan Teknis Wajib:", "Tolong buatkan...")
  if (
    line.startsWith("Bertindaklah") ||
    line.startsWith("Batasan") ||
    line.startsWith("Tolong") ||
    line.endsWith(":") ||
    line.startsWith("#")
  ) {
    return <span className="text-[#569cd6] font-bold">{line}</span>;
  }

  // Numbered list items: "1. 'src/app/...'"
  const numberedMatch = line.match(/^(\s*\d+\.\s*)(.*)$/);
  if (numberedMatch) {
    return (
      <span>
        <span className="text-[#4ec9b0] font-semibold">{numberedMatch[1]}</span>
        {formatInlinePromptText(numberedMatch[2])}
      </span>
    );
  }

  // Bullet points: "- Dilarang...", "* ..."
  const bulletMatch = line.match(/^(\s*[-*]\s*)(.*)$/);
  if (bulletMatch) {
    return (
      <span>
        <span className="text-[#dcdcaa] font-bold">{bulletMatch[1]}</span>
        {formatInlinePromptText(bulletMatch[2])}
      </span>
    );
  }

  return formatInlinePromptText(line);
}

function formatInlinePromptText(text: string) {
  // Tokenize paths, quotes, and technical keywords
  const regex = /('([^']+)'|"([^"]+)"|@\/components\/[A-Za-z0-9_\-\/]+|Server Component|Client Component|'use client'|Shadcn UI|Tailwind CSS|Next\.js \d+|useState)/g;
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) => {
        if (!part) return null;

        // Quoted strings or file paths: 'src/app/...'
        if (
          (part.startsWith("'") && part.endsWith("'")) ||
          (part.startsWith('"') && part.endsWith('"'))
        ) {
          return <span key={i} className="text-[#ce9178] font-mono">{part}</span>;
        }

        // Components path @/components/...
        if (part.startsWith("@/components/")) {
          return <span key={i} className="text-[#4ec9b0] font-mono">{part}</span>;
        }

        // Framework / Architecture keywords
        if (
          part === "Server Component" ||
          part === "Client Component" ||
          part === "'use client'" ||
          part === "useState"
        ) {
          return <span key={i} className="text-[#c586c0] font-semibold">{part}</span>;
        }

        if (part.includes("Next.js") || part === "Shadcn UI" || part === "Tailwind CSS") {
          return <span key={i} className="text-[#9cdcfe] font-semibold">{part}</span>;
        }

        return <span key={i} className="text-[#d4d4d4]">{part}</span>;
      })}
    </span>
  );
}

export function VsCodePrompt({
  role,
  prompt,
  tip,
  className = "",
}: VsCodePromptProps) {
  const lines = prompt.trim().split("\n");

  return (
    <div className="space-y-3">
      {/* VS Code AI Prompt Window */}
      <div
        className={`group relative rounded-xl border border-indigo-500/40 bg-[#1e1e1e] text-[#d4d4d4] shadow-md transition-all duration-200 hover:border-indigo-400 ${className}`}
      >
        {/* Titlebar / Tab Bar */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#252526] border-b border-[#333333] rounded-t-xl select-none">
          {/* Left: Window Traffic Lights & Active Prompt Tab */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Active AI Prompt Tab */}
            <div className="flex items-center gap-2 px-3 py-1 bg-[#1e1e1e] border-t-2 border-indigo-500 rounded-t text-xs font-mono text-zinc-200 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse shrink-0" />
              <span className="font-semibold text-zinc-100">prompt-template.md</span>
            </div>
          </div>

          {/* Right: Role & Copy Button */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-[9px] font-mono text-indigo-300 bg-indigo-950/80 border border-indigo-700/60 px-2 py-0.5 rounded-full truncate max-w-[220px]">
              🎯 {role}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-700/50">
              AI PROMPT
            </span>
            <CopyButton text={prompt} className="hover:bg-zinc-700 text-zinc-300" />
          </div>
        </div>

        {/* Editor Body with Line Numbers */}
        <div className="p-3.5 overflow-x-auto text-xs font-mono leading-relaxed bg-[#1e1e1e]">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-[#282828] transition-colors">
                  {/* Gutter Line Number */}
                  <td className="w-8 pr-4 select-none text-right text-[#858585] font-mono text-[11px] align-top">
                    {idx + 1}
                  </td>
                  {/* Line Prompt Content */}
                  <td className="whitespace-pre-wrap font-mono text-[#d4d4d4] align-top">
                    {formatPromptLine(line)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* VS Code AI Status Bar */}
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-gradient-to-r from-indigo-900 via-indigo-950 to-[#1e1e1e] border-t border-indigo-500/30 text-white text-[10px] font-mono rounded-b-xl select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-indigo-300 font-semibold">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              AI Prompt Assistant
            </span>
            <span className="text-zinc-400 hidden sm:inline">Ln {lines.length}, Col 1</span>
            <span className="text-zinc-400 hidden sm:inline">Markdown</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-indigo-300 font-semibold">High-Context Prompt</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3" /> Siap Digunakan
            </span>
          </div>
        </div>
      </div>

      {/* Prompting Tips Box (Styled as VS Code Suggestion) */}
      {tip && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-500/10 dark:bg-indigo-950/40 border border-indigo-500/20 text-indigo-900 dark:text-indigo-200 text-xs">
          <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-indigo-950 dark:text-indigo-100">Tips Prompting Ahli: </span>
            {tip}
          </div>
        </div>
      )}
    </div>
  );
}
