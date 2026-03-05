


import { redirect } from 'next/navigation';
import ClientWrapper from './components/ClientWrapper';
import Login from "@/app/login/page";

export default function Home() {
  redirect('/login');
}
