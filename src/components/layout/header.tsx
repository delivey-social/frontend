import { Link } from "@tanstack/react-router";
import { User } from "lucide-react";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="bg-primary text-background min-h-20 flex items-center justify-between p-4">
      <div className="mx-auto max-w-7xl w-full flex items-center justify-between gap-4">
        <Link
          to="/"
          className="text-2xl text-foreground font-bold tracking-[-0.08em]"
          aria-label="comida.app início"
        >
          comida<span className="text-white font-medium">.app</span>
        </Link>

        <LoginButton />
      </div>
    </header>
  );
}

function LoginButton() {
  return (
    <Button href={import.meta.env.VITE_AUTH_URL} variant="default" size="sm">
      <User />
      Login
    </Button>
  );
}
