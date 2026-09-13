'use client';

import { useEffect, useState } from 'react';
import { Plus, Menu, KeyRound, Settings } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { colors, iconBtnStyle } from '@/lib/ui';
import { loadProjects, upsertProject } from '@/lib/projects';
import ProjectCard from '@/components/ProjectCard';
import AddProjectModal from '@/components/AddProjectModal';
import SettingsModal from '@/components/SettingsModal';
import ProvidersModal from '@/components/ProvidersModal';

export default function ConsolePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const c = colors(isDark);

  const [projects, setProjects] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProviders, setShowProviders] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [providerLabels, setProviderLabels] = useState([]);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  function refreshProviderLabels() {
    fetch('/api/env')
      .then((res) => res.json())
      .then((data) => {
        const labels = Object.values(data)
          .filter((p) => p.configured)
          .map((p) => p.label);
        setProviderLabels(labels);
      })
      .catch(() => {});
  }

  useEffect(() => {
    refreshProviderLabels();
  }, []);

  function handleCreate(newProject) {
    const next = upsertProject(newProject);
    setProjects(next);
    setShowAdd(false);
  }

  const inProgressCount = projects.filter((p) => p.status === 'en-progreso').length;

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, fontFamily: 'inherit' }}>
      <div
        style={{
          borderBottom: `1px solid ${c.border}`,
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 12,
          letterSpacing: 0.5,
          color: c.muted,
          background: c.panelAlt,
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3EBB61', display: 'inline-block' }} />
        <span>SISTEMA EN LÍNEA</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span>{projects.length} PROYECTOS</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span>{inProgressCount} EN PROGRESO</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span>MODELOS: {providerLabels.length > 0 ? providerLabels.join(' + ').toUpperCase() : 'NINGUNO CONFIGURADO'}</span>

        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <button onClick={() => setShowMenu((s) => !s)} style={iconBtnStyle(c)} aria-label="Menú">
            <Menu size={15} />
          </button>
          {showMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 30,
                background: c.panel,
                border: `1px solid ${c.border}`,
                borderRadius: 8,
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                overflow: 'hidden',
                zIndex: 20,
                minWidth: 170,
              }}
            >
              <button
                onClick={() => { setShowProviders(true); setShowMenu(false); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'transparent', border: 'none', color: c.text, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}
              >
                <KeyRound size={14} /> Proveedores
              </button>
              <button
                onClick={() => { setShowSettings(true); setShowMenu(false); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'transparent', border: 'none', color: c.text, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}
              >
                <Settings size={14} /> Ajustes
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '28px 32px 8px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: -0.3 }}>Qubernik Console</h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: c.muted }}>Vista general de todos tus proyectos</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${c.border}`, background: c.panel, color: c.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          aria-label="Agregar proyecto"
        >
          <Plus size={16} />
        </button>
      </div>

      <div style={{ padding: '20px 32px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} c={c} />
        ))}
      </div>

      {showAdd && (
        <AddProjectModal
          onClose={() => setShowAdd(false)}
          onCreate={handleCreate}
          c={c}
          existingSlugs={projects.map((p) => p.slug)}
        />
      )}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} c={c} />}
      {showProviders && (
        <ProvidersModal
          onClose={() => { setShowProviders(false); refreshProviderLabels(); }}
          c={c}
        />
      )}
    </div>
  );
}
