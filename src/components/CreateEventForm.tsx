'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api/axios';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';

// ... (Zod schema remains the same)
const createEventSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description is too short' }),
  location: z.string().min(3, { message: 'Location is required' }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'A valid date is required',
  }),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: 'Price must be a non-negative number',
  }),
  capacity: z.string().refine((val) => /^\d+$/.test(val) && parseInt(val, 10) >= 1, {
    message: 'Capacity must be a whole number of at least 1',
  }),
});

type CreateEventFormValues = z.infer<typeof createEventSchema>;


export default function CreateEventForm() {
  const router = useRouter();
  const { token } = useAuthStore();

  // ... (useEffect and useForm hooks remain the same)
  useEffect(() => {
    if (!token) {
      router.push('/signin');
      toast.error('You must be logged in to create an event.');
    }
  }, [token, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
  });

  const onSubmit = async (data: CreateEventFormValues) => {
    try {
      // THE FIX IS HERE 👇
      const payload = {
        ...data,
        // Convert the local datetime string to a full ISO string (with UTC timezone)
        date: new Date(data.date).toISOString(),
        price: parseFloat(data.price),
        capacity: parseInt(data.capacity, 10),
      };

      await apiClient.post('/events', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Event created successfully!');
      router.push('/');
    } catch (error) {
      toast.error('Failed to create event. Please try again.');
      console.error(error);
    }
  };
  
  // ... (The form JSX remains exactly the same)
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium">Title</label>
        <input id="title" type="text" {...register('title')} className="mt-1 block w-full input-style" />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <textarea id="description" {...register('description')} className="mt-1 block w-full input-style" />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      {/* Location Field */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium">Location</label>
        <input id="location" type="text" {...register('location')} className="mt-1 block w-full input-style" />
        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
      </div>
      
      {/* Date Field */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium">Date and Time</label>
        <input id="date" type="datetime-local" {...register('date')} className="mt-1 block w-full input-style" />
        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
      </div>
      
      {/* Price & Capacity Fields (side-by-side) */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="price" className="block text-sm font-medium">Price ($)</label>
          <input id="price" type="number" step="0.01" {...register('price')} className="mt-1 block w-full input-style" />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
        </div>
        <div className="flex-1">
          <label htmlFor="capacity" className="block text-sm font-medium">Capacity</label>
          <input id="capacity" type="number" {...register('capacity')} className="mt-1 block w-full input-style" />
          {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Creating Event...' : 'Create Event'}
      </button>
    </form>
  );
}