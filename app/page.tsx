import FeaturedNews from '@/components/featured-news';
import NewsGrid from '@/components/news-grid';
import TournamentUpdates from '@/components/tournament-updates';
import { DicesIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-12 text-white shadow-lg sm:px-12">
          <div className="relative z-10">
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
              Welcome to BackgammonNews.com
            </h1>
            <p className="mb-6 max-w-2xl text-lg text-blue-100">
              Your premier source for backgammon news, tournament updates, strategy
              articles, and community insights from around the world.
            </p>
            <a 
              href="/tools/analyzer"
              className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              <DicesIcon className="mr-2 h-5 w-5" />
              Try Our Position Analyzer
            </a>
          </div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rotate-12 opacity-20">
            <DicesIcon className="h-full w-full" />
          </div>
        </div>
      </section>

      <FeaturedNews />

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <NewsGrid />
        </div>
        <div>
          <TournamentUpdates />
        </div>
      </div>
    </div>
  );
}
