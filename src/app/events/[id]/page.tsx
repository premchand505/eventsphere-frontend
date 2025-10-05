'use client';
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/axios';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useSocketStore } from '@/stores/socketStore';
import ChatRoom from '@/components/chat/ChatRoom';
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
  const eventId = params.id as string;
  const { user, token } = useAuthStore();
  const queryClient = useQueryClient();
   const { socket, isConnected } = useSocketStore();


  // --- DATA FETCHING with useQuery ---
 
  const {
    data: event,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async (): Promise<Event> => {
      const { data } = await apiClient.get(`/events/${eventId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return data;
    },
    enabled: !!eventId,
  });

  useEffect(() => {
    // Make sure we have a socket connection and the event data
    if (socket && isConnected && event?.isRegistered) {
      // Join the room when the component mounts
      socket.emit('joinRoom', eventId);
      console.log(`Attempting to join room: ${eventId}`);

      // Leave the room when the component unmounts
      return () => {
        socket.emit('leaveRoom', eventId);
        console.log(`Leaving room: ${eventId}`);
      };
    }
  }, [socket, isConnected, event?.isRegistered, eventId]);



  // --- Updated DATA MUTATION (Action) with useMutation ---
   const registrationMutation = useMutation({
    mutationFn: async () => {
      // Logic to decide which endpoint to call
      if (event && event.price > 0) {
        // Paid event: get Stripe session URL
        const response = await apiClient.post(`/payments/checkout-session/${eventId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return { isPaid: true, ...response.data };
      } else {
        // Free event: register directly
        const response = await apiClient.post(`/events/${eventId}/register`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return { isPaid: false, ...response.data };
      }
    },
    onSuccess: (data) => {
      if (data.isPaid) {
        // For paid events, redirect to Stripe's URL
        window.location.href = data.url;
      } else {
        // For free events, show toast and refetch data
        toast.success('Successfully registered for the event!');
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Action failed. Please try again.';
      toast.error(errorMessage);
    }
  });

   if (isLoading) return <p className="text-center p-8">Loading event details...</p>;
  if (isError) return <p className="text-center p-8 text-red-500">Failed to load event.</p>;

  // THE FIX IS HERE 👇
  // Add a final guard clause to ensure 'event' is not null/undefined from this point on.
  if (!event) return null;

  const renderRegistrationButton = () => {
    if (!user) {
      return (
        <Link href="/signin" className="w-full text-center bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
          Log in to Register
        </Link>
      );
    }
 if (user.id === event.host.id) {
      return (
        <p className="text-center font-semibold text-gray-600 bg-gray-200 py-2 px-4 rounded">
          You are the host of this event.
        </p>
      );
    }
    
    if (event.isRegistered) {
      return (
        <button
          disabled
          className="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded"
        >
          You are already registered
        </button>
      );
    }

    const buttonText = event.price > 0 
      ? `Pay to Register ($${event.price.toFixed(2)})` 
      : 'Register for Free';

    return (
      <button
        onClick={() => registrationMutation.mutate()}
        disabled={registrationMutation.isPending}
        className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        {registrationMutation.isPending ? 'Processing...' : buttonText}
      </button>
    );
  };
  

  

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
        <p className="text-lg text-gray-600 mb-6">{event.description}</p>
        <div className="space-y-3 text-gray-800 mb-8">
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
          <p><strong>Price:</strong> ${event.price.toFixed(2)}</p>
          <p><strong>Capacity:</strong> {event.capacity} attendees</p>
        </div>
        
        <div className="mt-6">
          {renderRegistrationButton()}
        </div>


        {/* 2. Conditionally render the ChatRoom if the user is registered */}
        {event.isRegistered && <ChatRoom eventId={eventId} />}
      </div>
    </div>
  );
}


