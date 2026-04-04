import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { ItineraryItem } from '../types/itinerary';
import { useGuest } from '../contexts/GuestContext';

export function useCurrentBranch() {
  const { guest } = useGuest();

  const { data: itinerary = [] } = useQuery<ItineraryItem[]>({
    queryKey: ['itinerary', guest?.id],
    queryFn: () => api.getItinerary(guest!.id),
    enabled: !!guest?.id,
  });

  // Find latest confirmed hotel booking's location
  const latestHotel = [...itinerary]
    .filter((i) => i.type === 'hotel' && i.status !== 'cancelled')
    .sort((a, b) => new Date(b.check_in || 0).getTime() - new Date(a.check_in || 0).getTime())
    [0];

  const branchName = latestHotel?.locations?.name || null;
  const branchSlug = latestHotel?.locations?.slug || null;

  return { branchName, branchSlug };
}
