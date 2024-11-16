import { DicesIcon } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <div className="flex items-center space-x-2">
              <DicesIcon className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">BackgammonNews</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Your premier source for backgammon news, tournament updates, and
              community insights.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/news" className="text-muted-foreground hover:text-foreground">
                  News
                </Link>
              </li>
              <li>
                <Link href="/tournaments" className="text-muted-foreground hover:text-foreground">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link href="/strategy" className="text-muted-foreground hover:text-foreground">
                  Strategy
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-foreground">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} BackgammonNews.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
