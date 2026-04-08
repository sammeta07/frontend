export interface LocationModel {
  lat: number;
  long: number;
}

export interface StateModel {
  id: number;
  name: string;
  abbreviation: string;
  stateId: number;
}

export interface DistrictModel {
  id: number;
  name: string;
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
  locationCords: LocationModel;
  locationName?: string; // Optional human-readable location name
  distanceFromUser?: string;
  
}

export interface ProgramDetailWithContextModel extends ProgramDetailModel {
  eventTitle: string;
  groupTitle: string;
  year_count: number;
}

export interface EventDetailsModel {
  id: number;
  title: string;
  type: EventType;
  start_date: string; // or Date
  end_date: string;   // or Date
  locationCords: LocationModel;
  year_count: number;
  description: string;
  photos: string[];
  programs: ProgramDetailModel[];
  status?: 'started' | 'upcoming' | 'completed'; // Optional, can be calculated
  locationName?: string; // Optional human-readable location name
  distanceFromUser?: string; // Optional property to store distance from user's location
}

export interface GroupAdminModel {
  email: string;
  password: string; // Optional for display, required for creation
  confirmPassword: string;
  contactNumber: string;
}

export interface GroupDetailsModel {
  id: number;
  groupId: string; // Combination of first letters of group name words and id
  title: string;
  locationCords: LocationModel;
  area: string;
  since: number;
  admins: GroupAdminModel[];
  events: EventDetailsModel[];
  description: string;
  contactNumbers: string[];
  logo: string; // Optional logo URL
  favourite: boolean;
  locationName?: string; // Optional human-readable location name
  distanceFromUser?: string; // Optional property to store distance from user's location
}

export enum ProgramType {
  BHANDARA = 'BHANDARA',      // Community meal / Food distribution / Prasad
  CULTURAL = 'CULTURAL',      // Music, Dance, Cultural performances / Nachna Gana
  SPIRITUAL = 'SPIRITUAL',     // Religious ceremonies / Aarati, Hawan, Visarjan
  CRICKET = 'CRICKET',      // Cricket matches / Tournaments
  OTHER = 'OTHER'
}

export enum EventType {
  SPORTS = 'SPORTS', // Cricket, Football, Volleyball, etc.
  PUJA = 'PUJA', // sarasvati puja, ganesh chaturthi, durga puja, etc.
  RELIGIOUS = 'RELIGIOUS', // Processions, Hawan, Aarati, Visarjan, etc.
  CULTURAL = 'CULTURAL', // Music, Dance, Cultural performances / Nachna Gana
  FESTIVAL = 'FESTIVAL', // Holi
  OTHER = 'OTHER'
}