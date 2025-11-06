// MenuButtonComponent.jsx

import { MenuButton } from '@headlessui/react';
import { useSession } from 'next-auth/react';

export default function MenuButtonComponent() {
  const { data: session } = useSession();

  // 1. Pega o nome completo da sessão
  const fullName = session?.user?.name;

  // 2. Função para formatar o nome
  const formatName = (name) => {
    if (!name) {
      return "Usuário"; // Retorna o padrão se não houver nome
    }

    const nameParts = name.split(' '); // Divide o nome em um array de palavras
    const firstName = nameParts[0];
    const secondName = nameParts.length > 1 ? nameParts[1] : ''; // Pega o segundo nome se existir

    return `${firstName} ${secondName}`.trim(); // Junta o primeiro e o segundo nome
  };

  const displayName = formatName(fullName);

  return (
    <MenuButton className="relative flex flex-row rounded-full text-sm justify-center items-center">
      <span className="hidden md:block text-white text-lg font-semibold capitalize h-max">
        {displayName}
      </span>
      <img
        alt="User Icon"
        src="/icon-user.png"
        className="h-[50px] rounded-full"
      />
    </MenuButton>
  );
}
