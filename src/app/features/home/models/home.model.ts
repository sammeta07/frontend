export interface LocationModel {
  lat: number;
  long: number;
}

export interface ProgramDetailModel {
  id: number;
  title: string;
  type: ProgramType;
  date: string;
  from_time: string;
  to_time: string;
  photos: string[];
  description: string;
  distanceFromUser?: string;
}

export interface eventDetailsModel {
  id: number;
  title: string;
  type: EventType;
  start_date: string; // or Date
  end_date: string;   // or Date
  status?: 'started' | 'upcoming' | 'completed'; // Optional, can be calculated
  locationCords: LocationModel;
  locationName?: string; // Optional human-readable location name
  year_count: number;
  description: string;
  photos: string[];
  programs: ProgramDetailModel[];
  distanceFromUser?: string; // Optional property to store distance from user's location
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
  title: string;
  locationCords: LocationModel;
  locationName?: string; // Optional human-readable location name
  since: number;
  admins: GroupAdminModel[];
  events: eventDetailsModel[];
  description: string;
  contactNumbers: string[];
  logo: string; // Optional logo URL
  distanceFromUser?: string; // Optional property to store distance from user's location
}

export enum ProgramType {
  BHANDARA = 'BHANDARA',      // Community meal / Food distribution / Prasad
  CULTURAL = 'CULTURAL',      // Music, Dance, Cultural performances / Nachna Gana
  SPIRITUAL = 'SPIRITUAL',     // Religious ceremonies / Aarati, Hawan, Visarjan
  OTHER = 'OTHER'
}

export enum EventType {
  SPORTS = 'SPORTS',
  PUJA = 'PUJA',
  FESTIVAL = 'FESTIVAL',
  OTHER = 'OTHER'
}

