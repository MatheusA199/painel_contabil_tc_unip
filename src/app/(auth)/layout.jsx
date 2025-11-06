
export default function Layout({ children }) {
  return (
    <div className="flex justify-center min-h-screen
    bg-gradient-to-r from-slate-500 to-indigo-200
    drop-shadow-2xl p-auto">
      {children}
    </div>
  )
}
