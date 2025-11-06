'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
// import { toast } from 'react-toastify'
// import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table'
// import TituloSignPages from '@/components/tituloSignPages'

const indicadores = [
  ['IPCA', 1],
  ['Serviços', 2],
  ['Administrados', 3],
  ['Alim. Domicílio', 4],
  ['Industrializados', 5],
  ['SELIC', 6],
  ['Câmbio (R$/US$)', 7],
  ['PIB', 8],
  ['DBGG (% do PIB)', 9]
]

const anos = ['2025', '2026']

export default function CadastroProducaoVendaPerda() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)

  const [projecoes, setProjecoes] = useState({}) // ex: { 'IPCA-2025': '3.0' }

  useEffect(() => {
    if (status === 'unauthenticated' || session?.user.role === 'USER') {
      router.push('/signin')
    }
    setLoading(false)
  }, [status])

  const handleChange = (nome_indice, nome_id, ano, value) => {
    const sanitized = value
      .replace(/[^0-9.]/g, '')
      .replace(/^([^.]*\.)|\./g, '$1');

    setProjecoes(prev => ({
      ...prev,
      [`${nome_indice}-${ano}-${nome_id}`]: sanitized
    }))
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = saveProjectionAtiva(projecoes)
    console.log('Dados enviados:', projecoes)
    toast.success('Projeções registradas com sucesso!')
    // Enviar `projecoes` para backend
  }

  return (
    <div>
     
      {/* <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <Table aria-label="Tabela Projeções">
          <TableHeader>
            <TableColumn>Indicador</TableColumn>
            {anos.map(ano => (
              <TableColumn key={ano}>{ano}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {indicadores.map(([nome, id]) => (
              <TableRow key={nome}>
                <TableCell>{nome}</TableCell>
                {anos.map(ano => (
                  <TableCell key={`${nome}-${ano}`}>
                    <input
                      type="text"
                      inputMode="decimal"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-[80px]"
                      placeholder="0.0"
                      value={projecoes[`${nome}-${ano}-${id}`] || ''}
                      onInput={(e) => handleChange(nome, id, ano, e.target.value)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          </TableBody>
        </Table>

        <div className="w-full flex justify-center">
          <button
            type="submit"
            className="my-5 py-3 px-6 rounded-lg bg-ativa-yallow font-extrabold text-[#2f3349] shadow-md hover:shadow-lg uppercase"
          >
            Registrar Projeções
          </button>
        </div>
      </form> */}
    </div>
  )
}
