'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AtSymbolIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import TituloSignPages from '../../../components/tituloSignPages'

export default function SignIn() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const loginAttempt = async (event) => {
    event.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      router.push('/');
    } else {
      console.log(result?.error);
      handleLoginError(result?.error);
    }
  };

  const handleLoginError = (error) => {
    switch (error) {
      case 'CredentialsSignin':
        setErrorMessage('Email ou senha incorretos. Tente novamente.');
        break;
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'EmailCreateAccount':
      case 'Callback':
      case 'OAuthAccountNotLinked':
        setErrorMessage('Ocorreu um problema com a autenticação. Tente novamente mais tarde.');
        break;
      default:
        setErrorMessage('Ocorreu um erro inesperado. Tente novamente.');
    }
  }

  return (
    <main>
      <div className="h-screen w-screen bg-gradient-to-r from-slate-500 to-indigo-200 flex flex-row justify-cente items-center drop-shadow-2xl">
        <div className="rounded-lg h-[400px] flex justify-center flex-col
          sm:w-[400px]  md:w-[400px] lg:w-[400px]
          mx-auto max-w-lg my-auto bg-gradient-to-r from-slate-300  to-gray-300 p-3 shadow-lg">

          <TituloSignPages tituloTexto={'seja bem-vindo'} />

          {errorMessage ? <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erro:</strong>
            <span className="block sm:inline">{errorMessage}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg className="fill-current h-6 w-6 text-red-500" role="button" onClick={() => setErrorMessage('')}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
            </span>
          </div> : null}

          <form
            onSubmit={loginAttempt}
            className="mb-0 mt-6 space-y-4 rounded-lg px-4"
          >

            <div>
              <label className="sr-only">
                Email
              </label>

              <div className="relative">
                <input
                  className="w-full rounded-lg  p-4 pe-12 text-sm shadow-sm"
                  name="email"
                  id="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  required
                  onChange={event => setEmail(event.target.value)}
                  value={email}
                />

                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <AtSymbolIcon />
                </span>
              </div>
            </div>

            <div>
              <label className="sr-only">Password</label>

              <div className="relative">
                <input
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  name="password"
                  placeholder="Digite sua senha"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  onChange={event => setPassword(event.target.value)}
                  value={password}
                />

                <span className="absolute inset-y-0 end-0 grid place-content-center px-4"
                  onClick={() => {
                    setShowPassword((prev) => !prev);
                  }}>
                  {showPassword ? <EyeIcon className='size-4 text-black'/> : <EyeSlashIcon />}
                </span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="transition duration-150 hover:scale-105 block w-full rounded-lg bg-gradient-to-l from-[#FF5E5E] to-[#F31559] px-5 py-3 text-sm font-medium text-white"
              >
                Entrar
              </button>

            </div>

            <aside className="text-center text-mm text-gray-500">
              <a className="underline" href="./../signon">
                Já possui uma conta? Acesse aqui!
              </a>
            </aside>
          </form>
        </div>
      </div>

    </main>
  )
}
