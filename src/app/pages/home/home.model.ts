export interface eventDetailsModel {
  id: number;
  title: string;
  start_date: string; // or Date
  end_date: string;   // or Date
  status?: 'started' | 'upcoming' | 'completed';
  location: string;
  year_count: number;
}

export interface groupDetailsModel {
  id: number;
  name: string;
  location: string;
  since: number;
  events: eventDetailsModel[];
}

