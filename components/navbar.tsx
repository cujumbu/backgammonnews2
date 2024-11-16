"use client";

import { useState } from "react";
import Link from "next/link";
import { DicesIcon, MenuIcon, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <DicesIcon className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">BackgammonNews</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/news" className="text-gray-700 hover:text-gray-900">
              News
            </Link>
            <Link href="/tournaments" className="text-gray-700 hover:text-gray-900">
              Tournaments
            </Link>
            <Link href="/strategy" className="text-gray-700 hover:text-gray-900">
              Strategy
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-gray-900">
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
                className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                News
              </Link>
              <Link
                href="/tournaments"
                className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                Tournaments
              </Link>
              <Link
                href="/strategy"
                className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                Strategy
              </Link>
              <Link
                href="/admin"
                className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
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
