'use client'


import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import TituloSignPages from '../../../components/tituloSignPages';
import FormInsumo from '../../../components/forms/FormInsumo';
import FormProduto from '../../../components/forms/FormProduto';

export default  function CadastroProdutoInsumo() {
  const [selectedRelatorio, setSelectedRelatorio] = useState("selecioneRelatorio");
  const { data: session, status } = useSession();
  const [componentSuccess, setComponentSuccess] = useState(false);
  const [componentError, setComponentError] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect('/signin');
    }
  }, [status]);

  useEffect(() => {
    if (componentError) {
      toast.error('Erro ao postar relatório!',
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      setComponentError(false)
    }
  }, [componentSuccess]);

  useEffect(() => {
    if (componentSuccess) {
      toast.success('Relatório cadastrado com sucesso!',
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      setComponentSuccess(false)
    }
  }, [componentSuccess]);


  if (status === "unauthenticated") {
    return null; // Enquanto redireciona, evita renderizar o conteúdo da página
  }

  // Adicionando uma verificação antes de renderizar o componente
  if (status === "loading") {
    return <p>Loading...</p>; // Pode ser substituído por um componente de carregamento mais estilizado
  }

  const renderForm = () => {
    if (componentSuccess) return null; // Oculta o formulário se o relatório for postado com sucesso.

    switch (selectedRelatorio) {
      case 'insumo':
        return <FormInsumo />;
      case 'produto':
        return <FormProduto />;
      case 'selecioneRelatorio':
        return null;
      default:
        return null; // Retorna nada quando nenhum relatório está selecionado
    }
  };


  return (
    <div className='flex justify-center items-center content-center flex-nowrap flex-col space-y-4'>


      <div className='flex flex-nowrap flex-col justify-center items-center content-center'>
        <div className=''>
          <TituloSignPages tituloTexto={"Cadastro de Insumo e Produto!"} />
        </div>

        <form className=" flex flex-col justify-center items-center content-center mx-auto">
          <div className="mb-1 flex flex-col ">
            <label htmlFor="relatorio" className=" block mb-2 font-medium text-gray-900 ">Selecione o insumo ou produto:</label>
            <select id="relatorio"
              className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
              focus:ring-blue-500 focus:border-blue-500 hover:ring-blue-800 block w-full p-2.5"
              value={selectedRelatorio} // Certifique-se de que o valor seja controlado
              onChange={e => setSelectedRelatorio(e.target.value)}
            // disabled={componentSuccess} // Desabilita o select após sucesso
            >
              <option className="hover:font-bold" value="selecioneRelatorio">Selecione o Item</option>
              <option className="hover:font-bold" value="insumo">Cadastrar Insumo</option>
              <option className="hover:font-bold" value="produto">Cadastrar Produto</option>

            </select>
          </div>
        </form>
      </div>

      <div className='flex flex-col justify-center items-center m-auto '>
        {renderForm()} {/* Renderiza o formulário baseado no selectedRelatorio */}
      </div>

    </div>
  );
}

