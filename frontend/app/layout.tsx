import './globals.css';
import { ThemeProvider } from './contexts/ThemeContext';

export const metadata = {
  title: 'GestorPRO - Sistema de Gestão para Barbearias',
  description: 'Sistema completo de gestão profissional para barbearias com agendamentos, controle de serviços e clientes.',
  keywords: 'barbearia, agendamento, gestão, serviços, clientes',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FF6B00',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
