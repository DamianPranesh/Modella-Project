import React, { useEffect, useState, useRef } from 'react';
import { Send, Smile } from 'lucide-react';
import { io } from 'socket.io-client';
import { ChatMessage } from './components/ChatMessage.tsx';
import { supabase } from './lib/supabase.ts';

interface Message {
  id: string;
  message: string;
  sender: string;
  created_at: string;
}

const socket = io('http://localhost:3000');

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!username) {
      setUsername(`User${Math.floor(Math.random() * 10000)}`);
    }

    // Load existing messages from Supabase
    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error loading messages:', error);
          return;
        }

        if (data) {
          setMessages(data.map(msg => ({
            ...msg,
            id: msg.id.toString()
          })));
          scrollToBottom();
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages' 
      }, payload => {
        const newMessage = payload.new as Message;
        setMessages(current => [...current, {
          ...newMessage,
          id: newMessage.id.toString()
        }]);
        scrollToBottom();
      })
      .subscribe();

    // Listen for Socket.IO messages
    socket.on('message', (message: Message) => {
      setMessages(current => [...current, message]);
      scrollToBottom();
    });

    return () => {
      socket.off('message');
      subscription.unsubscribe();
    };
  }, [username]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      message: newMessage,
      sender: username,
      created_at: new Date().toISOString()
    };

    try {
      // Save to Supabase
      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select()
        .single();

      if (error) {
        console.error('Error saving message:', error);
        return;
      }

      // Emit through Socket.IO for real-time updates
      if (data) {
        socket.emit('message', {
          ...data,
          id: data.id.toString()
        });
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#2d2d2d] rounded-lg shadow-xl overflow-hidden">
        <div className="p-4 bg-[#333333] text-white border-b border-[#444444]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[rgb(221,133,96)] flex items-center justify-center text-white">
                {username[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-lg font-semibold">{username}</h1>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-300">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 bg-[#1e1e1e]">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg.message}
                sender={msg.sender}
                created_at={msg.created_at}
                isCurrentUser={msg.sender === username}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-[#2d2d2d] border-t border-[#444444]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-gray-400 hover:text-[rgb(221,133,96)] transition-colors"
              >
                <Smile size={24} />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#1e1e1e] text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(221,133,96)] border border-[#444444]"
              />
              <button
                type="submit"
                className="bg-[rgb(221,133,96)] text-white rounded-full p-2 hover:bg-[rgb(201,113,76)] transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;