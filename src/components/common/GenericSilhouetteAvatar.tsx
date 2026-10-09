import React, { useEffect, useRef, useState } from "react";
import { User, Camera } from "lucide-react";
import { UserRole } from "../../types";

export const AVATAR_UPDATED_EVENT = "profeia-avatar-updated";

export function setActiveSessionUserId(userId: string | null): void {
  if (typeof window === "undefined") return;
  try {
    // Limpa chaves legadas globais para impedir vazamento de foto entre contas
    localStorage.removeItem("profeia_student_avatar");
    localStorage.removeItem("profeia_teacher_avatar");
    localStorage.removeItem("profeia_user_avatar");

    if (userId) {
      sessionStorage.setItem("profeia_active_user_id", userId);
      localStorage.setItem("profeia_active_user_id", userId);
    } else {
      sessionStorage.removeItem("profeia_active_user_id");
      localStorage.removeItem("profeia_active_user_id");
    }
  } catch {}
}

export function getActiveSessionUserId(): string {
  if (typeof window === "undefined") return "";
  try {
    return (
      sessionStorage.getItem("profeia_active_user_id") ||
      localStorage.getItem("profeia_active_user_id") ||
      ""
    );
  } catch {
    return "";
  }
}

export function getSavedProfileAvatar(role?: UserRole, userId?: string): string {
  if (typeof window === "undefined") return "";
  try {
    const targetUserId = (userId || getActiveSessionUserId()).trim();
    if (!targetUserId) return "";
    return localStorage.getItem(`profeia_avatar_v2_${targetUserId}`) || "";
  } catch {
    return "";
  }
}

export function saveProfileAvatar(
  dataUrl: string,
  role?: UserRole,
  userId?: string
): void {
  if (typeof window === "undefined") return;
  const targetUserId = (userId || getActiveSessionUserId()).trim();
  if (!targetUserId) return;

  try {
    if (dataUrl) {
      localStorage.setItem(`profeia_avatar_v2_${targetUserId}`, dataUrl);
    } else {
      localStorage.removeItem(`profeia_avatar_v2_${targetUserId}`);
    }
  } catch (e) {
    console.warn("Aviso ao salvar foto no localStorage:", e);
  }

  window.dispatchEvent(
    new CustomEvent(AVATAR_UPDATED_EVENT, {
      detail: { role, userId: targetUserId, dataUrl },
    })
  );
}

/**
 * Lê um arquivo de imagem local (.png, .jpg, .jpeg) e redimensiona de forma otimizada
 * para garantir armazenamento instantâneo e seguro no localStorage.
 */
export function processImageFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo de imagem."));
    reader.onload = () => {
      const rawDataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!rawDataUrl) {
        reject(new Error("Imagem vazia."));
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 420;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const outputMime =
            file.type === "image/png" ? "image/png" : "image/jpeg";
          const optimized = canvas.toDataURL(outputMime, 0.88);
          resolve(optimized.length < rawDataUrl.length ? optimized : rawDataUrl);
        } catch {
          resolve(rawDataUrl);
        }
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

interface GenericSilhouetteAvatarProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  avatarUrl?: string;
  role?: UserRole;
  userId?: string;
  editable?: boolean;
  showChangeButton?: boolean;
  disableSessionAvatar?: boolean;
  onAvatarChange?: (newDataUrl: string) => void;
}

/**
 * GenericSilhouetteAvatar
 * Exibe a foto de perfil carregada pelo utilizador (persistida no localStorage por userId) ou a
 * silhueta padrão caso nenhuma foto tenha sido definida. Permite edição direta via
 * ícone de câmara / botão 'Alterar Foto' quando `editable` ou `showChangeButton` estão ativos.
 */
export const GenericSilhouetteAvatar: React.FC<
  GenericSilhouetteAvatarProps
> = ({
  size = "md",
  className = "",
  avatarUrl,
  role,
  userId,
  editable = false,
  showChangeButton = false,
  disableSessionAvatar = false,
  onAvatarChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const resolveStoredAvatar = () => {
    if (disableSessionAvatar) return "";
    if (userId) return getSavedProfileAvatar(role, userId);
    if (editable || showChangeButton) return getSavedProfileAvatar(role);
    return "";
  };

  const [sessionAvatar, setSessionAvatar] = useState<string>(resolveStoredAvatar);

  useEffect(() => {
    const sync = () => {
      setSessionAvatar(resolveStoredAvatar());
    };
    sync();

    window.addEventListener(AVATAR_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AVATAR_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [role, userId, editable, showChangeButton, disableSessionAvatar]);

  const effectiveAvatar =
    avatarUrl !== undefined && avatarUrl !== ""
      ? avatarUrl
      : disableSessionAvatar
      ? ""
      : sessionAvatar;

  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24 sm:w-28 sm:h-28",
  };

  const iconSizes = {
    xs: "w-3.5 h-3.5",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8",
    xl: "w-12 h-12 sm:w-14 sm:h-14",
  };

  const cameraBadgeSizes = {
    xs: "w-3.5 h-3.5 p-0.5",
    sm: "w-4 h-4 p-0.5",
    md: "w-5 h-5 p-1",
    lg: "w-6 h-6 p-1",
    xl: "w-8 h-8 p-1.5",
  };

  const handleTriggerFileSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await processImageFileToDataUrl(file);
      saveProfileAvatar(dataUrl, role, userId);
      setSessionAvatar(dataUrl);
      onAvatarChange?.(dataUrl);
    } catch (err) {
      console.error("Erro ao carregar imagem de perfil:", err);
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div
      className={`inline-flex flex-col items-center gap-1.5 shrink-0 select-none ${className}`}
    >
      <div
        onClick={editable ? handleTriggerFileSelect : undefined}
        className={`relative ${sizeClasses[size]} rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-400 shrink-0 shadow-inner group ${
          editable ? "cursor-pointer" : ""
        }`}
        title={editable ? "Clique para alterar a foto de perfil" : "Foto de Perfil"}
      >
        {/* Container arredondado da imagem ou silhueta */}
        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
          {effectiveAvatar ? (
            <img
              src={effectiveAvatar}
              alt="Foto de Perfil"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <User className={`${iconSizes[size]} text-slate-400`} />
          )}
        </div>

        {/* Overlay escuro suave no hover + ícone de câmara quando editável */}
        {editable && (
          <>
            <div className="absolute inset-0 rounded-full bg-slate-950/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow" />
            </div>
            <button
              type="button"
              onClick={handleTriggerFileSelect}
              className={`absolute -bottom-0.5 -right-0.5 ${cameraBadgeSizes[size]} rounded-full bg-indigo-600 hover:bg-indigo-500 text-white border-2 border-slate-900 shadow-md flex items-center justify-center transition-transform group-hover:scale-110`}
              title="Alterar Foto de Perfil (.png, .jpg, .jpeg)"
              aria-label="Alterar Foto de Perfil"
            >
              <Camera className="w-full h-full" />
            </button>
          </>
        )}

        {(editable || showChangeButton) && (
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
        )}
      </div>

      {showChangeButton && (
        <button
          type="button"
          onClick={handleTriggerFileSelect}
          className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[10px] font-bold flex items-center gap-1 transition-all shadow-xs backdrop-blur-md cursor-pointer"
          title="Carregar nova foto do computador (.png, .jpg, .jpeg)"
        >
          <Camera className="w-3 h-3 text-indigo-300" />
          <span>Alterar Foto</span>
        </button>
      )}
    </div>
  );
};
