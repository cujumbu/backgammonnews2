export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎲</span>
              <span className="text-lg font-bold">BackgammonNews</span>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Your premier source for backgammon news, tournament updates, and
              community insights.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/news" className="text-gray-600 hover:text-gray-900">
                  News
                </a>
              </li>
              <li>
                <a href="/tournaments" className="text-gray-600 hover:text-gray-900">
                  Tournaments
                </a>
              </li>
              <li>
                <a href="/strategy" className="text-gray-600 hover:text-gray-900">
                  Strategy
                </a>
              </li>
              <li>
                <a href="/admin" className="text-gray-600 hover:text-gray-900">
                  Admin
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} BackgammonNews.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
