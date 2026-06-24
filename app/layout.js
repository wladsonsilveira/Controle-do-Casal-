import './globals.css';

export const metadata = {
  title: 'Controle do Casal',
  description: 'Gestão financeira compartilhada para casal'
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}