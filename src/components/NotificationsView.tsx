import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calendar,
  ArrowRight,
  FolderGit2,
  Clock,
  Check,
  Mail,
  ExternalLink,
  FileCheck,
  Users
} from "lucide-react";
import { NotificationItem } from "../types";
import { NotificationModal } from "./NotificationModal";
import { CLASS_CODE } from "../data/studentsData";

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onNavigateToContext?: (notif: NotificationItem) => void;
  studentName?: string;
  userEmail?: string;
  userRole?: "student" | "teacher";
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAsRead,
  onClearAll,
  onNavigateToContext,
  studentName = "Estudante",
  userEmail,
  userRole = "student",
}) => {
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  const filtered = notifications.filter((n) => {
    if (filterType === "all") return true;
    if (filterType === "report") return n.type === "report" || !!n.activityReport;
    if (filterType === "deadline") return n.type === "deadline";
    if (filterType === "tutor") return n.type === "recommendation" || n.type === "tutor" || n.title.includes("TutorIA");
    if (filterType === "alert") return n.type === "alert";
    if (filterType === "system") return n.type === "system" || n.type === "recommendation";
    return true;
  });

  const handleOpenNotification = (notif: NotificationItem) => {
    if (!notif.read) {
      onMarkAsRead(notif.id);
    }
    setSelectedNotification(notif);
  };

  const isTeacher = userRole === "teacher" || studentName.includes("Edmilson");

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto select-none">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
              isTeacher
                ? "text-indigo-400 bg-indigo-950/80 border-indigo-500/30"
                : "text-emerald-400 bg-emerald-950/80 border-emerald-500/30"
            }`}>
              {isTeacher ? `Rotina Docente • Turma ${CLASS_CODE}` : "Central de Avisos & Prazos"}
            </span>
            <span className="text-xs font-bold text-slate-400">
              {notifications.filter((n) => !n.read).length} não lidas
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            {isTeacher ? "Notificações do Professor" : "Notificações Dinâmicas"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {isTeacher
              ? `Acompanhe relatórios nominais de entrega da turma ${CLASS_CODE}, alertas preditivos de pré-requisitos e comunicados da coordenação.`
              : "Fique por dentro de prazos de TCC (PraEsT & AP Sis), recomendações adaptativas e lembretes socráticos do TutorIA."}
          </p>
        </div>

        <button
          onClick={onClearAll}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors shrink-0 border border-slate-700"
        >
          Marcar todas como lidas
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(isTeacher
          ? [
              { id: "all", label: "Todas as Notificações" },
              { id: "report", label: "Relatórios de Entrega" },
              { id: "alert", label: "Alertas de Desempenho & Apoio" },
              { id: "system", label: "Geral & Coordenação" },
            ]
          : [
              { id: "all", label: "Todas as Notificações" },
              { id: "deadline", label: "Prazos de TCC & Projetos" },
              { id: "tutor", label: "Lembretes do TutorIA" },
              { id: "alert", label: "Alertas Pedagógicos" },
            ]
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterType === tab.id
                ? isTeacher
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List (100% Clickable) */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 text-sm">
            Nenhuma notificação encontrada nesta categoria. Tudo em dia!
          </div>
        ) : (
          filtered.map((n) => {
            let Icon = Sparkles;
            let iconColor = isTeacher
              ? "text-indigo-400 bg-indigo-950/80 border border-indigo-500/30"
              : "text-emerald-400 bg-emerald-950/80 border border-emerald-500/30";

            if (n.type === "report" || !!n.activityReport) {
              Icon = FileCheck;
              iconColor = "text-blue-400 bg-blue-950/80 border border-blue-500/30";
            } else if (n.type === "deadline") {
              Icon = Calendar;
              iconColor = "text-amber-400 bg-amber-950/80 border border-amber-500/30";
            } else if (n.type === "alert") {
              Icon = AlertTriangle;
              iconColor = "text-rose-400 bg-rose-950/80 border border-rose-500/30";
            } else if (n.type === "system") {
              Icon = CheckCircle2;
              iconColor = "text-emerald-400 bg-emerald-950/80 border border-emerald-500/30";
            }

            return (
              <div
                key={n.id}
                onClick={() => handleOpenNotification(n)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 group hover:border-emerald-500/80 hover:scale-[1.005] ${
                  !n.read
                    ? "bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-950/20"
                    : "bg-slate-900/60 border-slate-800/80 text-slate-400"
                }`}
                title="Clique para abrir comunicado completo (estilo e-mail)"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-105 ${iconColor}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3
                        className={`text-sm font-black truncate group-hover:text-emerald-300 transition-colors ${
                          !n.read ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {n.title}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 shrink-0 hidden sm:inline-flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Ler e-mail
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {n.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {n.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/50 text-[11px]">
                    <span className="text-emerald-400 group-hover:underline flex items-center gap-1 font-semibold">
                      Abrir comunicado detalhado
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    {n.actionLabel && (
                      <span className="text-slate-500 text-[10px] font-medium hidden sm:inline">
                        Ação: {n.actionLabel}
                      </span>
                    )}
                  </div>
                </div>

                {!n.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] shrink-0 mt-2" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pop-up Modal Estilo E-mail */}
      <NotificationModal
        notification={selectedNotification}
        isOpen={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        onToggleRead={onMarkAsRead}
        onAction={onNavigateToContext}
        studentName={studentName}
        userEmail={userEmail}
        userRole={isTeacher ? "teacher" : "student"}
      />
    </div>
  );
};
