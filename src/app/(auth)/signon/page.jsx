'use client'

import { useState } from 'react'
import { createUser } from '../../../actions/createUser'
import Link from 'next/link'
import { toast } from 'sonner'
import {  EyeSlashIcon,  } from '@heroicons/react/24/outline'
import { EyeIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import InputComponent from '../../../components/inputComponent'
import TituloSignPages from '../../../components/tituloSignPages'

export default function SignOn() {
  const [showPassword, setShowPassword] = useState(false)
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [brokerName, setBrokerName] = useState('');
  const router = useRouter();

  return (
    <main className=''>
      <div className=" h-full flex flex-row items-center w-full m-auto">
        <div className="rounded-lg w-[250px]
          sm:w-[500px]  md:w-[700px]
          mx-auto max-w-lg my-auto bg-gradient-to-r from-slate-300  to-gray-300 p-3 shadow-lg">

          <TituloSignPages className="text-sm " tituloTexto={'Cadastro'} />

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              console.log("Senha:", password);
              console.log("Senha Confirma:", confirmPassword);

              if (password !== confirmPassword) {
                toast.error('As senhas não coincidem.');
                return;
              }
              // Espera a resposta da server action
              const responseCreateUser = await createUser(
                name,
                email,
                password,
              );

              console.log('Response Create User:', responseCreateUser);

              if (responseCreateUser.success) {
                toast.success(responseCreateUser.message);
                router.push('/signin');
              } else {
                toast.error(responseCreateUser.message);
              }
            }}


            className="text-gray-600 mt-1 rounded-lg px-2 sm:px-4 pb-4 space-y-5">
            <div>
              <label
                className="ml-1 text-base">Nome:</label>

              <div className="flex flex-row items-center
              bg-white  h-full">
                <InputComponent
                  nomeInput={'name'}
                  tipoInput={'name'}
                  placeHolder={'Digite o seu nome'}
                  userState={name}
                  setUserState={setName} />

              </div>

            </div>

            <div>
              <label className="ml-1 text-base">E-mail Corporativo:</label>

              <div className="flex flex-row items-center
              bg-white">
                <InputComponent
                  nomeInput={'email'}
                  tipoInput={'email'}
                  placeHolder={'Digite o seu email'}
                  userState={email}
                  setUserState={setEmail} />
              </div>
            </div>

            <div>
              <label className="ml-1 text-base"> Senha:</label>

              <div className="flex relative flex-row items-center
              bg-white  h-full">
                <InputComponent
                  nomeInput={'password'}
                  userState={password}
                  setUserState={setPassword}
                  tipoInput={showPassword ? "text" : "password"}
                  placeHolder="Digite sua senha" />

                <span className="grid place-content-center px-4"
                  onClick={() => {
                    setShowPassword((prev) => !prev);
                  }}>
                  {showPassword ? <EyeIcon className='size-4' /> : <EyeSlashIcon className='size-4' />}
                </span>
              </div>
            </div>

            <div>
              <label className="ml-1 text-base">Confirme sua Senha:</label>

              <div className="flex relative flex-row items-center
              bg-white  h-full">
                <InputComponent
                  nomeInput={'confirmPassword'}
                  userState={confirmPassword}
                  setUserState={setConfirmPassword}
                  tipoInput={showPassword ? "text" : "password"}
                  placeHolder="Confirme sua senha" />

                <span className="grid place-content-center px-4"
                  onClick={() => {
                    setShowPassword((prev) => !prev);
                  }}>
                  {showPassword ? <EyeIcon className='size-4' /> : <EyeSlashIcon className='size-4' />}
                </span>
              </div>
            </div>

            <div className='text-base text-gray-500 text-justify'>
              <p>
                *As informações serão usadas apenas para liberação junto às mesas, sem intenção de contato por esses canais..
              </p>
            </div>

            <button
              type="submit"
              className="transition duration-150 hover:scale-105
                  block w-full rounded-lg bg-gradient-to-l from-[#FF5E5E] to-[#F31559] px-5 py-3 text-sm font-medium text-white"
            >
              Cadastrar
            </button>

            <aside className="text-center underline text-mm text-gray-500">
              <Link href={'/signin'}>
                Já possui uma conta? Acesse aqui!
              </Link>
            </aside>

          </form>
        </div>
      </div>
    </main >
  )
}
