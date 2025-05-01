import { NextResponse } from 'next/server';
import { getGoogleCalendarEvents } from '../../../app/lib/calendarActions';

export async function GET() {
  try {
    const events = await getGoogleCalendarEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Calendar API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    );
  }
} 