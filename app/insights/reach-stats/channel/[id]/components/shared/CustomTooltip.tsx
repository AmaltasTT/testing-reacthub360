"use client";

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#2D1B4E] text-white px-3 py-2.5 rounded-xl text-[11px] shadow-xl min-w-[160px]">
      <p className="text-white/60 font-semibold mb-1.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-white/80">{p.name}</span>
          <span className="font-mono font-semibold ml-auto pl-3">{p.value}</span>
        </div>
      ))}
    </div>
  );
};
