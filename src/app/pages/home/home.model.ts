export interface eventDetailsModel {
  id: number;
  title: string;
  start_date: string; // or Date
  end_date: string;   // or Date
  status?: 'started' | 'upcoming' | 'completed'; // Optional, can be calculated
  location: string;
  year_count: number;
  description: string;
}

export interface GroupAdmin {
  email: string;
  password: string; // Optional for display, required for creation
  confirmPassword: string;
  contactNumber: string;
}

export interface groupDetailsModel {
  id: number;
  name: string;
  location: string;
  since: number;
  admins: GroupAdmin[];
  events: eventDetailsModel[];
  description: string;
  contactNumbers: string[];
}

