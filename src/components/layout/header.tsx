import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="bg-primary min-h-20 flex items-center justify-between p-4">
      <div className="mx-auto max-w-7xl w-full">
        <Link
          to="/"
          className="text-2xl font-bold tracking-[-0.08em]"
          aria-label="comida.app início"
        >
          comida<span className="text-white font-medium">.app</span>
        </Link>
      </div>
    </header>
  );
}
