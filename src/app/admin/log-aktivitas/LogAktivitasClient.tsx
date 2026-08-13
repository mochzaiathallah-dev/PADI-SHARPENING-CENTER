"use client";

import React, { useState } from "react";
import { Search, Download, Trash2, Calendar, User, Server, History } from "lucide-react";
import { clearActivityLogs } from "../actions";

interface ActivityLog {
  id: string;
  createdAt: Date | string;
  admin: string;
  role: string;
  module: string;
  action: string;
  description: string;
  ip: string;
}

export default function LogAktivitasClient({ initialLogs }: { initialLogs: ActivityLog[] }) {
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs);
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: Date | string) => {
    const d = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month}, ${hours}.${minutes}`;
  };

  const handleClear = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus seluruh log aktivitas? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }
    setIsDeleting(true);
    try {
      const res = await clearActivityLogs("divlatbang", "DIVLATBANG");
      if (res.success) {
        // Reload logs from database after deletion
        setLogs([
          {
            id: Math.random().toString(),
            createdAt: new Date(),
            admin: "divlatbang",
            role: "DIVLATBANG",
            module: "ActivityLog",
            action: "CLEAR_LOGS",
            description: 'Admin "divlatbang" membersihkan seluruh riwayat log aktivitas & audit log.',
            ip: "127.0.0.1"
          }
        ]);
      } else {
        alert("Gagal menghapus log: " + res.error);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadCSV = () => {
    const headers = ["Waktu", "Admin", "Role", "Modul", "Aksi", "Deskripsi Perubahan", "IP Address"];
    const rows = logs.map(log => [
      formatDate(log.createdAt),
      log.admin,
      log.role,
      log.module,
      log.action,
      log.description.replace(/"/g, '""'),
      log.ip
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = logs.filter(log => {
    const q = search.toLowerCase();
    return (
      log.admin.toLowerCase().includes(q) ||
      log.role.toLowerCase().includes(q) ||
      log.module.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.description.toLowerCase().includes(q) ||
      log.ip.toLowerCase().includes(q)
    );
  });

  const getActionBadgeClass = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("CREATE")) {
      return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
    }
    if (act.includes("UPDATE")) {
      return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
    }
    if (act.includes("DELETE") || act.includes("CLEAR")) {
      return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
    }
    return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
  };

  return (
    <div className="space-y-6">
      
      {/* Riwayat Aktivitas & Audit Log Header Box */}
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <History className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight uppercase text-foreground">
              Riwayat Aktivitas & Audit Log
            </h2>
            <p className="text-xs font-semibold text-muted-foreground leading-relaxed mt-0.5 max-w-xl">
              Catatan komprehensif seluruh modifikasi data CMS yang dilakukan oleh Admin. Berfungsi sebagai jejak audit pengamanan sistem.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto">
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
            className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>Hapus Semua</span>
          </button>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama admin, modul, aksi, atau IP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border bg-card text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
        />
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-237.5 text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4 text-center w-12">#</th>
                <th className="p-4">Waktu</th>
                <th className="p-4">Admin</th>
                <th className="p-4">Modul</th>
                <th className="p-4">Aksi</th>
                <th className="p-4">Deskripsi Perubahan</th>
                <th className="p-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <tr key={log.id} className="hover:bg-accent/10 transition-colors">
                    <td className="p-4 text-center font-bold text-muted-foreground">
                      {index + 1}
                    </td>
                    <td className="p-4 text-foreground/80 font-medium whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{log.admin}</span>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight mt-0.5">
                          {log.role}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border/80">
                        {log.module}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${getActionBadgeClass(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-foreground/85 font-medium leading-relaxed max-w-xs md:max-w-md">
                      {log.description}
                    </td>
                    <td className="p-4 text-[11px] font-mono text-muted-foreground font-semibold">
                      {log.ip}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-12 text-sm text-muted-foreground font-semibold">
                    Belum ada log aktivitas yang tercatat.
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
