import './globals.css';
import { ThemeProvider } from '@/lib/theme';

export const metadata = {
  title: 'Qubernik Console',
  description: 'Gestor de proyectos con IA',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
