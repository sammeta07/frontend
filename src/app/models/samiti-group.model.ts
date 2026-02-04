export interface SamitiEvent {
  title: string;
  start_date: string; // or Date
  end_date: string;   // or Date
  status: 'started' | 'upcoming' | 'completed';
  location?: string;
  year_count?: number;
}

export interface SamitiGroup {
  name: string;
  location: string;
  since: number;
  totalEvents: number;
  events: SamitiEvent[];
}
