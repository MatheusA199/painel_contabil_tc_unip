'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import MenuClient from "../../components/menuClient";

export default function Layout({ children }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const userId = session?.user.id;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/signin');
    }
    setLoading(false);
  }, [status])


  if (status === "unauthenticated") {
    return null; // Evita renderização enquanto redireciona
  }
  return (
    <div>
        <div className='h-full w-full'>

          {session?.user.id == undefined ?
            (<div className=" bg-slate-500 flex flex-row justify-between items-center h-[8vh] w-full">
              <div onClick={() => router.push('/')} className="cursor-pointer pl-4 py-2">
                <img alt="Ativa Investimentos | Departamento de Macroeconomia" src="/vercel.svg" className="h-[7.5vh] w-auto" />
              </div>


              <div className="flex flex-row items-center space-x-2
            animate-pulse mr-3" >
                <div className="w-20 h-4 rounded-lg bg-zinc-100">
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-300">
                </div>
              </div>
            </div>) : (<MenuClient />)}



        </div>


      <div className="min-h-[calc(100vh-140px)]
    flex flex-col items-center bg-white
    align-items-center justify-center">
        {children}
      </div>

    </div>
  );
}
