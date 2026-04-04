import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookingRequest } from '../types/booking';
import { ActivityBookingRequest } from '../types/activity';
import { api } from '../lib/api';
import { useToast } from '../components/ui/Toast';

export function useBooking() {
  const queryClient = useQueryClient();
  const { notify } = useToast();

  const hotelMutation = useMutation({
    mutationFn: api.submitBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerary'] });
      notify('Hotel reservation confirmed!', 'success', 'hotel');
    },
  });

  const activityMutation = useMutation({
    mutationFn: api.submitActivityBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerary'] });
      notify('Activity booked successfully!', 'success', 'local_activity');
    },
  });

  const bookHotel = async (data: BookingRequest) => {
    try {
      await hotelMutation.mutateAsync(data);
      return true;
    } catch {
      return false;
    }
  };

  const bookActivity = async (data: ActivityBookingRequest) => {
    try {
      await activityMutation.mutateAsync(data);
      return true;
    } catch {
      return false;
    }
  };

  const isSubmitting = hotelMutation.isPending || activityMutation.isPending;
  const error = hotelMutation.error?.message || activityMutation.error?.message || null;
  const success = hotelMutation.isSuccess || activityMutation.isSuccess;

  return {
    isSubmitting,
    error,
    success,
    bookHotel,
    bookActivity,
    resetState: () => {
      hotelMutation.reset();
      activityMutation.reset();
    },
  };
}
