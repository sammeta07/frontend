export interface LocationModel {
  lat: number;
  long: number;
}

export interface NearbyGroupsRequestBody {
  locationCords: LocationModel;
  radiusInKm: number;
}

export interface StateModel {
  id: number;
  name: string;
  stateId: number;
}

export interface DistrictModel {
  id: number;
  name: string;
  districtId: number;
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

export interface CreateSamitiModel {
  name: string;
  area: string;
  description?: string;
  since: number;
  stateId: number | null;
  districtId: number | null;
  locationCords: LocationModel | null;
  groupContactNumbers: string[];
  admins: Pick<GroupAdminModel, 'email' | 'contactNumber' | 'password'>[];
}

export interface GroupDetailsModel {
  id: number;
  groupId: string; // Combination of first letters of group name words and id
  title: string; // name
  since: number;
  description: string;
  area: string;
  // district_id: number;
  // state_id: number;
  locationCords: LocationModel; //json { lat: number, long: number }
  contactNumbers: string[]; //json array of strings
  admins: GroupAdminModel[]; ////json array of objects with email, password, contactNumber
  // created_at: string; //timestamp

  events: EventDetailsModel[];
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

// --- API Response Types (snake_case from backend) ---

export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T;
}

export interface ApiProgramDetail {
  id: number;
  event_id: number;
  title: string;
  type: string;
  description: string;
  date: string;
  from_time: string;
  to_time: string;
  location_cords: LocationModel;
  photos: string[];
  created_at: string;
}

export interface ApiEventDetail {
  id: number;
  group_id: number;
  title: string;
  type: string;
  year_count: number;
  start_date: string;
  end_date: string;
  description: string;
  location_cords: LocationModel;
  photos: string[];
  programs: ApiProgramDetail[];
  created_at: string;
}

export interface ApiGroupDetail {
  id: number;
  group_id: string;
  name: string;
  since: number;
  description: string;
  area: string;
  district_id: number;
  state_id: number;
  location_cords: LocationModel;
  contact_numbers: string[];
  logo: string;
  admins: GroupAdminModel[];
  created_at: string;
  distance: number;
  events: ApiEventDetail[];
}