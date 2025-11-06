import { saveProduto } from "../../../actions/managerProduct";


export default function handleCadastroProduto({nome, precoVenda}) {

    const response = saveProduto(nome, precoVenda);
    return response;
}