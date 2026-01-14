import { useCallback } from 'react';
import { toast } from 'sonner';

interface ShareData {
  title: string;
  text?: string;
  url?: string;
}

export function useShare() {
  const share = useCallback(async (data: ShareData) => {
    const shareUrl = data.url || window.location.href;
    const shareText = `${data.title}${data.text ? ` - ${data.text}` : ''}`;

    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.text,
          url: shareUrl,
        });
        toast.success('Shared successfully!');
        return true;
      } catch (err) {
        // User cancelled or error
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      toast.success('Link copied to clipboard!', {
        description: 'Share it with your friends',
      });
      return true;
    } catch (err) {
      toast.error('Failed to copy link');
      return false;
    }
  }, []);

  const shareHousing = useCallback((listing: { title: string; price: string }) => {
    return share({
      title: listing.title,
      text: `Check out this listing: ${listing.price}`,
      url: `https://murge.app/housing/${listing.title.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }, [share]);

  const shareProfile = useCallback((profile: { name: string; company?: string }) => {
    return share({
      title: profile.name,
      text: profile.company ? `${profile.name} at ${profile.company} on Murge` : `${profile.name} on Murge`,
      url: `https://murge.app/profile/${profile.name.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }, [share]);

  const sharePlace = useCallback((place: { name: string; category: string }) => {
    return share({
      title: place.name,
      text: `Check out ${place.name} on Murge`,
      url: `https://murge.app/explore/${place.name.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }, [share]);

  return { share, shareHousing, shareProfile, sharePlace };
}
