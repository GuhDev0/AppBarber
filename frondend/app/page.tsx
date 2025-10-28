'use client';

import ClientWrapper from './components/ClientWrapper';
import Login from './login/page';

export default function Home() {
  return (
    <ClientWrapper>
      <Login />
    </ClientWrapper>
  );
}
