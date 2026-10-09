import React from "react";
import {
  X,
  Mail,
  Calendar,
  Sparkles,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
  ExternalLink,
  ShieldAlert,
  Send,
  User,
  Tag,
  FileCheck,
  Check,
  Users
} from "lucide-react";
import { NotificationItem } from "../types";
import { GenericSilhouetteAvatar } from "./common/GenericSilhouetteAvatar";

interface NotificationModalProps {
  notification: NotificationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleRead: (id: string) => void;
  onAction?: (notification: NotificationItem) => void;
  studentName?: string;
  userEmail?: string;
  userRole?: "student" | "teacher";
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  notification,
  isOpen,
  onClose,
  onToggleRead,
  onAction,
  studentName = "Estudante",
  userEmail,
  userRole = "student",
}) => {
  if (!isOpen || !notification) return null;

  const getCategoryBadge = () => {
    switch (notification.type) {
      case "report":
        return {
          label: "Relatório de Entregas da Turma",
          color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
          icon: FileCheck,
        };
      case "deadline":
        return {
          label: "Prazo Acadêmico & TCC",
          color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
          icon: Calendar,
        };
      case "recommendation":
      case "tutor":
      case "ai_recommendation":
        return {
          label: "TutorIA • Lembrete Socrático",
          color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
          icon: Sparkles,
        };
      case "alert":
        return {
          label: "Alerta de Desempenho & Apoio",
          color: "bg-rose-500/20 text-rose-300 border-rose-500/30",
          icon: AlertTriangle,
        };
      case "system":
      default:
        return {
          label: "Comunicado Oficial",
          color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          icon: CheckCircle2,
        };
    }
  };

  const badge = getCategoryBadge();
  const BadgeIcon = badge.icon;

  const senderName = notification.sender || (
    notification.type === "deadline"
      ? "Coordenação de TCC & Estágio (PraEsT / AP Sis)"
      : notification.type === "tutor" || notification.type === "recommendation"
      ? "TutorIA - Inteligência Pedagógica"
      : "Coordenação Pedagógica Institucional"
  );

  const senderEmail = notification.senderEmail || (
    notification.type === "deadline"
      ? "tcc.praest@escola.edu.br"
      : notification.type === "tutor" || notification.type === "recommendation"
      ? "tutoria.ia@profeia.edu.br"
      : "coordenacao@escola.edu.br"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Email Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors shrink-0"
              title="Voltar ao menu anterior"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
              <Mail className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Comunicado Oficial • ProfeIA
              </span>
              <span className="text-xs font-semibold text-slate-200">
                Protocolo: NOT-{notification.id.toUpperCase()}-2026
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleRead(notification.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors border ${
                notification.read
                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                  : "bg-emerald-950 border-emerald-600/40 text-emerald-300 hover:bg-emerald-900"
              }`}
            >
              {notification.read ? "Marcar como não lida" : "Marcar como lida"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Fechar comunicado"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Email Metadata Details */}
        <div className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800 space-y-3 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}
            >
              <BadgeIcon className="w-3.5 h-3.5" />
              {badge.label}
            </span>

            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Recebido: {notification.timestamp}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
            {notification.title}
          </h2>

          <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800/80 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <strong className="text-slate-400 w-12 shrink-0">De:</strong>
              <span className="font-semibold text-white">{senderName}</span>
              <span className="text-slate-500 text-[11px]">&lt;{senderEmail}&gt;</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <strong className="text-slate-400 w-12 shrink-0">Para:</strong>
              <span className="text-indigo-300 font-semibold">
                {userRole === "teacher" ? `Prof. ${studentName}` : studentName}
              </span>
              <span className="text-slate-500 text-[11px]">
                {userEmail
                  ? `<${userEmail}>`
                  : userRole === "teacher"
                  ? "<docente@escola.com>"
                  : "<estudante@escola.com>"}
              </span>
            </div>
            {notification.deadlineDate && (
              <div className="flex items-center gap-2 text-amber-300 pt-1 border-t border-slate-800/60">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <strong className="text-amber-400">Prazo Limite Improrrogável:</strong>
                <span className="font-bold">{notification.deadlineDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Email Body Message */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          <p className="font-medium text-slate-200">
            {notification.description}
          </p>

          {/* Relatório de Entrega de Atividades da Turma INFVES3SB */}
          {notification.activityReport && (
            <div className="p-4 sm:p-5 bg-slate-950 rounded-2xl border border-indigo-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                    {notification.activityReport.disciplineName} • Turma {notification.activityReport.turma}
                  </span>
                  <h4 className="text-sm font-black text-white mt-0.5">
                    {notification.activityReport.activityTitle}
                  </h4>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-full inline-block">
                    {notification.activityReport.submittedCount} de {notification.activityReport.totalCount} entregues ({Math.round((notification.activityReport.submittedCount / notification.activityReport.totalCount) * 100)}%)
                  </span>
                </div>
              </div>

              {/* Barra de Progresso de Entregas */}
              <div className="space-y-1">
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                    style={{
                      width: `${(notification.activityReport.submittedCount / notification.activityReport.totalCount) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>{notification.activityReport.submittedCount} validados</span>
                  <span>{notification.activityReport.pendingStudents.length} pendentes</span>
                </div>
              </div>

              {/* Relação Detalhada de Alunos que Já Enviaram */}
              <div className="space-y-2">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Alunos com Envio Concluído ({notification.activityReport.submittedStudents.length}):
                </h5>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-900">
                  {notification.activityReport.submittedStudents.map((st, i) => (
                    <div
                      key={i}
                      className="pt-1.5 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <GenericSilhouetteAvatar size="xs" />
                        <div>
                          <p className="font-semibold text-white">{st.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {st.enrollmentId || "Matrícula confirmada"}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {st.submittedAt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relação de Alunos com Pendência */}
              {notification.activityReport.pendingStudents.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Alunos Pendentes de Entrega ({notification.activityReport.pendingStudents.length}):
                  </h5>
                  <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
                    {notification.activityReport.pendingStudents.map((st, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-2 text-xs bg-slate-900/60 p-1.5 rounded-lg border border-slate-800"
                      >
                        <div className="flex items-center gap-2">
                          <GenericSilhouetteAvatar size="xs" />
                          <div>
                            <p className="font-semibold text-slate-300">{st.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{st.enrollmentId}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
                          Pendente
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {notification.fullBody ? (
            <div className="whitespace-pre-line bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80 text-slate-300 space-y-2">
              {notification.fullBody}
            </div>
          ) : (
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80 space-y-3 text-slate-300">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400">
                Orientações Pedagógicas Detalhadas:
              </h4>
              <p>
                Este comunicado faz parte do acompanhamento contínuo da trajetória escolar da turma INFVES3SB no curso Técnico em Informática Integrado.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                <li>Consulte as métricas preditivas de aprendizagem e os relatórios analíticos de desempenho.</li>
                <li>Utilize o Mapa de Dificuldades para agendar oficinas e nivelamentos coletivos com roteiros socráticos guiados.</li>
                <li>Mantenha as rubricas e registros em conformidade com o regimento do curso.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-400 text-center sm:text-left">
            Dúvidas? Entre em contato com a coordenação pedagógica.
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Fechar
            </button>

            {onAction && (
              <button
                onClick={() => {
                  onAction(notification);
                  onClose();
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                <span>{notification.actionLabel || "Acessar Módulo Relacionado"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
