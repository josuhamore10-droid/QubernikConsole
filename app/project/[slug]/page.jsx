'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { colors } from '@/lib/ui';
import { getProject, upsertProject, loadChat, saveChat } from '@/lib/projects';
import ProgressPanel from '@/components/ProgressPanel';
import ChatPanel from '@/components/ChatPanel';

export default function ProjectPage({ params }) {
  const { slug } = params;
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const c = colors(isDark);

  const [project, setProject] = useState(undefined); // undefined = cargando, null = no existe
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('claude-sonnet-5');

  useEffect(() => {
    setProject(getProject(slug));
    setMessages(loadChat(slug));
  }, [slug]);

  useEffect(() => {
    if (project) saveChat(slug, messages);
  }, [messages, slug, project]);

  function handleSaveProgress(patch) {
    const updated = upsertProject({ ...project, ...patch, slug });
    setProject(updated.find((p) => p.slug === slug));
  }

  function handleProgressDetected(pct) {
    const updated = upsertProject({ ...project, progress: pct, slug });
    setProject(updated.find((p) => p.slug === slug));
  }

  if (project === undefined) {
    return (
      <div style={{ minHeight: '100vh', background: c.bg, color: c.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Cargando…
      </div>
    );
  }

  if (project === null) {
    return (
      <div style={{ minHeight: '100vh', background: c.bg, color: c.text, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <div style={{ fontSize: 14 }}>No encontramos ese proyecto.</div>
        <Link href="/" style={{ fontSize: 13, color: c.accent }}>← Volver a la consola</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text }}>
      <div style={{ padding: '16px 24px', borderBottom: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: c.muted, textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Consola
        </Link>
        <span style={{ opacity: 0.4 }}>/</span>
        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{project.name}</span>
      </div>

      <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: 20, alignItems: 'start' }}>
        <ProgressPanel project={project} onSave={handleSaveProgress} c={c} />
        <ChatPanel
          project={project}
          messages={messages}
          setMessages={setMessages}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          onProgressDetected={handleProgressDetected}
          c={c}
        />
      </div>
    </div>
  );
}
