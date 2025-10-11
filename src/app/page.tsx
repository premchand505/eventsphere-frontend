'use client';

import apiClient from '@/lib/api/axios';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link'; // 1. Import the Link component

// ... (Event type and fetchEvents function remain the same) ...
type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
};
const fetchEvents = async (): Promise<Event[]> => {
  const { data } = await apiClient.get('/events');
  return data;
};


export default function Home() {
  const {
    data: events,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  // ... (main, h1, and loading/error states remain the same) ...
  return (
    <main className="container mx-auto bg-black p-8">
      <h1 className="text-4xl text-transparent font-bold mb-8 bg-clip-text bg-gradient-to-r from-violet-600 to-white text-center">Upcoming Events</h1>
      
      {isLoading && <p className="text-center">Loading events...</p>}
      {isError && <p className="text-center text-red-500">Failed to load events.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
  {events?.map((event) => (
    <Link href={`/events/${event.id}`} key={event.id}>
      <div className="border rounded-lg p-6 shadow-lg bg-gradient-to-r from-purple-700 to-purple-400 h-full hover:shadow-xl hover:scale-105 transition-shadow duration-300">
        <h2 className="text-2xl text-white font-semibold mb-2">{event.title}</h2>
        <p className="text-black mb-4">{event.description}</p>
        <div className="text-sm ">
          <p className='text-black'><strong>Location:</strong> {event.location}</p>
          <p className='text-black'><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        </div>
      </div>
    </Link>
  ))}
</div>

    </main>
  );
}