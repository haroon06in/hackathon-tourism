import { useState } from 'react';
import { BookingRequest } from '../types/booking';
import { ActivityBookingRequest } from '../types/activity';
import { api } from '../lib/api';

export function useBooking() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const bookHotel = async (data: BookingRequest) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await api.submitBooking(data);
      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || 'An error occurred during booking.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const bookActivity = async (data: ActivityBookingRequest) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await api.submitActivityBooking(data);
      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || 'An error occurred during booking.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    success,
    bookHotel,
    bookActivity,
    resetState: () => {
      setError(null);
      setSuccess(false);
    }
  };
}
