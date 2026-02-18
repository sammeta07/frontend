export interface LocationModel {
  lat: number;
  long: number;
}

export interface eventDetailsModel {
  id: number;
  title: string;
  start_date: string; // or Date
  end_date: string;   // or Date
  status?: 'started' | 'upcoming' | 'completed'; // Optional, can be calculated
  location: LocationModel;
  locationName?: string; // Optional human-readable location name
  year_count: number;
  description: string;
  images: string[];
}

export interface GroupAdminModel {
  email: string;
  password: string; // Optional for display, required for creation
  confirmPassword: string;
  contactNumber: string;
}

export interface groupDetailsModel {
  id: number;
  groupId: string; // Combination of first letters of group name words and id
  name: string;
  location: LocationModel;
  locationName?: string; // Optional human-readable location name
  since: number;
  admins: GroupAdminModel[];
  events: eventDetailsModel[];
  description: string;
  contactNumbers: string[];
  logo?: string; // Optional logo URL
}

