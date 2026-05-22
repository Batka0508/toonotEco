export function AdminFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Тоонот Эко Хотхон Admin System. Бүх эрх хуулиар хамгаалагдсан.</p>
        <p className="font-medium text-slate-400">Version 1.0.0</p>
      </div>
    </footer>
  )
}
