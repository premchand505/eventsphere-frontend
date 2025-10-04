'use client';

import apiClient from '@/lib/api/axios';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link'; // 1. Import Link from next/link

// ... (Event type and fetchEvents function remain the same) ...
type Event = {
  id: string;
  title: string;
  description:string;
  location: string;
  date: string;
};
const fetchEvents = async (): Promise<Event[]> => {
  const { data } = await apiClient.get('/events');
  return data;
};


export default function Home() {
  const { data: events, isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });
  
  // ... (main, h1, and loading/error JSX remain the same) ...
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Upcoming Events</h1>
      
      {isLoading && <p className="text-center">Loading events...</p>}
      {isError && <p className="text-center text-red-500">Failed to load events.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => (
          // 2. Wrap the event card with a Link component
          <Link href={`/events/${event.id}`} key={event.id}>
            <div className="border rounded-lg p-6 shadow-lg bg-white h-full hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="text-sm text-gray-800">
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {!isLoading && events?.length === 0 && (
         <p className="text-center text-gray-500">No events found. Be the first to create one!</p>
      )}
    </main>
  );
}