export function PulsatingDivider() {
  return (
    <div className="relative h-[2px] mb-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#5956E9]/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#5956E9]/60 to-transparent animate-pulse" 
        style={{
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />
    </div>
  );
}
