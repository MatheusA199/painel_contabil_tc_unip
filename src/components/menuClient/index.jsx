// MenuMain.jsx

'use client';

import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@mui/material';
import { Disclosure, DisclosureButton, Menu, MenuItem, MenuItems } from '@headlessui/react';
import MenuButtonComponent from './menuBotton';

export default function MenuClient() {
  const [showMenuLabel, setShowMenuLabel] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/signin');
    }
  }, [status, router]);

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <Disclosure as="nav" className="bg-gradient-to-r bg-slate-500">
      <div className="mx-auto max-w-8xl px-2 sm:px-4 md:px-6 lg:px-8 py-2">
        <div className="relative flex h-16 items-center justify-between">
          <div onClick={() => router.push('/')} className="flex flex-1 sm:items-stretch sm:justify-start m-4 sm:ml-2 cursor-pointer">
            <img alt="Ativa Investimentos | Departamento de Macroeconomia" src="/vercel.svg" className="h-[7.5vh] w-auto" />
          </div>
          <div className="whitespace-nowrap absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Menu as="div" className="relative sm:ml-3 md:ml-0 divide-gray-100">
              <Suspense fallback={<Skeleton variant="circular" width={40} height={40} />}>
                <MenuButtonComponent />
              </Suspense>

              <MenuItems
                className="w-70 sm:w-80 md:w-90 lg:100 capitalize sm:text-lg md:text-lg lg:text-2xl divide-y divide-gray-100 absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <MenuItem className="flex flex-row space-x-2 md:space-x-4 cursor-pointer">
                  <a onClick={() => router.push('/cadastroProdutoInsumo')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <span>Gerenciar Produtos</span>
                  </a>
                </MenuItem>
                <MenuItem className="flex flex-row space-x-2 md:space-x-4 cursor-pointer">
                  <a onClick={() => router.push('/cadastroCompra')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <span>Gerenciar Compras</span>
                  </a>
                </MenuItem>
                <MenuItem className="flex flex-row space-x-2 md:space-x-4 cursor-pointer">
                  <a onClick={() => router.push('/cadastroReceita')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <span>Receitas</span>
                  </a>
                </MenuItem>
                <MenuItem className="flex flex-row space-x-2 md:space-x-4 cursor-pointer">
                  <a onClick={() => router.push('/cadastroProducao')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <span>Produção</span>
                  </a>
                </MenuItem>
                <MenuItem className="flex flex-row space-x-2 md:space-x-4 cursor-pointer">
                  <a onClick={() => router.push('/cadastroVenda')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <span>Venda</span>
                  </a>
                </MenuItem>
                <MenuItem className="flex flex-row space-x-2 md:space-x-4 cursor-pointer">
                  <a onClick={() => router.push('/cadastroPerda')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <span>Perda</span>
                  </a>
                </MenuItem>
                <MenuItem className="flex flex-row space-x-2 md:space-x-4 cursor-pointer">
                  <a onClick={() => router.push('/historicoVendas')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <span>Histórico Venda</span>
                  </a>
                </MenuItem>
                <MenuItem className="flex flex-row space-x-2 md:space-x-4 cursor-pointer">
                  <a onClick={() => router.push('/estoques')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <span>Controle Estoque</span>
                  </a>
                </MenuItem>
                <MenuItem className="flex flex-row space-x-2 md:space-x-4 cursor-pointer">
                  <a onClick={() => signOut({ callbackUrl: '/signin' })} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <span>Sign out</span>
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </Disclosure >
  );
}
