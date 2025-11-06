"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import HomePageDashboard from '../../components/dash/HomePageDashboard';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/signin');
    }
    setLoading(false);
  }, [status]);

  if (status === "unauthenticated") {
    return null; // Evita renderização enquanto redireciona
  }

  if (session) {
    return (
      <div>
        <h1 className="text-center text-4xl sm:text-6xl text-[#61677A] font-bold my-12">
          Painel Financeiro
        </h1>

        <main className="flex flex-wrap items-center justify-center w-[100%] wrap
          ">

          <HomePageDashboard/>
        </main>

      </div>
    );
  }
}
