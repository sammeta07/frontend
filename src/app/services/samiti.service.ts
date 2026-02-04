import { Injectable } from '@angular/core';
import { SamitiGroup, SamitiEvent } from '../models/samiti.model';

@Injectable({
  providedIn: 'root'
})
export class SamitiService {
  
  private allSamitiGroups: SamitiGroup[] = [
    {
      name: 'Azad Navyuvak Mandal',
      location: 'Raipur, CG',
      since: 2018,
      events: {
        2026: [
          { id: 101, title: 'Ganesh Utsav 2026', year_count: 5, start_date: '2026-02-01', end_date: '2026-02-11' },
          { id: 102, title: 'Blood Donation Camp', year_count: 2, start_date: '2026-03-10', end_date: '2026-03-15' },
          { id: 103, title: 'Cricket League', year_count: 10, start_date: '2026-11-01', end_date: '2026-11-12' },
          { id: 104, title: 'Republic Day Celebration', year_count: 8, start_date: '2026-01-26', end_date: '2026-01-26' }
        ],
        2027: [
          { id: 105, title: 'New Year 2027 Bash', year_count: 6, start_date: '2027-01-01', end_date: '2027-01-01' }
        ],
        2023: [
          { id: 106, title: 'Old Event 2023', year_count: 2, start_date: '2023-05-01', end_date: '2023-05-05' }
        ]
      }
    },
    {
      name: 'Ekta Samiti Bhilai',
      location: 'Bhilai, CG',
      since: 2010,
      events: {
        2025: [
          { id: 201, title: 'Durga Puja 2025', year_count: 51, start_date: '2025-10-10', end_date: '2025-10-20' },
          { id: 202, title: 'Garba Night', year_count: 5, start_date: '2025-12-15', end_date: '2025-12-25' }
        ],
        2026: [
          { id: 203, title: 'Diwali Mela', year_count: 8, start_date: '2026-11-05', end_date: '2026-11-15' },
          { id: 204, title: 'Winter Charity Drive', year_count: 12, start_date: '2026-01-28', end_date: '2026-02-08' },
          { id: 205, title: 'New Year Picnic', year_count: 3, start_date: '2026-01-01', end_date: '2026-01-02' }
        ],
        2027: [
          { id: 206, title: 'Holi 2027', year_count: 15, start_date: '2027-03-22', end_date: '2027-03-23' }
        ],
        2023: [
            { id: 299, title: 'Event 2023', year_count: 1, start_date: '2023-11-01', end_date: '2023-11-05' }
        ]
      }
    },
    {
      name: 'Shiv Shakti Sewa Mandal',
      location: 'Durg, CG',
      since: 2005,
      events: {
        2026: [
          { id: 301, title: 'Maha Shivratri Bhandara', year_count: 15, start_date: '2026-01-30', end_date: '2026-02-10' },
          { id: 302, title: 'Yoga Workshop', year_count: 3, start_date: '2026-04-01', end_date: '2026-04-12' },
          { id: 303, title: 'Satsang Series', year_count: 7, start_date: '2026-01-20', end_date: '2026-02-04' },
          { id: 304, title: 'Temple Renovation', year_count: 4, start_date: '2026-06-01', end_date: '2026-06-10' },
          { id: 305, title: 'Free Medical Checkup', year_count: 6, start_date: '2026-01-29', end_date: '2026-02-09' },
          { id: 306, title: 'Makar Sankranti Kite Fest', year_count: 10, start_date: '2026-01-14', end_date: '2026-01-15' }
        ],
        2025: [
          { id: 399, title: 'Old Event 2025', year_count: 5, start_date: '2025-06-01', end_date: '2025-06-05' }
        ],
        2027: [
            { id: 307, title: 'Summer Camp 2027', year_count: 4, start_date: '2027-05-15', end_date: '2027-05-30' }
        ]
      }
    },
    {
      name: 'Pragati Welfare Group',
      location: 'Bilaspur, CG',
      since: 2019,
      events: {
        2026: [
          { id: 401, title: 'Street Play (Nukkad)', year_count: 2, start_date: '2026-01-27', end_date: '2026-02-06' },
          { id: 402, title: 'Clean City Campaign', year_count: 5, start_date: '2026-01-25', end_date: '2026-02-08' },
          { id: 403, title: 'Plantation Drive', year_count: 9, start_date: '2026-07-01', end_date: '2026-07-15' },
          { id: 404, title: 'Youth Day Rally', year_count: 5, start_date: '2026-01-12', end_date: '2026-01-12' }
        ]
      }
    },
    {
      name: 'Rising Star Youth Club',
      location: 'Raigarh, CG',
      since: 2021,
      events: {
        2026: [
          { id: 501, title: 'Dance Competition', year_count: 4, start_date: '2026-05-15', end_date: '2026-05-25' },
          { id: 502, title: 'Summer Coaching', year_count: 8, start_date: '2026-01-22', end_date: '2026-02-05' },
          { id: 503, title: 'Football Tournament', year_count: 6, start_date: '2026-01-24', end_date: '2026-02-07' },
          { id: 504, title: 'Cyber Security Seminar', year_count: 1, start_date: '2026-08-05', end_date: '2026-08-10' },
          { id: 505, title: 'Republic Day Sports', year_count: 2, start_date: '2026-01-26', end_date: '2026-01-28' }
        ]
      }
    },
    {
      name: 'Maitri Pariwar',
      location: 'Korba, CG',
      since: 1995,
      events: {
        2026: [
          { id: 601, title: 'Holi Milan', year_count: 20, start_date: '2026-01-05', end_date: '2026-01-15' },
          { id: 602, title: 'Tree Adoption', year_count: 3, start_date: '2026-01-26', end_date: '2026-02-06' },
          { id: 603, title: 'Old Age Home Visit', year_count: 7, start_date: '2026-01-28', end_date: '2026-02-07' },
          { id: 604, title: 'Digital Literacy Camp', year_count: 2, start_date: '2026-09-01', end_date: '2026-09-12' },
          { id: 605, title: 'Handicraft Exhibition', year_count: 5, start_date: '2026-10-02', end_date: '2026-10-10' },
          { id: 606, title: 'Food Donation', year_count: 12, start_date: '2026-01-20', end_date: '2026-02-04' },
          { id: 607, title: 'Winter Blanket Distribution', year_count: 4, start_date: '2026-01-10', end_date: '2026-01-20' }
        ]
      }
    },
    {
      name: 'Sanskriti Kala Manch',
      location: 'Jagdalpur, CG',
      since: 2008,
      events: {
        2026: [
          { id: 701, title: 'Tribal Art Fest', year_count: 25, start_date: '2026-01-29', end_date: '2026-02-09' },
          { id: 702, title: 'Photography Contest', year_count: 4, start_date: '2026-08-19', end_date: '2026-08-30' },
          { id: 703, title: 'Local Music Night', year_count: 6, start_date: '2026-11-14', end_date: '2026-11-20' },
          { id: 704, title: 'Folk Dance Workshop', year_count: 6, start_date: '2026-01-15', end_date: '2026-01-18' }
        ]
      }
    },
    {
      name: 'Umeed Foundation',
      location: 'Ambikapur, CG',
      since: 2012,
      events: {
        2026: [
          { id: 801, title: 'Scholarship Exam', year_count: 10, start_date: '2026-01-30', end_date: '2026-02-12' },
          { id: 802, title: 'Winter Clothes Drive', year_count: 15, start_date: '2026-01-25', end_date: '2026-02-08' },
          { id: 803, title: 'Library Setup', year_count: 2, start_date: '2026-06-01', end_date: '2026-06-15' },
          { id: 804, title: 'Skill Training', year_count: 3, start_date: '2026-09-05', end_date: '2026-09-18' },
          { id: 805, title: 'Road Safety Awareness', year_count: 2, start_date: '2026-01-11', end_date: '2026-01-17' }
        ]
      }
    },
    {
      name: 'Adarsh Gram Samiti',
      location: 'Dhamtari, CG',
      since: 2016,
      events: {
        2026: [
          { id: 901, title: 'Agri-Tech Seminar', year_count: 4, start_date: '2026-02-01', end_date: '2026-02-06' },
          { id: 902, title: 'Pond Cleaning', year_count: 8, start_date: '2026-01-28', end_date: '2026-02-05' },
          { id: 903, title: 'Village Sports Day', year_count: 12, start_date: '2026-04-14', end_date: '2026-04-24' },
          { id: 904, title: 'Sanitation Awareness', year_count: 5, start_date: '2026-01-02', end_date: '2026-01-10' },
          { id: 905, title: 'Cattle Health Camp', year_count: 3, start_date: '2026-05-20', end_date: '2026-05-30' },
          { id: 906, title: 'Farmer Training', year_count: 3, start_date: '2026-01-05', end_date: '2026-01-08' }
        ]
      }
    },
    {
      name: 'Nav Nirman Group',
      location: 'Rajnandgaon, CG',
      since: 2022,
      events: {
        2026: [
          { id: 1001, title: 'Entrepreneurship Meet', year_count: 2, start_date: '2026-01-31', end_date: '2026-02-10' },
          { id: 1002, title: 'Career Counselling', year_count: 4, start_date: '2026-05-01', end_date: '2026-05-08' },
          { id: 1003, title: 'Youth Icon Awards', year_count: 1, start_date: '2026-08-12', end_date: '2026-08-20' },
          { id: 1004, title: 'Startup Ideas Meet', year_count: 1, start_date: '2026-01-20', end_date: '2026-01-21' }
        ]
      }
    },
    {
      name: 'Jan Kalyan Trust',
      location: 'Mahasamund, CG',
      since: 2000,
      events: {
        2026: [
          { id: 1101, title: 'Eye Surgery Camp', year_count: 22, start_date: '2026-02-01', end_date: '2026-02-15' },
          { id: 1102, title: 'Women Empowerment Talk', year_count: 5, start_date: '2026-01-28', end_date: '2026-02-05' },
          { id: 1103, title: 'Cycle Marathon', year_count: 3, start_date: '2026-06-05', end_date: '2026-06-12' },
          { id: 1104, title: 'Legal Aid Workshop', year_count: 2, start_date: '2026-07-15', end_date: '2026-07-22' },
          { id: 1105, title: 'Organic Farming Intro', year_count: 4, start_date: '2026-01-25', end_date: '2026-02-04' },
          { id: 1106, title: 'Blood Group Testing', year_count: 8, start_date: '2026-01-30', end_date: '2026-02-08' },
          { id: 1107, title: 'Evening School Support', year_count: 10, start_date: '2026-01-20', end_date: '2026-02-04' },
          { id: 1108, title: 'Health Camp', year_count: 9, start_date: '2026-01-05', end_date: '2026-01-07' }
        ]
      }
    }
  ];

  constructor() {
    this.enrichMockData();
  }

  getGroupsForYear(year: number): (SamitiGroup & { events: SamitiEvent[] })[] {
    return this.allSamitiGroups
      .filter(group => group.since <= year)
      .map(group => {
        const rawEvents = group.events[year] || [];
        const processedEvents = rawEvents.map(event => ({
          ...event,
          status: this.calculateStatus(event.start_date, event.end_date)
        })).sort((a, b) => this.getPriority(a.status!) - this.getPriority(b.status!));

        return {
          ...group,
          events: processedEvents
        } as unknown as SamitiGroup & { events: SamitiEvent[] };
      });
  }

  private calculateStatus(startDate: string, endDate: string): 'upcoming' | 'started' | 'completed' {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now > end) {
      return 'completed';
    } else if (now >= start) {
      return 'started';
    }
    return 'upcoming';
  }

  private getPriority(status: string): number {
    const p: { [key: string]: number } = { 'completed': 3, 'started': 1, 'upcoming': 2 };
    return p[status] || 99;
  }

  private enrichMockData() {
    const firstNames = ['Ramesh', 'Suresh', 'Mahesh', 'Dinesh', 'Vikram', 'Rahul', 'Amit', 'Priya', 'Neha', 'Anil', 'Sanjay', 'Viay', 'Rajesh'];
    const lastNames = ['Kumar', 'Patel', 'Verma', 'Singh', 'Yadav', 'Sharma', 'Gupta', 'Das', 'Mishra', 'Tiwari'];
    
    const getName = () => `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;

    this.allSamitiGroups.forEach(group => {
      group.totalMembers = Math.floor(Math.random() * 50) + 15;
      group.president = getName();
      group.vicePresident = getName();
      group.treasurer = getName();
      
      const members = new Set<string>();
      while(members.size < group.totalMembers) {
        members.add(getName());
      }
      group.members = Array.from(members);
    });
  }
}
