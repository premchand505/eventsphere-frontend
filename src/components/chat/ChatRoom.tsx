'use client';

import { useAuthStore } from '@/stores/authStore';
import { useSocketStore } from '@/stores/socketStore';
import { useEffect, useRef, useState } from 'react';

// Define the shape of a chat message
type Message = {
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
};

export default function ChatRoom({ eventId }: { eventId: string }) {
  const { socket } = useSocketStore();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Effect for listening to incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('newMessage', handleNewMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket]);

  // Effect for auto-scrolling to the latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!socket || newMessage.trim() === '') return;

    socket.emit('sendMessage', { eventId, message: newMessage });
    setNewMessage(''); // Clear the input field
  };

  return (
    <div className="mt-8 border rounded-lg shadow-inner">
      <h3 className="text-xl font-semibold p-4 border-b rounded-lg bg-gray-50">Event Chat</h3>
      {/* Message Display Area */}
      <div className="p-4 h-80 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.userId === user?.id ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md ${
                msg.userId === user?.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="text-xs font-bold">{msg.userName}</p>
              <p>{msg.message}</p>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      {/* Message Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow text-white input-style"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}