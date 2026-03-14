import { GroupDetailsModel, EventDetailsModel } from '../models/home.model';

export const programTypeSortOrder: Record<string, number> = {
  BHANDARA: 1,
  CRICKET: 2,
  SPIRITUAL: 3,
  CULTURAL: 4,
  OTHER: 5,
};

export function getGroupLogoUrl(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
}

export function getYearLabel(year: number): string {
    if (!year) return '';
    const j = year % 10,
        k = year % 100;
    if (j == 1 && k != 11) {
        return year + "st Year";
    }
    if (j == 2 && k != 12) {
        return year + "nd Year";
    }
    if (j == 3 && k != 13) {
        return year + "rd Year";
    }
    return year + "th Year";
}

export function sortEventsByStatus(groups: GroupDetailsModel[]) {
    groups.forEach((group: GroupDetailsModel) => {
      if (group.events) {
          group.events.forEach((event: EventDetailsModel) => {
             const today = new Date();
             const start = new Date(event.start_date);
             const end = new Date(event.end_date);
         
             if (today < start) {
                 event.status = 'upcoming';
             } else if (today >= start && today <= end) {
                 event.status = 'started';
             } else {
                 event.status = 'completed';
             }
          });
      }
    });
}

export function sortGroupsByDistance(groups: GroupDetailsModel[]) {
    const toMeters = (value?: string): number => {
        if (!value) return Number.POSITIVE_INFINITY;

        const raw = value.trim().toLowerCase();
        const parsed = Number.parseFloat(raw.replace(/[^0-9.-]/g, ''));
        if (!Number.isFinite(parsed)) return Number.POSITIVE_INFINITY;

        if (raw.includes('km')) return parsed * 1000; // km -> m
        if (raw.includes('m')) return parsed;         // already meters

        // fallback if unit missing
        return parsed;
    };

    groups.sort((a: GroupDetailsModel, b: GroupDetailsModel) => {
        const distA = toMeters(a.distanceFromUser);
        const distB = toMeters(b.distanceFromUser);
        return distA - distB; // nearest first
    });
}

export function sortProgramsByDistance (groups: GroupDetailsModel[]) {
    const toMeters = (value?: string): number => {
        if (!value) return Number.POSITIVE_INFINITY;

        const raw = value.trim().toLowerCase();
        const parsed = Number.parseFloat(raw.replace(/[^0-9.-]/g, ''));
        if (!Number.isFinite(parsed)) return Number.POSITIVE_INFINITY;

        if (raw.includes('km')) return parsed * 1000; // km -> m
        if (raw.includes('m')) return parsed;         // already meters

        // fallback if unit missing
        return parsed;
    };

    groups.forEach((group: GroupDetailsModel) => {
        if (!group.events) return;

        group.events.forEach((event: EventDetailsModel) => {
            if (!event.programs) return;

            event.programs.sort((a, b) => {
                const distA = toMeters(a.distanceFromUser);
                const distB = toMeters(b.distanceFromUser);
                return distA - distB; // nearest first
            });
        });
    });
}
