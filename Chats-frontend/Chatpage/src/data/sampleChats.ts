export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  avatar: string;
  unreadCount: number;
  isOnline: boolean;
}

export type RemoveAction = 'unmatch' | 'unmatch_and_report' | 'delete';

export const sampleChats: Chat[] = [
  {
    id: '1',
    name: 'Sandesh Jayawickre',
    lastMessage: 'Hey, how are you?',
    timestamp: new Date(),
    avatar: 'https://i.imgur.com/uwYRurU.jpeg',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '2',
    name: 'Curtly J',
    lastMessage: 'The meeting is at 3 PM',
    timestamp: new Date(),
    avatar: 'https://i.imgur.com/klZtxWV.jpeg',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '3',
    name: 'Elia Perera',
    lastMessage: 'Hey, how are you?',
    timestamp: new Date(),
    avatar: 'https://i.imgur.com/ta6vTop.jpeg',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '4',
    name: 'Zoe',
    lastMessage: 'The meeting is at 3 PM',
    timestamp: new Date(),
    avatar: 'https://via.placeholder.com/40',
    unreadCount: 0,
    isOnline: true
  },
  {
    id: '5',
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    timestamp: new Date(),
    avatar: '/images/modella-photos.png',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '6',
    name: 'Jane Smith',
    lastMessage: 'The meeting is at 3 PM',
    timestamp: new Date(),
    avatar: 'https://via.placeholder.com/40',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '7',
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    timestamp: new Date(),
    avatar: 'https://via.placeholder.com/40',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '8',
    name: 'Jane Smith',
    lastMessage: 'The meeting is at 3 PM',
    timestamp: new Date(),
    avatar: 'https://via.placeholder.com/40',
    unreadCount: 7,
    isOnline: false
  },
  {
    id: '9',
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    timestamp: new Date(),
    avatar: 'https://via.placeholder.com/40',
    unreadCount: 6,
    isOnline: true
  },
  {
    id: '10',
    name: 'Jane Smith',
    lastMessage: 'The meeting is at 3 PM',
    timestamp: new Date(),
    avatar: 'https://via.placeholder.com/40',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '11',
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    timestamp: new Date(),
    avatar: 'https://via.placeholder.com/40',
    unreadCount: 5,
    isOnline: true
  },
  {
    id: '13',
    name: 'Jane Smith',
    lastMessage: 'The meeting is at 3 PM',
    timestamp: new Date(),
    avatar: 'https://via.placeholder.com/40',
    unreadCount: 0,
    isOnline: false
  }
]; 