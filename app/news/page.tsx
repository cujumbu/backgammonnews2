import NewsGrid from '@/components/news-grid';

export default function NewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Latest Backgammon News</h1>
      <NewsGrid limit={20} />
    </div>
  );
}
