import { useCallback, useEffect, useRef, useState } from "react";
import { DashboardRequestManager } from "./dashboard-request";
import {
  loadPublicStudentSessionOnce,
  mapPublicStudentSessionOutcome,
  type PublicStudentSessionOutcome,
  type PublicStudentSessionState,
} from "../services/gmusic-api/public-student-session";

export type { PublicStudentSessionState } from "../services/gmusic-api/public-student-session";

export function usePublicStudentSession() {
  const [state, setState] = useState<PublicStudentSessionState>({ status: "loading" });
  const managerRef = useRef(new DashboardRequestManager());

  const applyOutcome = useCallback(
    (generation: number, manager: DashboardRequestManager, outcome: PublicStudentSessionOutcome) => {
      const nextState = mapPublicStudentSessionOutcome(outcome);
      if (!nextState || !manager.isCurrent(generation)) return null;
      setState(nextState);
      return outcome;
    },
    []
  );

  const refresh = useCallback(async (): Promise<PublicStudentSessionOutcome> => {
    const manager = managerRef.current;
    const { generation, signal } = manager.begin();
    setState({ status: "loading" });

    const outcome = await loadPublicStudentSessionOnce(signal);
    const applied = applyOutcome(generation, manager, outcome);
    return applied ?? { type: "aborted" };
  }, [applyOutcome]);

  useEffect(() => {
    void refresh();
    const manager = managerRef.current;
    return () => manager.dispose();
  }, [refresh]);

  return {
    ...state,
    refresh,
  };
}
