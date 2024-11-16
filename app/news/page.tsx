import NewsGrid from '@/components/news-grid';

export default function NewsPage() {
  return (
    <div>
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Latest Backgammon News</h1>
        <p className="text-gray-600">
          Stay updated with the latest tournament results, player interviews, and community updates
        </p>
      </section>

      <div className="mb-8">
        <div className="glass-panel p-4 rounded-lg">
          <NewsGrid limit={20} />
        </div>
      </div>
    </div>
  );
}
