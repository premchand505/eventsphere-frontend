import CreateEventForm from '@/components/CreateEventForm';

export default function CreateEventPage() {
  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Event</h1>
      <CreateEventForm />
    </div>
  );
}