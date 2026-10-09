/**
 * TutorIA - Tutor Inteligente Pedagógico do ProfeIA
 * Cérebro adaptativo com classificação prévia de disciplinas (Router Pedagógico),
 * autonomia completa para alternância de matéria sem forçar contextos incompatíveis,
 * e sincronização em tempo real de cabeçalho, Quadro Branco e Transcrição.
 */

import React from "react";
import { TutorCallView, TutorCallViewProps } from "./tutor/TutorCallView";
export { TutorCallView };
export type { TutorCallViewProps };

export const TutorIA: React.FC<TutorCallViewProps> = (props) => {
  return <TutorCallView {...props} />;
};

export default TutorIA;
