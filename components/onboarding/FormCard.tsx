"use client";

interface FormCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function FormCard({ title, subtitle, children }: FormCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-8 transition-all hover:shadow-md">
      <div className="mb-6">
        <h3 className="text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
