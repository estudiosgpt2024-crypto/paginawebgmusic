import { useState } from "react";
import { motion } from "motion/react";
import { Avatar } from "../components/ui/Avatar";

interface CommunityPageProps {
  setPage: (page: string) => void;
}

interface Post {
  id: number;
  author: string;
  authorImage: string;
  instrument: string;
  timeAgo: string;
  content: string;
  type: "text" | "audio" | "project" | "question";
  audioUrl?: string;
  audioTitle?: string;
  likes: number;
  comments: number;
  tags?: string[];
  isLiked?: boolean;
}

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    author: "Carlos Méndez",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    instrument: "Producción",
    timeAgo: "Hace 2 horas",
    content: "¡Acabo de terminar mi primer EP después de 6 meses de trabajo! Les comparto el primer single. ¿Qué opinan del mix?",
    type: "audio",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    audioTitle: "Midnight Dreams - Single",
    likes: 234,
    comments: 56,
    tags: ["Electronic", "EP", "Producción"],
    isLiked: false
  },
  {
    id: 2,
    author: "Ana Torres",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    instrument: "Guitarra",
    timeAgo: "Hace 5 horas",
    content: "Buscando guitarrista y baterista para proyecto de jazz fusion. Tenemos bajista y tecladista. ¿Alguien interesado?",
    type: "project",
    likes: 89,
    comments: 23,
    tags: ["Jazz", "Colaboración", "Fusion"],
    isLiked: true
  },
  {
    id: 3,
    author: "Luis Ramírez",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    instrument: "Batería",
    timeAgo: "Hace 8 horas",
    content: "¿Alguien tiene tips para grabar batería en un espacio pequeño? Estoy luchando con la acústica de mi cuarto.",
    type: "question",
    likes: 156,
    comments: 42,
    tags: ["Batería", "Recording", "Tips"],
    isLiked: false
  },
  {
    id: 4,
    author: "María González",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    instrument: "Canto",
    timeAgo: "Hace 12 horas",
    content: "Grabé un cover de 'Creep' con arreglo acústico. Primera vez que me animo a compartir mi voz públicamente 🎤",
    type: "audio",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    audioTitle: "Creep (Acoustic Cover)",
    likes: 412,
    comments: 87,
    tags: ["Cover", "Vocal", "Acústico"],
    isLiked: true
  },
  {
    id: 5,
    author: "Javier Cruz",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    instrument: "Piano",
    timeAgo: "Hace 1 día",
    content: "Organizando jam session virtual este sábado 8pm (hora México). Estilo libre, todos los niveles bienvenidos. ¿Se apuntan?",
    type: "project",
    likes: 267,
    comments: 94,
    tags: ["Jam Session", "Virtual", "Todos los niveles"],
    isLiked: false
  }
];

export function CommunityPage({ setPage }: CommunityPageProps) {
  const [activeTab, setActiveTab] = useState("para-ti");
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const tabs = [
    { id: "para-ti", label: "Para Ti", icon: "✨" },
    { id: "tendencias", label: "Tendencias", icon: "🔥" },
    { id: "colaboraciones", label: "Colaboraciones", icon: "🤝" },
    { id: "proyectos", label: "Proyectos", icon: "🎵" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#080808", paddingTop: 72, paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        background: "rgba(8,8,8,0.95)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        position: "sticky",
        top: 72,
        zIndex: 50,
        backdropFilter: "blur(20px)"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 600, color: "#fff", margin: 0, marginBottom: 4 }}>
                Comunidad
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                Conecta, comparte y crece con 2,800+ músicos
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreatePost(!showCreatePost)}
              style={{
                background: "#2563EB",
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 4px 16px rgba(37,99,235,0.3)"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Crear Publicación
            </motion.button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? "rgba(37,99,235,0.15)" : "transparent",
                  border: activeTab === tab.id ? "1px solid rgba(37,99,235,0.3)" : "1px solid rgba(255,255,255,0.1)",
                  color: activeTab === tab.id ? "#3B82F6" : "rgba(255,255,255,0.6)",
                  padding: "10px 20px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.2s"
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 40px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 32 }}>
        {/* Feed */}
        <div>
          {/* Create Post Box */}
          {showCreatePost && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: "rgba(20,20,28,0.6)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16,
                padding: 20,
                marginBottom: 24
              }}
            >
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <Avatar
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
                  alt="Tu perfil"
                  size="medium"
                />
                <textarea
                  placeholder="¿Qué quieres compartir con la comunidad?"
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: 12,
                    color: "#fff",
                    fontSize: 14,
                    minHeight: 100,
                    resize: "vertical",
                    fontFamily: "inherit"
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <button style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    🎵 Audio
                  </button>
                  <button style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    📸 Imagen
                  </button>
                  <button style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    🏷️ Tags
                  </button>
                </div>
                <button
                  style={{
                    background: "#2563EB",
                    border: "none",
                    color: "#fff",
                    padding: "8px 20px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Publicar
                </button>
              </div>
            </motion.div>
          )}

          {/* Posts Feed */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: "rgba(20,20,28,0.6)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  padding: 24,
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
              >
                {/* Author Info */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <Avatar src={post.authorImage} alt={post.author} size="medium" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
                      {post.author}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                      {post.instrument} • {post.timeAgo}
                    </div>
                  </div>
                  {post.type === "project" && (
                    <span style={{
                      background: "rgba(251,191,36,0.15)",
                      border: "1px solid rgba(251,191,36,0.3)",
                      color: "#FBBF24",
                      padding: "4px 12px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 600
                    }}>
                      🤝 Colaboración
                    </span>
                  )}
                  {post.type === "question" && (
                    <span style={{
                      background: "rgba(139,92,246,0.15)",
                      border: "1px solid rgba(139,92,246,0.3)",
                      color: "#8B5CF6",
                      padding: "4px 12px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 600
                    }}>
                      ❓ Pregunta
                    </span>
                  )}
                </div>

                {/* Content */}
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                  {post.content}
                </p>

                {/* Audio Player */}
                {post.type === "audio" && post.audioUrl && (
                  <div style={{
                    background: "rgba(37,99,235,0.1)",
                    border: "1px solid rgba(37,99,235,0.2)",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 12
                  }}>
                    <button style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#2563EB",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      flexShrink: 0
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 4 }}>
                        {post.audioTitle}
                      </div>
                      <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{ width: "30%", height: "100%", background: "#2563EB", borderRadius: 999 }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>3:24</span>
                  </div>
                )}

                {/* Tags */}
                {post.tags && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.6)",
                          padding: "4px 12px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 500
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 24, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <button
                    onClick={() => handleLike(post.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: post.isLiked ? "#EF4444" : "rgba(255,255,255,0.6)",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "all 0.2s"
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={post.isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    {post.likes}
                  </button>
                  <button style={{
                    background: "transparent",
                    border: "none",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    {post.comments}
                  </button>
                  <button style={{
                    background: "transparent",
                    border: "none",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3"/>
                      <circle cx="6" cy="12" r="3"/>
                      <circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    Compartir
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Active Users */}
          <div style={{
            background: "rgba(20,20,28,0.6)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16 }}>
              🟢 Activos Ahora
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { name: "Ana Torres", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", status: "Produciendo..." },
                { name: "Luis Ramírez", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80", status: "En jam session" },
                { name: "María González", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", status: "Grabando vocals" }
              ].map((user, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ position: "relative" }}>
                    <Avatar src={user.img} alt={user.name} size="small" />
                    <div style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 10,
                      height: 10,
                      background: "#22C55E",
                      border: "2px solid #080808",
                      borderRadius: "50%"
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                      {user.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Project */}
          <div style={{
            background: "linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(139,92,246,0.2) 100%)",
            border: "1px solid rgba(37,99,235,0.3)",
            borderRadius: 16,
            padding: 20
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🔥</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 8 }}>
              Proyecto Destacado
            </h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 12, lineHeight: 1.5 }}>
              "Album Colaborativo de Jazz Fusion"
            </p>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>
              👥 12 músicos unidos
            </div>
            <button style={{
              width: "100%",
              background: "#2563EB",
              border: "none",
              color: "#fff",
              padding: "10px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer"
            }}>
              Ver Proyecto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
