export default function CardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-start overscroll-none bg-[#0a0a0a] text-white"
      // The card runs edge to edge under the status bar and home indicator
      // on an installed app, so the safe area is added back as padding.
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div
        className="w-full max-w-[420px] px-4 py-8"
        // Landscape on a notched phone puts the notch on one side.
        style={{
          paddingLeft: "calc(1rem + env(safe-area-inset-left, 0px))",
          paddingRight: "calc(1rem + env(safe-area-inset-right, 0px))",
        }}
      >
        {children}
      </div>
    </main>
  );
}
