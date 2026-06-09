import { AnimatePresence, motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

export type WeeklyChestCelebrationState =
  | { readonly status: "idle" }
  | { readonly status: "opening" }
  | { readonly status: "reward-revealed"; readonly xpReward: number }
  | { readonly status: "closing" };

export interface WeeklyChestCelebrationShellProps {
  state: WeeklyChestCelebrationState;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WeeklyChestCelebrationShell({
  state,
  open,
  onOpenChange,
}: WeeklyChestCelebrationShellProps) {
  const isVisible = open && state.status !== "idle";
  const showReward = state.status === "reward-revealed";
  const isAnimatingOpen = state.status === "opening" || showReward;

  return (
    <Dialog open={isVisible} onOpenChange={onOpenChange}>
      <DialogContent
        className="weekly-chest-celebration-dialog sm:max-w-md border-[rgba(201,168,76,0.28)]"
        aria-labelledby="weekly-chest-title"
        aria-describedby="weekly-chest-description"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader className="items-center text-center">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: isAnimatingOpen ? 1 : 0.96, opacity: 1 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="mb-2 flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(201,168,76,0.35)] bg-[rgba(201,168,76,0.08)] text-4xl"
            aria-hidden="true"
          >
            {showReward ? "🏆" : "🎁"}
          </motion.div>

          <DialogTitle
            id="weekly-chest-title"
            className="font-serif text-2xl font-normal text-[#F5F0E8]"
          >
            {showReward ? "¡Cofre semanal abierto!" : "Abriendo tu cofre…"}
          </DialogTitle>

          <DialogDescription id="weekly-chest-description" className="text-sm text-[#8A8A8A]">
            {showReward
              ? "Completaste tu meta semanal. Tu constancia se refleja en XP extra."
              : "Estamos preparando tu recompensa de la semana."}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {showReward && state.status === "reward-revealed" && (
            <motion.div
              key="reward"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="mt-2 rounded-xl border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.08)] px-5 py-4 text-center"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[rgba(201,168,76,0.65)]">
                Recompensa
              </p>
              <p className="mt-1 font-serif text-3xl text-[#C9A84C]">+{state.xpReward} XP</p>
            </motion.div>
          )}
        </AnimatePresence>

        {state.status === "closing" && (
          <p className="sr-only" role="status">
            Cerrando celebración del cofre semanal.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
