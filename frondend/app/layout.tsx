import './globals.css';

export const metadata = {
  title: 'GestorPRO',
  description: 'Sistema de Gestão Profissional',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
