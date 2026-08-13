"use client";

import React, { useState, useEffect } from "react";
import { Activity, RefreshCw, Download, Trash2, Monitor, Smartphone, Tablet, Globe } from "lucide-react";
import { clearVisitorAnalytics, getVisitorLogs } from "../actions";

interface VisitorLog {
  id: string;
  createdAt: Date | string;
  ip: string;
  device: string;
  page: string;
  userAgent: string | null;
  location: string;
}

export default function AnalitikClient({ initialVisitors }: { initialVisitors: VisitorLog[] }) {
  const [visitors, setVisitors] = useState<VisitorLog[]>(initialVisitors);
  const [lastUpdated, setLastUpdated] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [timeFilter, setTimeFilter] = useState<"7days" | "hourly">("7days");

  const updateTimeStr = () => {
    const d = new Date();
    setLastUpdated(`${String(d.getHours()).padStart(2, '0')}.${String(d.getMinutes()).padStart(2, '0')}.${String(d.getSeconds()).padStart(2, '0')}`);
  };

  useEffect(() => {
    updateTimeStr();
    
    // Auto-refresh every 60 seconds only if window is active/visible
    const interval = setInterval(async () => {
      if (!document.hidden) {
        await handleRefreshSilent();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleRefreshSilent = async () => {
    try {
      const logs = await getVisitorLogs();
      // Serialization of dates
      setVisitors(JSON.parse(JSON.stringify(logs)));
      updateTimeStr();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefreshManual = async () => {
    setIsRefreshing(true);
    await handleRefreshSilent();
    setIsRefreshing(false);
  };

  const handleClear = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus seluruh data analitik pengunjung? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }
    setIsDeleting(true);
    try {
      const res = await clearVisitorAnalytics("divlatbang", "DIVLATBANG");
      if (res.success) {
        setVisitors([]);
        updateTimeStr();
      } else {
        alert("Gagal menghapus data analitik: " + res.error);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadCSV = () => {
    const headers = ["Waktu Akses", "IP Address", "Halaman", "Perangkat", "Lokasi (GEO)", "User Agent"];
    const rows = visitors.map(v => [
      new Date(v.createdAt).toLocaleString("id-ID"),
      v.ip,
      v.page,
      v.device,
      v.location,
      (v.userAgent || "").replace(/"/g, '""')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `visitor_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper date parsing
  const formatDate = (dateString: Date | string) => {
    const d = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${day} ${month}, ${hours}.${minutes}.${seconds}`;
  };

  // Statistics calculation
  const total = visitors.length;
  
  // Visitors today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayVisitors = visitors.filter(v => new Date(v.createdAt) >= todayStart).length;

  const mobileCount = visitors.filter(v => v.device.toLowerCase() === "mobile").length;
  const tabletCount = visitors.filter(v => v.device.toLowerCase() === "tablet").length;
  const desktopCount = visitors.filter(v => v.device.toLowerCase() === "desktop").length;

  const mobilePercent = total > 0 ? Math.round((mobileCount / total) * 100) : 0;
  const tabletPercent = total > 0 ? Math.round((tabletCount / total) * 100) : 0;
  const desktopPercent = total > 0 ? Math.round((desktopCount / total) * 100) : 0;

  // Chart data generation (Last 7 Days)
  const getChartData = () => {
    const daysData = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = `${d.getDate()} ${months[d.getMonth()]}`;
      
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      
      const count = visitors.filter(v => {
        const cDate = new Date(v.createdAt);
        return cDate >= start && cDate <= end;
      }).length;
      
      daysData.push({ label, count });
    }
    return daysData;
  };

  const chartData = getChartData();
  const maxCount = Math.max(...chartData.map(c => c.count), 5); // Base scale of 5

  // SVG dimensions for trend graph
  const svgWidth = 600;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 30;
  
  // Calculate points
  const points = chartData.map((d, idx) => {
    const x = paddingX + (idx * (svgWidth - paddingX * 2)) / 6;
    const y = svgHeight - paddingY - (d.count / maxCount) * (svgHeight - paddingY * 2);
    return { x, y, label: d.label, count: d.count };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ")
    : "";

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
    : "";

  return (
    <div className="space-y-6">
      
      {/* Real-time Analytics Header Box */}
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Activity className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black tracking-tight uppercase text-foreground flex items-center gap-2">
                <span>Analitik Pengunjung Real-Time</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 tracking-wider">
                LIVE - PEMBARUAN OTOMATIS 10 DETIK
              </span>
              <span className="text-[11px] font-bold text-muted-foreground">
                Terakhir Diperbarui: {lastUpdated}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto">
          <button
            onClick={handleRefreshManual}
            disabled={isRefreshing}
            className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-input bg-card text-foreground hover:bg-accent transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleDownloadCSV}
            className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-input bg-card text-foreground hover:bg-accent transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Unduh CSV</span>
          </button>
          <button
            onClick={handleClear}
            disabled={isDeleting}
            className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-rose-500/15 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>Hapus Semua</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hari Ini */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">Hari Ini</span>
            <span className="text-3xl font-black text-foreground block">{todayVisitors}</span>
            <span className="text-[11px] font-medium text-muted-foreground block">
              Hit halaman publik & admin sejak 00:00
            </span>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
            <Globe className="h-5 w-5" />
          </div>
        </div>

        {/* Total */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">Total</span>
            <span className="text-3xl font-black text-foreground block">{total}</span>
            <span className="text-[11px] font-medium text-muted-foreground block">
              Total kunjungan sepanjang waktu
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        {/* Mobile */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">Mobile</span>
            <span className="text-3xl font-black text-foreground block">{mobilePercent}%</span>
            <span className="text-[11px] font-medium text-muted-foreground block">
              {mobileCount} dari {total} kunjungan via mobile
            </span>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
            <Smartphone className="h-5 w-5" />
          </div>
        </div>

        {/* Desktop */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">Desktop</span>
            <span className="text-3xl font-black text-foreground block">{desktopPercent}%</span>
            <span className="text-[11px] font-medium text-muted-foreground block">
              {desktopCount} dari {total} kunjungan via desktop
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <Monitor className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Visual Line Chart block */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-4.5 w-4.5 text-primary" />
            <span>Visualisasi Trafik Kunjungan</span>
          </h3>
          <div className="flex bg-muted p-0.5 rounded-lg text-[10px] font-bold">
            <button
              onClick={() => setTimeFilter("7days")}
              className={`px-3 py-1.5 rounded-md transition-all ${timeFilter === "7days" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setTimeFilter("hourly")}
              className={`px-3 py-1.5 rounded-md transition-all ${timeFilter === "hourly" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Per Jam Hari Ini
            </button>
          </div>
        </div>

        {/* SVG Responsive Graph */}
        <div className="w-full overflow-hidden pt-2">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto text-primary"
            style={{ overflow: "visible" }}
          >
            {/* Grid Lines */}
            {[0, 1, 2, 3, 4].map((grid, index) => {
              const y = paddingY + (index * (svgHeight - paddingY * 2)) / 4;
              const gridVal = Math.round(maxCount - (index * maxCount) / 4);
              return (
                <g key={index} className="opacity-15">
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4"
                  />
                  <text
                    x={paddingX - 10}
                    y={y + 4}
                    textAnchor="end"
                    fill="currentColor"
                    className="text-[9px] font-black"
                  >
                    {gridVal}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            {points.length > 0 && (
              <path
                d={areaD}
                fill="currentColor"
                fillOpacity="0.08"
                className="transition-all duration-500"
              />
            )}

            {/* Line Path */}
            {points.length > 0 && (
              <path
                d={pathD}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-500"
              />
            )}

            {/* Interactive Data Nodes */}
            {points.map((p, idx) => (
              <g key={idx} className="group transition-all duration-300">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill="var(--card)"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="cursor-pointer hover:r-7 transition-all"
                />
                {/* Value tooltip label */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <rect
                    x={p.x - 30}
                    y={p.y - 30}
                    width="60"
                    height="20"
                    rx="4"
                    fill="var(--card)"
                    stroke="border"
                    className="shadow-md"
                  />
                  <text
                    x={p.x}
                    y={p.y - 17}
                    textAnchor="middle"
                    fill="currentColor"
                    className="text-[9px] font-black"
                  >
                    {p.count} Hits
                  </text>
                </g>
                {/* X Axis Label */}
                <text
                  x={p.x}
                  y={svgHeight - 10}
                  textAnchor="middle"
                  fill="var(--muted-foreground)"
                  className="text-[9px] font-bold"
                >
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Device Distribution and Layout Columns */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/85 pb-4">
          <Monitor className="h-4.5 w-4.5 text-primary" />
          <span>Distribusi Perangkat Pengunjung</span>
        </h3>
        <div className="space-y-4 pt-2">
          {/* Desktop */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground flex items-center space-x-1.5">
                <Monitor className="h-3.5 w-3.5 text-amber-500" />
                <span>Desktop</span>
              </span>
              <span className="text-muted-foreground">{desktopCount} ({desktopPercent}%)</span>
            </div>
            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                style={{ width: `${desktopPercent}%` }}
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground flex items-center space-x-1.5">
                <Smartphone className="h-3.5 w-3.5 text-purple-500" />
                <span>Mobile</span>
              </span>
              <span className="text-muted-foreground">{mobileCount} ({mobilePercent}%)</span>
            </div>
            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full transition-all duration-500" 
                style={{ width: `${mobilePercent}%` }}
              />
            </div>
          </div>

          {/* Tablet */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground flex items-center space-x-1.5">
                <Tablet className="h-3.5 w-3.5 text-blue-500" />
                <span>Tablet</span>
              </span>
              <span className="text-muted-foreground">{tabletCount} ({tabletPercent}%)</span>
            </div>
            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                style={{ width: `${tabletPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real-time visitor log table */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border/85 pb-4">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-2">
            <Globe className="h-4.5 w-4.5 text-primary" />
            <span>Log Kunjungan Real-Time (Top 50 Terbaru)</span>
          </h3>
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-widest animate-pulse">
            LIVE
          </span>
        </div>
        <div className="overflow-x-auto pt-2">
          <table className="w-full min-w-237.5 text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4 text-center w-12">#</th>
                <th className="p-4">Waktu Akses</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Halaman</th>
                <th className="p-4">Perangkat</th>
                <th className="p-4">Lokasi (GEO)</th>
                <th className="p-4">User Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visitors.length > 0 ? (
                visitors.slice(0, 50).map((v, index) => (
                  <tr key={v.id} className="hover:bg-accent/10 transition-colors">
                    <td className="p-4 text-center font-bold text-muted-foreground">
                      {index + 1}
                    </td>
                    <td className="p-4 text-foreground/80 font-medium whitespace-nowrap">
                      {formatDate(v.createdAt)}
                    </td>
                    <td className="p-4 font-bold text-foreground">
                      {v.ip}
                    </td>
                    <td className="p-4">
                      <span className="text-primary font-bold hover:underline cursor-pointer">
                        {v.page}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap font-medium text-foreground">
                      {v.device.toLowerCase() === "desktop" && (
                        <span className="flex items-center space-x-1">
                          <Monitor className="h-3.5 w-3.5 text-amber-500" />
                          <span>Desktop</span>
                        </span>
                      )}
                      {v.device.toLowerCase() === "mobile" && (
                        <span className="flex items-center space-x-1">
                          <Smartphone className="h-3.5 w-3.5 text-purple-500" />
                          <span>Mobile</span>
                        </span>
                      )}
                      {v.device.toLowerCase() === "tablet" && (
                        <span className="flex items-center space-x-1">
                          <Tablet className="h-3.5 w-3.5 text-blue-500" />
                          <span>Tablet</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center space-x-1 text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {v.location}
                      </span>
                    </td>
                    <td className="p-4 text-[10px] text-muted-foreground leading-relaxed max-w-xs truncate font-medium">
                      {v.userAgent || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-12 text-sm text-muted-foreground font-semibold">
                    Belum ada data kunjungan yang terekam.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
