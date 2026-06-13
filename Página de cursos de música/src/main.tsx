import posthog from "posthog-js";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

if (import.meta.env.VITE_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host:
      import.meta.env.VITE_POSTHOG_HOST ?? "https://us.i.posthog.com",
    loaded: (ph) => {
      if (import.meta.env.DEV) ph.debug();
    },
  });
}

createRoot(document.getElementById("root")!).render(<App />);
