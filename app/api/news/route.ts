import { NextResponse } from 'next/server';
import { getLatestNews, getFeaturedNews } from '@/lib/storage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (type === 'featured') {
      const featured = await getFeaturedNews();
      if (!featured) {
        return NextResponse.json(
          { error: 'No featured article available' }, 
          { status: 404, headers: { 'Cache-Control': 'no-store' } }
        );
      }
      return NextResponse.json(featured, { 
        headers: { 'Cache-Control': 'no-store' } 
      });
    }
    
    const limit = Math.min(
      parseInt(searchParams.get('limit') || '10', 10),
      parseInt(process.env.NEXT_PUBLIC_MAX_NEWS_ITEMS || '50', 10)
    );

    const news = await getLatestNews(limit);
    if (!news?.length) {
      return NextResponse.json(
        { error: 'No news articles available' }, 
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return NextResponse.json(news, { 
      headers: { 'Cache-Control': 'no-store' } 
    });
  } catch (error) {
    console.error('Error in news API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' }, 
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
