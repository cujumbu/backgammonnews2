import { NextResponse } from 'next/server';
import { getLatestNews, getFeaturedNews } from '@/lib/storage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (type === 'featured') {
      const featured = await getFeaturedNews();
      if (!featured) {
        return NextResponse.json({ error: 'No featured article available' }, { status: 404 });
      }
      return NextResponse.json(featured);
    }
    
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const news = await getLatestNews(limit);
    if (!news?.length) {
      return NextResponse.json({ error: 'No news articles available' }, { status: 404 });
    }
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error in news API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' }, 
      { status: 500 }
    );
  }
}