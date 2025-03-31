import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function TikTokFeed() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Follow Us on TikTok</h2>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() =>
              window.open('https://tiktok.com/@altajfurnituremi', '_blank')
            }
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 5.2-2.32V9.39a8.66 8.66 0 0 0 5.52 2.05V8.26a6.3 6.3 0 0 1-3.77-1.57z" />
            </svg>
            @altajfurnituremi
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* TikTok Video Cards */}
          <Card className="overflow-hidden">
            <div className="relative aspect-[9/16] bg-gray-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400">Loading TikTok content...</p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Latest Furniture Showcase</h3>
              <p className="text-sm text-gray-600">
                Watch our latest furniture showcase on TikTok
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="relative aspect-[9/16] bg-gray-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400">Loading TikTok content...</p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Design Tips</h3>
              <p className="text-sm text-gray-600">
                Get expert tips for Arabic furniture styling
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="relative aspect-[9/16] bg-gray-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400">Loading TikTok content...</p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Customer Reviews</h3>
              <p className="text-sm text-gray-600">
                See what our customers say about our furniture
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
