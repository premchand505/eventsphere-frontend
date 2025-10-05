'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/axios';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';
import Link from 'next/link';

// Update the Event type to include the 'host' object
type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  price: number;
  capacity: number;
   host: { id: string; email: string };
  isRegistered?: boolean; // Add this line
};


export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  // Get user and token from our global Zustand store
  const { user, token } = useAuthStore();
  
  const queryClient = useQueryClient();

  // --- DATA FETCHING with useQuery ---
  const {
    data: event,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async (): Promise<Event> => {
      const { data } = await apiClient.get(`/events/${eventId}`);
      return data;
    },
    enabled: !!eventId,
  });

  // --- DATA MUTATION (Action) with useMutation ---
  const registrationMutation = useMutation({
    mutationFn: () => {
      return apiClient.post(`/events/${eventId}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success('Successfully registered for the event!');
      // Optional: Invalidate queries to refetch data if needed
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
    onError: (error: any) => {
      // We can use the error message from our backend API
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    }
  });

  const renderRegistrationButton = () => {
    // ... 'if (!user)' and 'if (user.id === event?.host.id)' cases remain the same ...
    if (!user) {
      return (
        <Link href="/signin" className="w-full text-center bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
          Log in to Register
        </Link>
      );
    }
    
    if (user.id === event?.host.id) {
      return (
        <p className="text-center font-semibold text-gray-600 bg-gray-200 py-2 px-4 rounded">
          You are the host of this event.
        </p>
      );
    }
    
    // NEW CASE: Check if the user is already registered.
    if (event?.isRegistered) {
      return (
        <button
          disabled
          className="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded"
        >
          You are already registered
        </button>
      );
    }

    // Default case: User can register
    return (
      <button
        onClick={() => registrationMutation.mutate()}
        disabled={registrationMutation.isPending}
        className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        {registrationMutation.isPending ? 'Registering...' : 'Register for Event'}
      </button>
    );
  };

  if (isLoading) return <p className="text-center p-8">Loading event details...</p>;
  if (isError) return <p className="text-center p-8 text-red-500">Failed to load event.</p>;

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-4">{event?.title}</h1>
        <p className="text-lg text-gray-600 mb-6">{event?.description}</p>
        <div className="space-y-3 text-gray-800 mb-8">
          <p><strong>Location:</strong> {event?.location}</p>
          <p><strong>Date:</strong> {new Date(event?.date ?? '').toLocaleString()}</p>
          <p><strong>Price:</strong> ${event?.price.toFixed(2)}</p>
          <p><strong>Capacity:</strong> {event?.capacity} attendees</p>
        </div>
        
        {/* Render our smart button */}
        <div className="mt-6">
          {renderRegistrationButton()}
        </div>
      </div>
    </div>
  );
}