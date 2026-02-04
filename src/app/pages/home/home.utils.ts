export function calculateStatus(startDate: string, endDate: string): string {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) {
        return 'upcoming';
    } else if (today >= start && today <= end) {
        return 'started';
    } else {
        return 'completed';
    }
}

export function enrichGroupData(groups: any[]) {
    const firstNames = ['Ramesh', 'Suresh', 'Mahesh', 'Dinesh', 'Vikram', 'Rahul', 'Amit', 'Priya', 'Neha', 'Anil', 'Sanjay', 'Viay', 'Rajesh'];
    const lastNames = ['Kumar', 'Patel', 'Verma', 'Singh', 'Yadav', 'Sharma', 'Gupta', 'Das', 'Mishra', 'Tiwari'];
    
    const getName = () => `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;

    groups.forEach((group: any) => {
      group.totalMembers = Math.floor(Math.random() * 50) + 15;
      group.president = getName();
      group.vicePresident = getName();
      group.treasurer = getName();
      
      if (group.events) {
          group.events.forEach((event: any) => {
             event.status = calculateStatus(event.start_date, event.end_date);
          });
      }
      
      // Generate unique members list
      const members = new Set<string>();
      while(members.size < group.totalMembers) {
        members.add(getName());
      }
      group.members = Array.from(members);
    });
}

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

export function sortEvents(groups: any[]) {
    const priority: { [key: string]: number } = { 'completed': 1, 'started': 2, 'upcoming': 3 };
    groups.forEach((group: any) => {
      group.events.sort((a: { status: string | number; }, b: { status: string | number; }) => (priority[a.status] || 99) - (priority[b.status] || 99));
    });
}
