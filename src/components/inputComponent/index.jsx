export default function InputComponent({ nomeInput, tipoInput, placeHolder, setUserState, userState }) {
  return (
    <input
      id={nomeInput}
      type={tipoInput}
      onChange={(e) => setUserState && setUserState(e.target.value)}
      placeholder={placeHolder}
      required
      className="block w-full h-full 
      border border-gray-300 px-3 py-2 shadow-sm
      focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    />
  );
}
