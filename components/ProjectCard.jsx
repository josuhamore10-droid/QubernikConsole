'use client';

import Link from 'next/link';

const STATUS_LABEL = {
  'en-progreso': 'EN PROGRESO',
  'sin-definir': 'SIN DEFINIR',
  idea: 'IDEA',
  pausado: 'PAUSADO',
  completado: 'COMPLETADO',
};

// Usamos <Link> de Next (no un onClick + router.push manual) precisamente
// para que la navegación a /project/[slug] sea nativa y no dependa de que
// ningún otro estado de la página se haya inicializado correctamente.
export default function ProjectCard({ project, c }) {
  return (
    <Link href={`/project/${project.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
      <div
        style={{
          background: c.panel,
          border: `1px solid ${c.border}`,
          borderRadius: 10,
          padding: 18,
          cursor: 'pointer',
          height: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: 6,
              background: c.panelAlt,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
            }}
          >
            {project.icon}
          </span>
          <span
            style={{
              fontSize: 10,
              letterSpacing: 0.5,
              padding: '3px 8px',
              borderRadius: 20,
              border: `1px solid ${c.border}`,
              color: c.muted,
            }}
          >
            {STATUS_LABEL[project.status] || project.status.toUpperCase()}
          </span>
        </div>
        <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 10 }}>{project.name}</div>
        <div style={{ height: 5, borderRadius: 4, background: c.border, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ width: `${project.progress}%`, height: '100%', background: project.progress > 0 ? c.accent : 'transparent' }} />
        </div>
        <div style={{ fontSize: 11, color: c.muted, textAlign: 'right', marginBottom: project.notes ? 8 : 0 }}>
          {project.progress}%
        </div>
        {project.notes && <div style={{ fontSize: 12, color: c.muted, lineHeight: 1.4 }}>{project.notes}</div>}
      </div>
    </Link>
  );
}
