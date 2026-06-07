import { useState, useEffect } from "react";
import { Guitar, Mic, Map, Target, Dumbbell, ChevronRight, Lock, Menu } from "lucide-react";
import { Button } from "../components/ui/button";

interface GmusicWelcomeProps {
  setPage: (page: string) => void;
}

type AudioState = "pending" | "granted" | "denied";

export function GmusicWelcome({ setPage }: GmusicWelcomeProps) {
  const [audioState, setAudioState] = useState<AudioState>("pending");
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [placeholderStage, setPlaceholderStage] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check initial microphone permission state
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: "microphone" as PermissionName });

        if (result.state === "granted") {
          setAudioState("granted");
        } else if (result.state === "denied") {
          setAudioState("denied");
        } else {
          setAudioState("pending");
        }

        // Listen for permission changes
        result.onchange = () => {
          if (result.state === "granted") setAudioState("granted");
          else if (result.state === "denied") setAudioState("denied");
          else setAudioState("pending");
        };
      } catch (error) {
        // If permissions API not supported, default to pending
        setAudioState("pending");
      } finally {
        setIsCheckingPermission(false);
      }
    };

    checkPermission();
  }, []);

  const handleRequestAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioState("granted");
      // Stop the stream immediately, we just needed permission
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      setAudioState("denied");
    }
  };

  const handlePlaceholder = (stage: string) => {
    setPlaceholderStage(stage);
    setShowPlaceholder(true);
    setTimeout(() => setShowPlaceholder(false), 2500);
  };

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A", color: "#F5F5F7" }}>
      {/* HEADER INTERNO */}
      <header className="border-b" style={{ borderColor: "#222" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Guitar className="w-6 h-6" style={{ color: "#D4AF37" }} />
            <span className="font-semibold text-lg">Gmusic Estudio</span>
          </div>

          {/* Navegación interna - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              className="text-sm font-medium transition-colors"
              style={{ color: "#D4AF37" }}
            >
              Mi Estudio
            </button>
            <button
              onClick={() => handlePlaceholder("Etapa 02")}
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "#A0A0A5" }}
            >
              Mi Camino
            </button>
            <button
              onClick={() => handlePlaceholder("Etapa 03")}
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "#A0A0A5" }}
            >
              Mi Progreso
            </button>
            <button
              onClick={() => handlePlaceholder("Etapa 04")}
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "#A0A0A5" }}
            >
              Comunidad
            </button>
          </nav>

          {/* Widget de Perfil - Desktop */}
          <div className="hidden md:block text-right">
            <div className="font-medium">Carlos</div>
            <div className="text-xs" style={{ color: "#A0A0A5" }}>
              Mes 2 · Nodo 3 de 6
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            style={{ color: "#D4AF37" }}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t" style={{ borderColor: "#222", background: "#121212" }}>
            <div className="px-4 py-3 space-y-2">
              <div className="pb-3 border-b" style={{ borderColor: "#222" }}>
                <div className="font-medium">Carlos</div>
                <div className="text-xs" style={{ color: "#A0A0A5" }}>
                  Mes 2 · Nodo 3 de 6
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-left py-2 text-sm font-medium"
                style={{ color: "#D4AF37" }}
              >
                Mi Estudio
              </button>
              <button
                onClick={() => { handlePlaceholder("Etapa 02"); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 text-sm font-medium"
                style={{ color: "#A0A0A5" }}
              >
                Mi Camino
              </button>
              <button
                onClick={() => { handlePlaceholder("Etapa 03"); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 text-sm font-medium"
                style={{ color: "#A0A0A5" }}
              >
                Mi Progreso
              </button>
              <button
                onClick={() => { handlePlaceholder("Etapa 04"); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 text-sm font-medium"
                style={{ color: "#A0A0A5" }}
              >
                Comunidad
              </button>
            </div>
          </div>
        )}
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* BIENVENIDA */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-semibold mb-2">
            ¡Hola, Carlos! Tu estudio musical está listo para hoy.
          </h1>
          <p className="text-base md:text-lg" style={{ color: "#A0A0A5" }}>
            4 días seguidos practicando. Vamos por el quinto.
          </p>
        </div>

        {/* CTA PRINCIPAL - VISIBLE PRIMERO EN MOBILE */}
        <div className="md:hidden mb-6">
          <div
            className="rounded-lg p-6 border-2 hover:scale-[1.02] transition-transform cursor-pointer"
            style={{
              background: "linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(18, 18, 18, 0.8) 100%)",
              borderColor: "#D4AF37",
              backdropFilter: "blur(10px)",
            }}
            onClick={() => handlePlaceholder("Etapa 02")}
          >
            <div className="mb-4">
              <Map className="w-10 h-10" style={{ color: "#D4AF37" }} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Continuar mi Camino</h3>
            <p className="text-sm mb-6" style={{ color: "#A0A0A5" }}>
              Retoma la misión donde quedaste ayer y sigue avanzando en tu mapa musical.
            </p>
            <Button
              className="w-full font-medium"
              style={{
                background: "#D4AF37",
                color: "#0A0A0A",
              }}
            >
              Entrar al camino
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* WIDGET AUDIO + MÉTRICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 md:mb-12">
          {/* Widget de Audio para Guitarra */}
          <div
            className="rounded-lg p-6 border"
            style={{
              background: "rgba(18, 18, 18, 0.6)",
              backdropFilter: "blur(10px)",
              borderColor: "#222",
            }}
          >
            <div className="flex items-start gap-4">
              {/* Ícono de estado */}
              <div className="flex-shrink-0">
                {isCheckingPermission ? (
                  <Mic className="w-8 h-8" style={{ color: "#555" }} />
                ) : audioState === "granted" ? (
                  <div className="relative">
                    <Guitar className="w-8 h-8" style={{ color: "#D4AF37" }} />
                    <div
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                      style={{ background: "#10B981" }}
                    />
                  </div>
                ) : (
                  <Mic className="w-8 h-8" style={{ color: "#555" }} />
                )}
              </div>

              {/* Contenido del widget */}
              <div className="flex-1">
                {isCheckingPermission ? (
                  <>
                    <h3 className="font-medium mb-1">Verificando audio...</h3>
                    <p className="text-sm" style={{ color: "#A0A0A5" }}>
                      Preparando tu estudio de guitarra.
                    </p>
                  </>
                ) : audioState === "granted" ? (
                  <>
                    <h3 className="font-medium mb-1" style={{ color: "#D4AF37" }}>
                      Modo guitarra listo
                    </h3>
                    <p className="text-sm" style={{ color: "#A0A0A5" }}>
                      Micrófono listo para práctica.
                    </p>
                  </>
                ) : audioState === "denied" ? (
                  <>
                    <h3 className="font-medium mb-1">Audio no preparado</h3>
                    <p className="text-sm mb-3" style={{ color: "#A0A0A5" }}>
                      Ve a configuración del navegador para habilitar el micrófono.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-medium mb-1">Preparar estudio</h3>
                    <p className="text-sm mb-3" style={{ color: "#A0A0A5" }}>
                      Activa el micrófono para ejercicios interactivos.
                    </p>
                    <Button
                      onClick={handleRequestAudio}
                      className="font-medium"
                      style={{
                        background: "#D4AF37",
                        color: "#0A0A0A",
                      }}
                    >
                      Preparar estudio
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Métricas Mínimas */}
          <div
            className="rounded-lg p-6 border"
            style={{
              background: "rgba(18, 18, 18, 0.6)",
              backdropFilter: "blur(10px)",
              borderColor: "#222",
            }}
          >
            <h3 className="font-medium mb-4">Tu progreso</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: "#A0A0A5" }}>
                  Racha actual
                </span>
                <span className="font-medium">4 días</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: "#A0A0A5" }}>
                  Nodo actual
                </span>
                <span className="font-medium">Acordes abiertos</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: "#A0A0A5" }}>
                  Progreso del mes
                </span>
                <span className="font-medium">38%</span>
              </div>
            </div>
          </div>
        </div>

        {/* GRID DE ENFOQUE - 3 TARJETAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TARJETA 1 - ORO - PRINCIPAL (SOLO DESKTOP) */}
          <div
            className="hidden md:block rounded-lg p-6 border-2 hover:scale-[1.02] transition-transform cursor-pointer"
            style={{
              background: "linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(18, 18, 18, 0.8) 100%)",
              borderColor: "#D4AF37",
              backdropFilter: "blur(10px)",
            }}
            onClick={() => handlePlaceholder("Etapa 02")}
          >
            <div className="mb-4">
              <Map className="w-10 h-10" style={{ color: "#D4AF37" }} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Continuar mi Camino</h3>
            <p className="text-sm mb-6" style={{ color: "#A0A0A5" }}>
              Retoma la misión donde quedaste ayer y sigue avanzando en tu mapa musical.
            </p>
            <Button
              className="w-full font-medium"
              style={{
                background: "#D4AF37",
                color: "#0A0A0A",
              }}
            >
              Entrar al camino
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* TARJETA 2 - CARBÓN - SECUNDARIA */}
          <div
            className="rounded-lg p-6 border transition-opacity"
            style={{
              background: "rgba(18, 18, 18, 0.6)",
              borderColor: "#333",
              backdropFilter: "blur(10px)",
              opacity: 0.5,
              cursor: "not-allowed",
            }}
          >
            <div className="mb-4 flex items-center gap-2">
              <Target className="w-10 h-10" style={{ color: "#888" }} />
              <Lock className="w-4 h-4" style={{ color: "#666" }} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Desafío del Día</h3>
            <p className="text-sm mb-6" style={{ color: "#A0A0A5" }}>
              Completa el reto rápido del día para proteger tu racha y sumar XP extra.
            </p>
            <Button
              disabled
              variant="outline"
              className="w-full font-medium"
              style={{
                borderColor: "#333",
                color: "#666",
                cursor: "not-allowed",
              }}
            >
              Próximamente
            </Button>
          </div>

          {/* TARJETA 3 - OUTLINE - TERCIARIA */}
          <div
            className="rounded-lg p-6 border transition-opacity"
            style={{
              background: "rgba(18, 18, 18, 0.3)",
              borderColor: "#2A2A2A",
              backdropFilter: "blur(10px)",
              opacity: 0.4,
              cursor: "not-allowed",
            }}
          >
            <div className="mb-4 flex items-center gap-2">
              <Dumbbell className="w-10 h-10" style={{ color: "#666" }} />
              <Lock className="w-4 h-4" style={{ color: "#555" }} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Laboratorio de Práctica</h3>
            <p className="text-sm mb-6" style={{ color: "#A0A0A5" }}>
              Repasa oído, lectura, acordes o técnica sin presión de avanzar de nivel.
            </p>
            <Button
              disabled
              variant="outline"
              className="w-full font-medium"
              style={{
                borderColor: "#2A2A2A",
                color: "#555",
                cursor: "not-allowed",
              }}
            >
              Próximamente
            </Button>
          </div>
        </div>

        {/* MENSAJE DE LA ACADEMIA */}
        <div className="mt-12 text-center">
          <p className="italic text-sm max-w-2xl mx-auto" style={{ color: "#777" }}>
            Hoy no necesitas tocar perfecto. Necesitas presentarte, practicar con intención y completar el siguiente paso.
          </p>
        </div>
      </main>

      {/* PLACEHOLDER MODAL */}
      {showPlaceholder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0, 0, 0, 0.8)" }}
          onClick={() => setShowPlaceholder(false)}
        >
          <div
            className="rounded-lg p-8 border-2 max-w-md mx-4 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(18, 18, 18, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%)",
              borderColor: "#D4AF37",
              backdropFilter: "blur(20px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <Lock className="w-12 h-12 mx-auto" style={{ color: "#D4AF37" }} />
            </div>
            <h3 className="text-2xl font-semibold mb-2" style={{ color: "#D4AF37" }}>
              Próximamente
            </h3>
            <p className="text-sm mb-1" style={{ color: "#A0A0A5" }}>
              Esta funcionalidad estará disponible en:
            </p>
            <p className="text-lg font-medium mb-6" style={{ color: "#F5F5F7" }}>
              {placeholderStage}
            </p>
            <p className="text-xs italic" style={{ color: "#777" }}>
              Continúa en tu camino actual mientras trabajamos en nuevas funcionalidades.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
