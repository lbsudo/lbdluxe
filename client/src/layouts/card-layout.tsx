export default function CardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-start bg-[#0a0a0a] text-white">
      <div className="w-full max-w-[420px] px-4 py-8">{children}</div>
    </main>
  );
}
