import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips'; // Status badges ke liye
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EventDetailsDialogComponent } from '../../components/event-details-dialog/event-details-dialog.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIcon
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private dialog = inject(MatDialog);

  constructor() {
    this.sortEvents();
  }

  getGroupLogoUrl(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
  }

  getYearLabel(year: number): string {
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

  private sortEvents() {
    const priority: { [key: string]: number } = { 'inProgress': 1, 'upcoming': 2, 'completed': 3 };
    this.samitiGroups.forEach(group => {
      group.events.sort((a, b) => (priority[a.status] || 99) - (priority[b.status] || 99));
    });
  }

  samitiGroups = [
    {
      name: 'Azad Navyuvak Mandal',
      location: 'Raipur, CG',
      totalEvents: 3,
      events: [
        { id: 101, title: 'Ganesh Utsav 2026', status: 'inProgress', year_count: 5, start_date: '2026-09-15', end_date: '2026-09-25' },
        { id: 102, title: 'Blood Donation Camp', status: 'upcoming', year_count: 2, start_date: '2026-03-10', end_date: '2026-03-10' },
        { id: 103, title: 'Cricket League', status: 'upcoming', year_count: 10, start_date: '2026-11-01', end_date: '2026-11-15' }
      ]
    },
    {
      name: 'Ekta Samiti Bhilai',
      location: 'Bhilai, CG',
      totalEvents: 4,
      events: [
        { id: 201, title: 'Durga Puja 2025', status: 'completed', year_count: 51, start_date: '2025-10-01', end_date: '2025-10-10' },
        { id: 202, title: 'Garba Night', status: 'completed', year_count: 5, start_date: '2025-09-28', end_date: '2025-09-30' },
        { id: 203, title: 'Diwali Mela', status: 'upcoming', year_count: 8, start_date: '2025-11-05', end_date: '2025-11-07' },
        { id: 204, title: 'Winter Charity Drive', status: 'inProgress', year_count: 12, start_date: '2025-12-15', end_date: '2026-01-15' }
      ]
    },
    {
      name: 'Shiv Shakti Sewa Mandal',
      location: 'Durg, CG',
      totalEvents: 5,
      events: [
        { id: 301, title: 'Maha Shivratri Bhandara', status: 'inProgress', year_count: 15, start_date: '2026-02-18', end_date: '2026-02-18' },
        { id: 302, title: 'Yoga Workshop', status: 'upcoming', year_count: 3, start_date: '2026-04-01', end_date: '2026-04-07' },
        { id: 303, title: 'Satsang Series', status: 'inProgress', year_count: 7, start_date: '2026-01-01', end_date: '2026-12-31' },
        { id: 304, title: 'Temple Renovation', status: 'upcoming', year_count: 4, start_date: '2026-06-01', end_date: '2026-12-01' },
        { id: 305, title: 'Free Medical Checkup', status: 'inProgress', year_count: 6, start_date: '2026-03-20', end_date: '2026-03-20' }
      ]
    },
    {
      name: 'Pragati Welfare Group',
      location: 'Bilaspur, CG',
      totalEvents: 3,
      events: [
        { id: 401, title: 'Street Play (Nukkad)', status: 'inProgress', year_count: 2, start_date: '2026-03-05', end_date: '2026-03-05' },
        { id: 402, title: 'Clean City Campaign', status: 'inProgress', year_count: 5, start_date: '2026-01-10', end_date: '2026-06-10' },
        { id: 403, title: 'Plantation Drive', status: 'upcoming', year_count: 9, start_date: '2026-07-01', end_date: '2026-07-31' }
      ]
    },
    {
      name: 'Rising Star Youth Club',
      location: 'Raigarh, CG',
      totalEvents: 4,
      events: [
        { id: 501, title: 'Dance Competition', status: 'upcoming', year_count: 4, start_date: '2026-05-15', end_date: '2026-05-16' },
        { id: 502, title: 'Summer Coaching', status: 'inProgress', year_count: 8, start_date: '2026-05-01', end_date: '2026-06-30' },
        { id: 503, title: 'Football Tournament', status: 'inProgress', year_count: 6, start_date: '2026-04-10', end_date: '2026-04-20' },
        { id: 504, title: 'Cyber Security Seminar', status: 'upcoming', year_count: 1, start_date: '2026-08-05', end_date: '2026-08-05' }
      ]
    },
    {
      name: 'Maitri Pariwar',
      location: 'Korba, CG',
      totalEvents: 6,
      events: [
        { id: 601, title: 'Holi Milan', status: 'completed', year_count: 20, start_date: '2025-03-25', end_date: '2025-03-25' },
        { id: 602, title: 'Tree Adoption', status: 'inProgress', year_count: 3, start_date: '2025-07-01', end_date: '2026-07-01' },
        { id: 603, title: 'Old Age Home Visit', status: 'inProgress', year_count: 7, start_date: '2026-02-10', end_date: '2026-02-10' },
        { id: 604, title: 'Digital Literacy Camp', status: 'upcoming', year_count: 2, start_date: '2026-09-01', end_date: '2026-09-15' },
        { id: 605, title: 'Handicraft Exhibition', status: 'upcoming', year_count: 5, start_date: '2026-10-02', end_date: '2026-10-05' },
        { id: 606, title: 'Food Donation', status: 'inProgress', year_count: 12, start_date: '2026-01-01', end_date: '2026-12-31' }
      ]
    },
    {
      name: 'Sanskriti Kala Manch',
      location: 'Jagdalpur, CG',
      totalEvents: 3,
      events: [
        { id: 701, title: 'Tribal Art Fest', status: 'inProgress', year_count: 25, start_date: '2026-02-20', end_date: '2026-02-25' },
        { id: 702, title: 'Photography Contest', status: 'upcoming', year_count: 4, start_date: '2026-08-19', end_date: '2026-08-30' },
        { id: 703, title: 'Local Music Night', status: 'upcoming', year_count: 6, start_date: '2026-11-14', end_date: '2026-11-14' }
      ]
    },
    {
      name: 'Umeed Foundation',
      location: 'Ambikapur, CG',
      totalEvents: 4,
      events: [
        { id: 801, title: 'Scholarship Exam', status: 'inProgress', year_count: 10, start_date: '2026-01-15', end_date: '2026-03-15' },
        { id: 802, title: 'Winter Clothes Drive', status: 'inProgress', year_count: 15, start_date: '2025-11-01', end_date: '2026-02-01' },
        { id: 803, title: 'Library Setup', status: 'upcoming', year_count: 2, start_date: '2026-06-01', end_date: '2026-12-31' },
        { id: 804, title: 'Skill Training', status: 'upcoming', year_count: 3, start_date: '2026-09-05', end_date: '2026-10-05' }
      ]
    },
    {
      name: 'Adarsh Gram Samiti',
      location: 'Dhamtari, CG',
      totalEvents: 5,
      events: [
        { id: 901, title: 'Agri-Tech Seminar', status: 'inProgress', year_count: 4, start_date: '2026-02-01', end_date: '2026-02-02' },
        { id: 902, title: 'Pond Cleaning', status: 'inProgress', year_count: 8, start_date: '2026-03-01', end_date: '2026-03-05' },
        { id: 903, title: 'Village Sports Day', status: 'upcoming', year_count: 12, start_date: '2026-04-14', end_date: '2026-04-14' },
        { id: 904, title: 'Sanitation Awareness', status: 'completed', year_count: 5, start_date: '2025-10-02', end_date: '2025-10-02' },
        { id: 905, title: 'Cattle Health Camp', status: 'upcoming', year_count: 3, start_date: '2026-05-20', end_date: '2026-05-21' }
      ]
    },
    {
      name: 'Nav Nirman Group',
      location: 'Rajnandgaon, CG',
      totalEvents: 3,
      events: [
        { id: 1001, title: 'Entrepreneurship Meet', status: 'inProgress', year_count: 2, start_date: '2026-03-15', end_date: '2026-03-15' },
        { id: 1002, title: 'Career Counselling', status: 'upcoming', year_count: 4, start_date: '2026-05-01', end_date: '2026-05-01' },
        { id: 1003, title: 'Youth Icon Awards', status: 'upcoming', year_count: 1, start_date: '2026-08-12', end_date: '2026-08-12' }
      ]
    },
    {
      name: 'Jan Kalyan Trust',
      location: 'Mahasamund, CG',
      totalEvents: 7,
      events: [
        { id: 1101, title: 'Eye Surgery Camp', status: 'inProgress', year_count: 22, start_date: '2026-02-10', end_date: '2026-02-15' },
        { id: 1102, title: 'Women Empowerment Talk', status: 'inProgress', year_count: 5, start_date: '2026-03-08', end_date: '2026-03-08' },
        { id: 1103, title: 'Cycle Marathon', status: 'upcoming', year_count: 3, start_date: '2026-06-05', end_date: '2026-06-05' },
        { id: 1104, title: 'Legal Aid Workshop', status: 'upcoming', year_count: 2, start_date: '2026-07-15', end_date: '2026-07-16' },
        { id: 1105, title: 'Organic Farming Intro', status: 'inProgress', year_count: 4, start_date: '2026-04-22', end_date: '2026-04-22' },
        { id: 1106, title: 'Blood Group Testing', status: 'inProgress', year_count: 8, start_date: '2026-05-10', end_date: '2026-05-10' },
        { id: 1107, title: 'Evening School Support', status: 'inProgress', year_count: 10, start_date: '2026-01-01', end_date: '2026-12-31' }
      ]
    }
  ];
  onCreateSamiti() {

  }

  openEventDetails(event: any) {
    this.dialog.open(EventDetailsDialogComponent, {
      width: '600px',
      data: event,
      autoFocus: false // Prevent auto-focusing the first button for better UX
    });
  }
}
