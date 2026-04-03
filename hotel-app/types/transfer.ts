export interface TransferRequest {
  fromLocationId: string;
  toLocationId: string;
  profileId?: string;
  departureTime?: string;
  guests?: number;
  roomPreferences?: Record<string, unknown>;
}

export interface TransferResponse {
  success: boolean;
  transferId: string;
  message: string;
  driver: {
    name: string;
    phone: string;
    vehicle: string;
    plate: string;
  };
}
