"use client";

import { CopyButton } from "@/components/copy-button";
import { FileCode, Terminal } from "lucide-react";

interface VsCodeSnippetProps {
  code: string;
  language?: string;
  caption?: string;
  className?: string;
  enableZoom?: boolean;
}

function formatLineContent(line: string) {
  if (!line) return <span>&nbsp;</span>;

  const trimmed = line.trimStart();
  // Full comment line (VS Code Dark+ green: #6a9955)
  if (trimmed.startsWith("//") || trimmed.startsWith("#")) {
    return <span className="text-[#6a9955] italic">{line}</span>;
  }

  // Tree ASCII structure (directory structure)
  if (line.includes("├──") || line.includes("└──") || line.includes("│")) {
    const parts = line.split(/(#.*$)/);
    return (
      <span>
        <span className="text-[#4ec9b0] font-bold">{parts[0]}</span>
        {parts[1] && <span className="text-[#6a9955] italic">{parts[1]}</span>}
      </span>
    );
  }

  // Split line by inline comment if present
  const commentIndex = line.indexOf("//");
  let mainCode = line;
  let inlineComment = "";
  if (
    commentIndex !== -1 &&
    !line.slice(0, commentIndex).includes('"') &&
    !line.slice(0, commentIndex).includes("'") &&
    !line.slice(0, commentIndex).includes("`")
  ) {
    mainCode = line.slice(0, commentIndex);
    inlineComment = line.slice(commentIndex);
  }

  // Tokenize mainCode
  const tokenRegex = /(".*?"|'.*?'|`.*?`|\b(?:import|from|export|default|async|await|return|if|else|type|interface|as)\b|\b(?:function|const|let|var)\b|\b(?:git|npx|npm|pnpm|yarn|add|commit|push|checkout|branch)\b|\b(?:Promise|string|number|boolean|FormData|ClassValue|Props|ReactNode|any|void)\b|<\/?[A-Za-z0-9_]+|\b\d+\b)/g;

  const parts = mainCode.split(tokenRegex);

  return (
    <span>
      {parts.map((part, i) => {
        if (!part) return null;

        // String literals (VS Code Dark+ orange-brown #ce9178)
        if (
          (part.startsWith('"') && part.endsWith('"')) ||
          (part.startsWith("'") && part.endsWith("'")) ||
          (part.startsWith("`") && part.endsWith("`"))
        ) {
          return <span key={i} className="text-[#ce9178]">{part}</span>;
        }

        // Purple control keywords (import, export, async, await, return, etc. #c586c0)
        if (/^(import|from|export|default|async|await|return|if|else|type|interface|as)$/.test(part)) {
          return <span key={i} className="text-[#c586c0] font-medium">{part}</span>;
        }

        // Blue declaration keywords (function, const, let, var #569cd6)
        if (/^(function|const|let|var)$/.test(part)) {
          return <span key={i} className="text-[#569cd6] font-medium">{part}</span>;
        }

        // CLI Commands (#4ec9b0 / #dcdcaa)
        if (/^(git|npx|npm|pnpm|yarn|add|commit|push|checkout|branch)$/.test(part)) {
          return <span key={i} className="text-[#dcdcaa] font-semibold">{part}</span>;
        }

        // Types (#4ec9b0 cyan/teal)
        if (/^(Promise|string|number|boolean|FormData|ClassValue|Props|ReactNode|any|void)$/.test(part)) {
          return <span key={i} className="text-[#4ec9b0]">{part}</span>;
        }

        // JSX/HTML Tags (#569cd6 / #4ec9b0)
        if (/^<\/?[A-Za-z0-9_]+/.test(part)) {
          return <span key={i} className="text-[#4ec9b0] font-medium">{part}</span>;
        }

        // Numbers (#b5cea8 light green)
        if (/^\d+$/.test(part)) {
          return <span key={i} className="text-[#b5cea8]">{part}</span>;
        }

        return <span key={i} className="text-[#9cdcfe]">{part}</span>;
      })}
      {inlineComment && <span className="text-[#6a9955] italic">{inlineComment}</span>}
    </span>
  );
}

export function VsCodeSnippet({
  code,
  language = "tsx",
  caption,
  className = "",
  enableZoom = false,
}: VsCodeSnippetProps) {
  const trimmed = code.trim();
  const lines = trimmed.split("\n");

  // Auto-detect CLI
  const isCli =
    language === "bash" ||
    language === "gitignore" ||
    /^(npx|npm|git|pnpm|yarn)\b/.test(trimmed);
  const effectiveLanguage = isCli ? "bash" : language;

  // Auto-detect caption from first line comment if not provided
  let detectedCaption = caption;
  if (!detectedCaption && trimmed.startsWith("//")) {
    const firstLine = lines[0];
    const match = firstLine.replace(/^\/\/\s*/, "").split(" ")[0];
    if (match.includes("/") || match.includes(".")) {
      detectedCaption = match;
    }
  }

  const fileName =
    detectedCaption || (effectiveLanguage === "bash" ? "terminal.sh" : "component.tsx");

  return (
    <div
      className={`group relative rounded-xl border border-[#3c3c3c] bg-[#1e1e1e] text-[#d4d4d4] shadow-md transition-all duration-300 ease-out origin-center ${
        enableZoom
          ? "hover:scale-[1.2] hover:z-50 hover:shadow-[0_25px_60px_rgba(0,0,0,0.85)] hover:border-indigo-500/50"
          : "hover:border-zinc-600"
      } ${className}`}
    >
      {/* VS Code Window Titlebar / Tab Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#252526] border-b border-[#333333] rounded-t-xl select-none">
        {/* Left: Window Traffic Light Dots & Active Tab */}
        <div className="flex items-center gap-2">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Active File Tab */}
          <div className="flex items-center gap-2 px-3 py-1 bg-[#1e1e1e] border-t-2 border-[#007acc] rounded-t text-xs font-mono text-zinc-200 shadow-sm">
            {effectiveLanguage === "bash" || effectiveLanguage === "gitignore" ? (
              <Terminal className="w-3.5 h-3.5 text-[#4ec9b0] shrink-0" />
            ) : (
              <FileCode className="w-3.5 h-3.5 text-[#569cd6] shrink-0" />
            )}
            <span className="truncate max-w-[200px] sm:max-w-xs">{fileName}</span>
          </div>
        </div>

        {/* Right: Language indicator, Zoom Hint & Copy button */}
        <div className="flex items-center gap-2">
          {enableZoom && (
            <span className="hidden sm:inline text-[9px] font-mono text-zinc-400 opacity-60 group-hover:opacity-100 transition-opacity bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/60">
              🔍 1.2x Zoom
            </span>
          )}
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-[#2d2d2d] px-2 py-0.5 rounded border border-zinc-700/50">
            {effectiveLanguage}
          </span>
          <CopyButton text={code} className="hover:bg-zinc-700 text-zinc-300" />
        </div>
      </div>

      {/* VS Code Editor Body with Line Numbers */}
      <div className="p-3.5 overflow-x-auto text-xs font-mono leading-relaxed bg-[#1e1e1e]">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-[#282828] transition-colors">
                {/* Gutter Line Number */}
                <td className="w-8 pr-4 select-none text-right text-[#858585] font-mono text-[11px] align-top">
                  {idx + 1}
                </td>
                {/* Line Code Content */}
                <td className="whitespace-pre font-mono text-[#d4d4d4] align-top">
                  {formatLineContent(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VS Code Iconic Status Bar */}
      <div className="flex items-center justify-between px-3.5 py-1 bg-[#007acc] text-white text-[10px] font-mono rounded-b-xl select-none opacity-90 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3">
          <span>Ln {lines.length}, Col 1</span>
          <span>UTF-8</span>
          <span className="hidden sm:inline">CRLF</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Next.js 16</span>
          <span className="capitalize font-semibold">{language === "tsx" ? "TypeScript JSX" : language}</span>
        </div>
      </div>
    </div>
  );
}
