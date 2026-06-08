import { useCallback, useEffect, useRef, useState } from "react";
import { loadDashboardOnce } from "../services/gmusic-api/dashboard-load";
import { isDashboardMockEnabled } from "../services/gmusic-api/config";
import {
  applyDashboardOutcome,
  DashboardRequestManager,
  type DashboardHookState,
} from "./dashboard-request";

export type { DashboardHookState } from "./dashboard-request";

export function useDashboard() {
  const [state, setState] = useState<DashboardHookState>({ status: "loading" });
  const managerRef = useRef(new DashboardRequestManager());

  const load = useCallback(async () => {
    const manager = managerRef.current;
    const { generation, signal } = manager.begin();

    if (!isDashboardMockEnabled()) {
      setState({ status: "loading" });
    }

    const outcome = await loadDashboardOnce(signal);
    const nextState = applyDashboardOutcome(generation, manager, outcome);
    if (nextState) setState(nextState);
  }, []);

  useEffect(() => {
    void load();
    const manager = managerRef.current;
    return () => manager.dispose();
  }, [load]);

  return {
    ...state,
    retry: load,
  };
}
