import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface WishlistProps {
  userToken: string;
}

export function Wishlist({ userToken }: WishlistProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Wishlist</h2>
        <p className="text-muted-foreground">
          Event yang Anda simpan untuk nanti
        </p>
      </div>

      <Card className="border-border">
        <CardContent className="py-16">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fitur Segera Hadir</h3>
            <p className="text-sm text-muted-foreground">
              Wishlist event akan tersedia dalam update berikutnya
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
