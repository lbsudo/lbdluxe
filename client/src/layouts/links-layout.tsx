import Squares from "@/components/backgrounds/Squares";

export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative z-10 flex min-h-full w-full cursor-default flex-col justify-center">
      <Squares
        speed={0.5}
        squareSize={40}
        direction="up" // up, down, left, right, diagonal
        borderColor="#fff"
        hoverFillColor="#222"
      />
      {/* <div className="fixed inset-0 bg-background/75 dark:bg-background/75 pointer-events-none z-0"></div> */}
      {children}
    </main>
  );
}
