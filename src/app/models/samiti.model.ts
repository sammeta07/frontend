export interface SamitiEvent {
    id: number;
    title: string;
    year_count?: number; // e.g., "5th Year"
    start_date: string;
    end_date: string;
    status?: 'upcoming' | 'started' | 'completed'; // Dynamic status
}

export interface SamitiGroup {
    name: string;
    location: string;
    since: number;
    // events keys are years (e.g. 2026, 2025)
    events: { [year: number]: SamitiEvent[] };
    
    // Enriched properties
    totalMembers?: number;
    president?: string;
    vicePresident?: string;
    treasurer?: string;
    members?: string[];
}
