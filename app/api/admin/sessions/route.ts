import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

type Session = { 
  id: string; 
  device: string; 
  lastActive: string; 
}

interface SessionsMap {
  [userId: string]: Session[];
}

// Mock data for sessions for the demo
const mockSessions: SessionsMap = {
  '1': [
    { id: 's1', device: 'Chrome em Windows', lastActive: '2023-06-15T14:30:00Z' }
  ],
  '2': [
    { id: 's2', device: 'Firefox em MacOS', lastActive: '2023-06-15T10:15:00Z' },
    { id: 's3', device: 'Safari em iPhone', lastActive: '2023-06-14T18:45:00Z' }
  ],
  '3': [
    { id: 's4', device: 'Edge em Windows', lastActive: '2023-06-15T09:20:00Z' }
  ]
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  schools: string[];
}

// Mock data for users
const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    role: 'teacher',
    schools: ['Escola A', 'Escola B']
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@example.com',
    role: 'student',
    schools: ['Escola A']
  },
  {
    id: '3',
    name: 'Carlos Pereira',
    email: 'carlos@example.com',
    role: 'admin',
    schools: ['Escola A', 'Escola C']
  }
];

async function verifyAdmin() {
  const cookieStore = await cookies();
  const userSession = cookieStore.get('user_session');
  
  if (!userSession) {
    return false;
  }
  
  try {
    const user = JSON.parse(userSession.value);
    return user.role === 'admin';
  } catch (error) {
    return false;
  }
}

export async function GET() {
  const isAdmin = await verifyAdmin();
  
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  const usersWithSessions = mockUsers.map(user => ({
    ...user,
    sessions: mockSessions[user.id] || []
  }));
  
  return NextResponse.json({ users: usersWithSessions });
}

// Terminate a specific session
export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdmin();
  
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  try {
    const data = await request.json();
    const { userId, sessionId, terminateAll = false } = data;
    
    // Validate input
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    if (!terminateAll && !sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }
    
    // Check if user exists
    if (!mockSessions[userId]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: terminateAll 
        ? `All sessions for user ${userId} terminated` 
        : `Session ${sessionId} for user ${userId} terminated` 
    });
    
  } catch (error) {
    console.error('Error terminating session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}