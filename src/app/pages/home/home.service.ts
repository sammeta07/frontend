import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiUrl = 'api/data'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  samitiGroups = [
    {
      id: 1,
      name: 'Azad Navyuvak Mandal',
      location: 'Raipur, CG',
      since: 2018,
      totalEvents: 3,
      events: [
        { id: 101, title: 'Ganesh Utsav 2026', year_count: 5, start_date: '2026-02-01', end_date: '2026-02-11', location: 'Raipur Main Ground' },
        { id: 102, title: 'Blood Donation Camp', year_count: 2, start_date: '2026-03-10', end_date: '2026-03-15', location: 'City Hospital' },
        { id: 103, title: 'Cricket League', year_count: 10, start_date: '2026-11-01', end_date: '2026-11-12', location: 'Sports Stadium' }
      ]
    },
    {
      id: 2,
      name: 'Ekta Samiti Bhilai',
      location: 'Bhilai, CG',
      since: 2010,
      totalEvents: 4,
      events: [
        { id: 201, title: 'Durga Puja 2025', year_count: 51, start_date: '2026-01-10', end_date: '2026-01-20', location: 'Sector 6 Park' },
        { id: 202, title: 'Garba Night', year_count: 5, start_date: '2025-12-15', end_date: '2025-12-25', location: 'Community Hall' },
        { id: 203, title: 'Diwali Mela', year_count: 8, start_date: '2026-11-05', end_date: '2026-11-15', location: 'Civic Center' },
        { id: 204, title: 'Winter Charity Drive', year_count: 12, start_date: '2026-01-28', end_date: '2026-02-08', location: 'Station Road' }
      ]
    },
    {
      id: 3,
      name: 'Shiv Shakti Sewa Mandal',
      location: 'Durg, CG',
      since: 2005,
      totalEvents: 5,
      events: [
        { id: 301, title: 'Maha Shivratri Bhandara', year_count: 15, start_date: '2026-01-30', end_date: '2026-02-10', location: 'Shiv Mandir' },
        { id: 302, title: 'Yoga Workshop', year_count: 3, start_date: '2026-04-01', end_date: '2026-04-12', location: 'Yoga Center' },
        { id: 303, title: 'Satsang Series', year_count: 7, start_date: '2026-01-20', end_date: '2026-02-04', location: 'Satsang Bhawan' },
        { id: 304, title: 'Temple Renovation', year_count: 4, start_date: '2026-06-01', end_date: '2026-06-10', location: 'Old Temple' },
        { id: 305, title: 'Free Medical Checkup', year_count: 6, start_date: '2026-01-29', end_date: '2026-02-09', location: 'Health Clinic' }
      ]
    },
    {
      id: 4,
      name: 'Pragati Welfare Group',
      location: 'Bilaspur, CG',
      since: 2019,
      totalEvents: 3,
      events: [
        { id: 401, title: 'Street Play (Nukkad)', year_count: 2, start_date: '2026-01-27', end_date: '2026-02-06', location: 'Main Market' },
        { id: 402, title: 'Clean City Campaign', year_count: 5, start_date: '2026-01-25', end_date: '2026-02-08', location: 'City Squares' },
        { id: 403, title: 'Plantation Drive', year_count: 9, start_date: '2026-07-01', end_date: '2026-07-15', location: 'River Bank' }
      ]
    },
    {
      id: 5,
      name: 'Rising Star Youth Club',
      location: 'Raigarh, CG',
      since: 2021,
      totalEvents: 4,
      events: [
        { id: 501, title: 'Dance Competition', year_count: 4, start_date: '2026-05-15', end_date: '2026-05-25', location: 'Town Hall' },
        { id: 502, title: 'Summer Coaching', year_count: 8, start_date: '2026-01-22', end_date: '2026-02-05', location: 'School Ground' },
        { id: 503, title: 'Football Tournament', year_count: 6, start_date: '2026-01-24', end_date: '2026-02-07', location: 'Sports Complex' },
        { id: 504, title: 'Cyber Security Seminar', year_count: 1, start_date: '2026-08-05', end_date: '2026-08-10', location: 'College Auditorium' }
      ]
    },
    {
      id: 6,
      name: 'Maitri Pariwar',
      location: 'Korba, CG',
      since: 1995,
      totalEvents: 6,
      events: [
        { id: 601, title: 'Holi Milan', year_count: 20, start_date: '2026-01-05', end_date: '2026-01-15', location: 'Club House' },
        { id: 602, title: 'Tree Adoption', year_count: 3, start_date: '2026-01-26', end_date: '2026-02-06', location: 'City Parks' },
        { id: 603, title: 'Old Age Home Visit', year_count: 7, start_date: '2026-01-28', end_date: '2026-02-07', location: 'Old Age Home' },
        { id: 604, title: 'Digital Literacy Camp', year_count: 2, start_date: '2026-09-01', end_date: '2026-09-12', location: 'Community Center' },
        { id: 605, title: 'Handicraft Exhibition', year_count: 5, start_date: '2026-10-02', end_date: '2026-10-10', location: 'Exhibition Ground' },
        { id: 606, title: 'Food Donation', year_count: 12, start_date: '2026-01-20', end_date: '2026-02-04', location: 'Slum Area' }
      ]
    },
    {
      id: 7,
      name: 'Sanskriti Kala Manch',
      location: 'Jagdalpur, CG',
      since: 2008,
      totalEvents: 3,
      events: [
        { id: 701, title: 'Tribal Art Fest', year_count: 25, start_date: '2026-01-29', end_date: '2026-02-09', location: 'Art Gallery' },
        { id: 702, title: 'Photography Contest', year_count: 4, start_date: '2026-08-19', end_date: '2026-08-30', location: 'Online' },
        { id: 703, title: 'Local Music Night', year_count: 6, start_date: '2026-11-14', end_date: '2026-11-20', location: 'Music Hall' }
      ]
    },
    {
      id: 8,
      name: 'Umeed Foundation',
      location: 'Ambikapur, CG',
      since: 2012,
      totalEvents: 4,
      events: [
        { id: 801, title: 'Scholarship Exam', year_count: 10, start_date: '2026-01-30', end_date: '2026-02-12', location: 'School Exam Hall' },
        { id: 802, title: 'Winter Clothes Drive', year_count: 15, start_date: '2026-01-25', end_date: '2026-02-08', location: 'City Square' },
        { id: 803, title: 'Library Setup', year_count: 2, start_date: '2026-06-01', end_date: '2026-06-15', location: 'Village Library' },
        { id: 804, title: 'Skill Training', year_count: 3, start_date: '2026-09-05', end_date: '2026-09-18', location: 'Training Center' }
      ]
    },
    {
      id: 9,
      name: 'Adarsh Gram Samiti',
      location: 'Dhamtari, CG',
      since: 2016,
      totalEvents: 5,
      events: [
        { id: 901, title: 'Agri-Tech Seminar', year_count: 4, start_date: '2026-02-01', end_date: '2026-02-06', location: 'Panchayat Bhawan' },
        { id: 902, title: 'Pond Cleaning', year_count: 8, start_date: '2026-01-28', end_date: '2026-02-05', location: 'Village Pond' },
        { id: 903, title: 'Village Sports Day', year_count: 12, start_date: '2026-04-14', end_date: '2026-04-24', location: 'School Ground' },
        { id: 904, title: 'Sanitation Awareness', year_count: 5, start_date: '2026-01-02', end_date: '2026-01-10', location: 'Village Streets' },
        { id: 905, title: 'Cattle Health Camp', year_count: 3, start_date: '2026-05-20', end_date: '2026-05-30', location: 'Veterinary Hospital' }
      ]
    },
    {
      id: 10,
      name: 'Nav Nirman Group',
      location: 'Rajnandgaon, CG',
      since: 2022,
      totalEvents: 3,
      events: [
        { id: 1001, title: 'Entrepreneurship Meet', year_count: 2, start_date: '2026-01-31', end_date: '2026-02-10', location: 'Hotel Grand' },
        { id: 1002, title: 'Career Counselling', year_count: 4, start_date: '2026-05-01', end_date: '2026-05-08', location: 'School Auditorium' },
        { id: 1003, title: 'Youth Icon Awards', year_count: 1, start_date: '2026-08-12', end_date: '2026-08-20', location: 'Town Hall' }
      ]
    },
    {
      id: 11,
      name: 'Jan Kalyan Trust',
      location: 'Mahasamund, CG',
      since: 2000,
      totalEvents: 7,
      events: [
        { id: 1101, title: 'Eye Surgery Camp', year_count: 22, start_date: '2026-02-01', end_date: '2026-02-15', location: 'District Hospital' },
        { id: 1102, title: 'Women Empowerment Talk', year_count: 5, start_date: '2026-01-28', end_date: '2026-02-05', location: 'Community Hall' },
        { id: 1103, title: 'Cycle Marathon', year_count: 3, start_date: '2026-06-05', end_date: '2026-06-12', location: 'Main Road' },
        { id: 1104, title: 'Legal Aid Workshop', year_count: 2, start_date: '2026-07-15', end_date: '2026-07-22', location: 'Law College' },
        { id: 1105, title: 'Organic Farming Intro', year_count: 4, start_date: '2026-01-25', end_date: '2026-02-04', location: 'Farm House' },
        { id: 1106, title: 'Blood Group Testing', year_count: 8, start_date: '2026-01-30', end_date: '2026-02-08', location: 'Red Cross' },
        { id: 1107, title: 'Evening School Support', year_count: 10, start_date: '2026-01-20', end_date: '2026-02-04', location: 'Local School' }
      ]
    }
  ];

  getGroupsAndEvents(): Observable<any> {
    // return this.http.get<any>(this.apiUrl);
    return new Observable(observer => {
      observer.next(this.samitiGroups);
      observer.complete();
    });
  }
}
