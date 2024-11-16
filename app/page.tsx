import FeaturedNews from '@/components/featured-news';
import NewsGrid from '@/components/news-grid';

export default function Home() {
  return (
    <div className="space-y-8">
      <header className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            BackgammonNews
          </span>
        </h1>
        <p className="text-xl text-gray-600">
          Your premier source for backgammon news and tournament updates
        </p>
      </header>

      <FeaturedNews />
      
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Latest News</h2>
          <a 
            href="/news" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </a>
        </div>
        <NewsGrid limit={6} />
      </section>
    </div>
  );
}
