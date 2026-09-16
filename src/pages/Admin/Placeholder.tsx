type AdminPlaceholderProps = {
  title: string
  description: string
}

export default function AdminPlaceholder({ title, description }: AdminPlaceholderProps) {
  return (
    <section className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Mô-đun quản trị</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-950">{title}</h1>
      <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">{description}</p>
    </section>
  )
}