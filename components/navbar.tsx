"use client";

import { useState } from "react";
import Link from "next/link";
import { DicesIcon, MenuIcon, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <DicesIcon className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">BackgammonNews</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/news" className="text-foreground/80 hover:text-foreground">
              News
            </Link>
            <Link href="/tournaments" className="text-foreground/80 hover:text-foreground">
              Tournaments
            </Link>
            <Link href="/strategy" className="text-foreground/80 hover:text-foreground">
              Strategy
            </Link>
            <Link href="/admin" className="text-foreground/80 hover:text-foreground">
              Admin
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="space-y-4 px-2 pb-4 pt-2">
              <Link
                href="/news"
                className="block rounded-md px-3 py-2 text-foreground/80 hover:bg-accent hover:text-foreground"
              >
                News
              </Link>
              <Link
                href="/tournaments"
                className="block rounded-md px-3 py-2 text-foreground/80 hover:bg-accent hover:text-foreground"
              >
                Tournaments
              </Link>
              <Link
                href="/strategy"
                className="block rounded-md px-3 py-2 text-foreground/80 hover:bg-accent hover:text-foreground"
              >
                Strategy
              </Link>
              <Link
                href="/admin"
                className="block rounded-md px-3 py-2 text-foreground/80 hover:bg-accent hover:text-foreground"
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
