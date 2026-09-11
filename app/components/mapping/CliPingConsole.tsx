"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Play,
  Pause,
  Trash2,
  Copy,
  Check,
  Maximize2,
  Radio,
  RefreshCw,
  SlidersHorizontal
} from "lucide-react";
import { IpMonitoring } from "../../context/DataContext";

interface CliPingConsoleProps {
  ips: IpMonitoring[];
  selectedIp: IpMonitoring | null;
  onSelectIp: (ip: IpMonitoring) => void;
}

interface LogLine {
  id: string;
  text: string;
  type: "header" | "success" | "error" | "info" | "summary";
  timestamp: string;
}

export const CliPingConsole: React.FC<CliPingConsoleProps> = ({
  ips,
  selectedIp,
  onSelectIp
}) => {
  const [activeTargetIp, setActiveTargetIp] = useState<IpMonitoring | null>(
    selectedIp || ips[0] || null
  );
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [pingIntervalMs, setPingIntervalMs] = useState<number>(1200); // 1.2s per ping

  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrolledUpRef = useRef<boolean>(false);
  const seqRef = useRef<number>(0);

  // Sync when selectedIp from map/list changes
  useEffect(() => {
    if (selectedIp) {
      setActiveTargetIp(selectedIp);
      // Add a header banner in CLI when switching targets
      const now = new Date().toLocaleTimeString();
      setLogs((prev) => [
        ...prev,
        {
          id: `hdr-${Date.now()}`,
          text: `\nC:\\Users\\Lenovo>ping ${selectedIp.alamat_ip} -t\n\nPinging ${selectedIp.nama_ip} [${selectedIp.alamat_ip}] with 32 bytes of data:`,
          type: "header",
          timestamp: now
        }
      ]);
      // Reset user scroll state on manual IP target change
      isUserScrolledUpRef.current = false;
    }
  }, [selectedIp]);

  // Initial startup log
  useEffect(() => {
    const initialTarget = selectedIp || ips[0];
    if (initialTarget && logs.length === 0) {
      const now = new Date().toLocaleTimeString();
      setLogs([
        {
          id: `init-1`,
          text: `Microsoft Windows [Version 10.0.22631.4169]\n(c) Microsoft Corporation. All rights reserved.\n`,
          type: "info",
          timestamp: now
        },
        {
          id: `init-2`,
          text: `C:\\Users\\Lenovo>ping ${initialTarget.alamat_ip} -t\n\nPinging ${initialTarget.nama_ip} [${initialTarget.alamat_ip}] with 32 bytes of data:`,
          type: "header",
          timestamp: now
        }
      ]);
    }
  }, [ips]);

  // Continuous live ping loop
  useEffect(() => {
    if (!isRunning || !activeTargetIp) return;

    const interval = setInterval(() => {
      seqRef.current += 1;
      const now = new Date().toLocaleTimeString();
      const isOnline = activeTargetIp.status === "online";

      let newLog: LogLine;
      if (isOnline) {
        // Realistic dynamic jitter latency
        const baseLatency = activeTargetIp.response_time_ms || 2;
        const jitter = Math.floor(Math.random() * 3) - 1;
        const latency = Math.max(1, baseLatency + jitter);
        const ttl = 62;

        newLog = {
          id: `ping-${Date.now()}-${seqRef.current}`,
          text: `Reply from ${activeTargetIp.alamat_ip}: bytes=32 time=${latency}ms TTL=${ttl}`,
          type: "success",
          timestamp: now
        };
      } else {
        const isTimeout = Math.random() > 0.4;
        newLog = {
          id: `ping-${Date.now()}-${seqRef.current}`,
          text: isTimeout
            ? `Request timed out.`
            : `Reply from ${activeTargetIp.alamat_ip}: Destination host unreachable.`,
          type: "error",
          timestamp: now
        };
      }

      setLogs((prev) => {
        // Keep max 100 lines to maintain performance
        const updated = [...prev, newLog];
        return updated.length > 120 ? updated.slice(updated.length - 100) : updated;
      });
    }, pingIntervalMs);

    return () => clearInterval(interval);
  }, [isRunning, activeTargetIp, pingIntervalMs]);

  // Auto-scroll ONLY inside the terminal container div itself without touching the main window scroll
  useEffect(() => {
    const el = terminalContainerRef.current;
    if (el && !isUserScrolledUpRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [logs]);

  // Track if user scrolled up inside the terminal
  const handleTerminalScroll = () => {
    const el = terminalContainerRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    isUserScrolledUpRef.current = !isAtBottom;
  };

  const handleClear = () => {
    setLogs([]);
  };

  const handleCopyLogs = () => {
    const textToCopy = logs.map((l) => l.text).join("\n");
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ipId = Number(e.target.value);
    const target = ips.find((i) => i.id === ipId);
    if (target) {
      setActiveTargetIp(target);
      onSelectIp(target);
    }
  };

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[520px]">
      {/* CLI Window Titlebar */}
      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="h-4 w-px bg-slate-700 mx-1" />
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">CLI Live Continuous Ping — Command Prompt</span>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Pause / Resume Button */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold flex items-center gap-1 transition-colors ${
              isRunning
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30"
            }`}
            title={isRunning ? "Jeda output ping" : "Lanjutkan live ping"}
          >
            {isRunning ? (
              <>
                <Pause className="w-3 h-3" /> PAUSE
              </>
            ) : (
              <>
                <Play className="w-3 h-3" /> RESUME
              </>
            )}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopyLogs}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Salin Log CLI"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
            title="Bersihkan Layar Terminal (cls)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target IP Selector Bar */}
      <div className="bg-slate-900/60 px-4 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono text-[11px]">Target Node:</span>
          <select
            value={activeTargetIp?.id || ""}
            onChange={handleTargetChange}
            className="bg-slate-800 text-slate-200 font-mono text-xs px-2.5 py-1 rounded border border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            {ips.map((ip) => (
              <option key={ip.id} value={ip.id}>
                {ip.nama_ip} ({ip.alamat_ip}) — {ip.status.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                activeTargetIp?.status === "online"
                  ? "bg-emerald-400 animate-pulse"
                  : "bg-red-400"
              }`}
            />
            <span
              className={`font-mono text-[11px] font-bold ${
                activeTargetIp?.status === "online"
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {activeTargetIp?.status === "online" ? "HOST REACHABLE" : "HOST UNREACHABLE"}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <span>Kecepatan:</span>
            <button
              onClick={() => setPingIntervalMs(pingIntervalMs === 1000 ? 500 : 1000)}
              className="text-blue-400 hover:underline"
            >
              {pingIntervalMs === 500 ? "0.5s (Fast)" : "1.0s (Normal)"}
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Screen (Authentic Windows CMD Look) - Internal scroll only */}
      <div
        ref={terminalContainerRef}
        onScroll={handleTerminalScroll}
        className="flex-1 p-4 overflow-y-auto font-mono text-xs sm:text-[13px] leading-relaxed select-text space-y-1 bg-black text-slate-200"
      >
        {logs.map((log) => {
          if (log.type === "header") {
            return (
              <div key={log.id} className="text-slate-100 whitespace-pre-wrap font-bold pt-1">
                {log.text}
              </div>
            );
          }
          if (log.type === "info") {
            return (
              <div key={log.id} className="text-slate-400 whitespace-pre-wrap">
                {log.text}
              </div>
            );
          }
          if (log.type === "error") {
            return (
              <div key={log.id} className="text-red-400 flex items-center justify-between">
                <span>{log.text}</span>
                <span className="text-[10px] text-slate-600 select-none">{log.timestamp}</span>
              </div>
            );
          }
          return (
            <div key={log.id} className="text-slate-200 flex items-center justify-between hover:bg-slate-900/40 px-1 rounded">
              <span>{log.text}</span>
              <span className="text-[10px] text-slate-600 select-none pl-2">{log.timestamp}</span>
            </div>
          );
        })}

        {/* Live Blinking Command Cursor */}
        {isRunning && (
          <div className="flex items-center gap-1 text-emerald-400 pt-1">
            <span className="inline-block w-2.5 h-4 bg-emerald-400 animate-pulse" />
          </div>
        )}
      </div>

      {/* Terminal Footer Status Bar */}
      <div className="bg-slate-900/90 px-4 py-1.5 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span>Packets: Sent = {logs.filter((l) => l.type === "success" || l.type === "error").length}</span>
          <span>
            Lost = {logs.filter((l) => l.type === "error").length} (
            {logs.filter((l) => l.type === "success" || l.type === "error").length > 0
              ? Math.round(
                  (logs.filter((l) => l.type === "error").length /
                    logs.filter((l) => l.type === "success" || l.type === "error").length) *
                    100
                )
              : 0}
            % loss)
          </span>
        </div>
        <span className="text-slate-500">Press PAUSE to freeze output</span>
      </div>
    </div>
  );
};
