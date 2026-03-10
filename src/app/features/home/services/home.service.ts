import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { groupDetailsModel } from '../models/home.model';
import { Observable, of } from 'rxjs';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiUrl = 'api/data'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  // Reference point as "current location": 21.2300, 81.4500 (Raipur area)
  // Groups are spread from 100m to 5km from this point
  // Events are within 200m of their group location
  samitiGroups: groupDetailsModel[] = [
    {
      "id": 1,
      "groupId": "ANM_1",
      "name": "Azad Navyuvak Mandal",
      "locationCords": { "lat": 21.2310, "long": 81.4508 },  // ~150m from user
      "since": 2018,
      "description": "Azad Navyuvak Mandal is a vibrant youth organization based in Raipur, Chhattisgarh. Founded in 2018, the group has quickly become a hub for young people passionate about community service, cultural activities, and social change. With a focus on empowering youth and fostering a sense of unity, Azad Navyuvak Mandal organizes a wide range of events throughout the year, including festivals, charity drives, educational workshops, and sports tournaments. The group is known for its inclusive and energetic approach, attracting members from diverse backgrounds who share a common goal of making a positive impact in their community.",
      "contactNumbers": ["9876543210", "9123456780"],
      "logo": "https://picsum.photos/seed/anm-logo/200/200",
      "admins": [],
      "events": [
        {
          // "from_time": "00:00",
          // "to_time": "24:00",
          "id": 101,
          "title": "Ganesh Utsav 2026",
          "year_count": 5,
          "start_date": "2026-02-01",
          "end_date": "2026-02-11",
          "currentStatus": "live",
          "locationCords": { "lat": 21.2312, "long": 81.4510 },  // ~180m from group
          "images": [
            "https://picsum.photos/seed/ganesh-utsav/800/500",
            "https://picsum.photos/seed/ganesh-utsav-2/800/500"
          ],
          "description": "Celebrate the vibrant festival of Ganesh Utsav with us! Join us for 10 days of cultural performances, community feasts, and spiritual activities as we honor Lord Ganesha. The event will feature traditional music and dance, delicious food stalls, and a grand procession on the final day. Don't miss this opportunity to experience the rich cultural heritage of Raipur and connect with fellow community members in a joyous celebration!"
        },
        {
          // "from_time": "00:00",
          // "to_time": "24:00",
          "id": 102,
          "title": "Blood Donation Camp",
          "year_count": 2,
          "start_date": "2026-03-10",
          "end_date": "2026-03-15",
          "currentStatus": "live",
          "locationCords": { "lat": 21.2308, "long": 81.4506 },  // ~120m from group
          "images": [
            "https://picsum.photos/seed/blood-donation/800/500",
            "https://picsum.photos/seed/blood-donation-2/800/500"
          ],
          "description": "Save lives by donating blood! Our community blood donation camp provides a safe and hygienic environment for blood donors. Every donation can save up to three lives. Medical professionals will conduct health checks, and all donors will receive refreshments and certificates of appreciation. Join us in this noble cause!"
        },
        {
          // "from_time": "00:00",
          // "to_time": "24:00",
          "id": 103,
          "title": "Cricket League",
          "year_count": 10,
          "start_date": "2026-11-01",
          "end_date": "2026-11-12",
          "currentStatus": "live",
          "locationCords": { "lat": 21.2311, "long": 81.4512 },  // ~150m from group
          "images": [
            "https://picsum.photos/seed/cricket-league/800/500",
            "https://picsum.photos/seed/cricket-league-2/800/500"
          ],
          "description": "Experience thrilling cricket action in our annual league tournament! Teams from across the city will compete in this exciting 12-day event featuring matches, skill demonstrations, and awards for outstanding performances. Whether you're a player or a spectator, this is the ultimate cricket celebration!"
        }
      ]
    },
    {
      "id": 2,
      "groupId": "ESB_2",
      "name": "Ekta Samiti Bhilai",
      "locationCords": { "lat": 21.2345, "long": 81.4520 },  // ~550m from user
      "since": 2010,
      "description": "Ekta Samiti Bhilai promotes community harmony and organizes cultural events that bring people together in celebration and solidarity.",
      "contactNumbers": ["9876123456", "9123456781"],
      "logo": "https://picsum.photos/seed/esb-logo/200/200",
      "admins": [],
      "events": [
        {
          // "from_time": "00:00",
          // "to_time": "24:00",
          "id": 201,
          "title": "Durga Puja 2025",
          "year_count": 51,
          "start_date": "2026-01-10",
          "end_date": "2026-01-20",
          "currentStatus": "",
          "locationCords": { "lat": 21.2347, "long": 81.4522 },  // ~160m from group
          "images": [
            "https://picsum.photos/seed/durga-puja/800/500",
            "https://picsum.photos/seed/durga-puja-2/800/500"
          ],
          "description": "Join us for the most revered festival celebration! This 51-year-old tradition brings together thousands of devotees for cultural performances, traditional feasts, and spiritual ceremonies to honor Goddess Durga. Experience intricate decorations, elaborate pujas, and community bonding at its finest!"
        },
        {
          // "from_time": "00:00",
          // "to_time": "24:00",
          "id": 202,
          "title": "Garba Night",
          "year_count": 5,
          "start_date": "2025-12-15",
          "end_date": "2025-12-25",
          "currentStatus": "",
          "locationCords": { "lat": 21.2343, "long": 81.4518 },  // ~140m from group
          "images": [
            "https://picsum.photos/seed/garba-night/800/500",
            "https://picsum.photos/seed/garba-night-2/800/500"
          ],
          "description": "Dance into the festive season with our vibrant Garba Night! This traditional circular dance celebrates the joy of togetherness. Come dressed in colorful attire to participate in group dances, enjoy music, and connect with the community in a fun and energetic atmosphere!"
        }
      ]
    },
    {
      "id": 3,
      "groupId": "NSM_3",
      "name": "Navjivan Samaj Mandal",
      "locationCords": { "lat": 21.2420, "long": 81.4580 },  // ~1.5km from user
      "since": 2015,
      "description": "Navjivan Samaj Mandal works towards social welfare and youth empowerment through various educational and cultural programs.",
      "contactNumbers": ["9876543211", "9123456782"],
      "logo": "https://picsum.photos/seed/nsm-logo/200/200",
      "admins": [],
      "events": [
        {
          // "from_time": "00:00",
          // "to_time": "24:00",
          "id": 301,
          "title": "Holi Celebration",
          "year_count": 8,
          "start_date": "2026-03-20",
          "end_date": "2026-03-21",
          "currentStatus": "",
          "locationCords": { "lat": 21.2422, "long": 81.4578 },  // ~180m from group
          "images": [
            "https://picsum.photos/seed/holi/800/500",
            "https://picsum.photos/seed/holi-2/800/500"
          ],
          "description": "Celebrate the festival of colors with our grand Holi event! Join us for music, dance, and colorful fun as we welcome spring with joy and enthusiasm."
        },
        {
          // "from_time": "00:00",
          // "to_time": "24:00",
          "id": 302,
          "title": "Youth Sports Meet",
          "year_count": 3,
          "start_date": "2026-04-10",
          "end_date": "2026-04-15",
          "currentStatus": "",
          "locationCords": { "lat": 21.2418, "long": 81.4582 },  // ~150m from group
          "images": [
            "https://picsum.photos/seed/sports/800/500",
            "https://picsum.photos/seed/sports-2/800/500"
          ],
          "description": "Annual sports meet featuring various competitions including cricket, volleyball, badminton, and athletics for youth from across the city."
        }
      ]
    },
    {
      "id": 4,
      "groupId": "RSYC_4",
      "name": "Rising Star Youth Club",
      "locationCords": { "lat": 21.2510, "long": 81.4620 },  // ~2.8km from user
      "since": 2021,
      "description": "Rising Star Youth Club nurtures young talent through sports, education, and personality development programs.",
      "contactNumbers": ["9876456789", "9123456784"],
      "logo": "https://picsum.photos/seed/rsyc-logo/200/200",
      "admins": [],
      "events": [
        {
          // "from_time": "00:00",
          // "to_time": "24:00",
          "id": 401,
          "title": "Dance Competition",
          "year_count": 4,
          "start_date": "2026-05-15",
          "end_date": "2026-05-25",
          "currentStatus": "",
          "locationCords": { "lat": 21.2512, "long": 81.4618 },  // ~170m from group
          "images": [
            "https://picsum.photos/seed/dance-competition/800/500",
            "https://picsum.photos/seed/dance-competition-2/800/500"
          ],
          "description": "Showcase your dance talent in our inter-city dance competition featuring various styles from classical to contemporary!"
        }
      ]
    },
    {
      "id": 5,
      "groupId": "USM_5",
      "name": "Unity Seva Mandal",
      "locationCords": { "lat": 21.2640, "long": 81.4710 },  // ~4.5km from user
      "since": 2012,
      "description": "Unity Seva Mandal is dedicated to community service, organizing health camps, educational programs, and social welfare activities.",
      "contactNumbers": ["9876789012", "9123456785"],
      "logo": "https://picsum.photos/seed/usm-logo/200/200",
      "admins": [],
      "events": [
        {
          // "from_time": "00:00",
          // "to_time": "24:00",

          "id": 501,
          "title": "Free Health Camp",
          "year_count": 11,
          "start_date": "2026-06-01",
          "end_date": "2026-06-05",
          "currentStatus": "",
          "locationCords": { "lat": 21.2638, "long": 81.4708 },  // ~140m from group
          "images": [
            "https://picsum.photos/seed/health-camp/800/500",
            "https://picsum.photos/seed/health-camp-2/800/500"
          ],
          "description": "Free health checkup camp providing medical consultations, blood tests, and health awareness sessions for the community."
        },
        {
          // "from_time": "00:00",
          // "to_time": "24:00",
          "id": 502,
          "title": "Educational Workshop",
          "year_count": 6,
          "start_date": "2026-07-10",
          "end_date": "2026-07-12",
          "currentStatus": "",
          "locationCords": { "lat": 21.2642, "long": 81.4712 },  // ~160m from group
          "images": [
            "https://picsum.photos/seed/workshop/800/500",
            "https://picsum.photos/seed/workshop-2/800/500"
          ],
          "description": "Educational workshop for students covering career guidance, personality development, and skill enhancement programs."
        }
      ]
    },
    {
      "id": 10,
      "groupId": "VNC_10",
      "name": "Very Nearby Club",
      "locationCords": { "lat": 21.2301, "long": 81.4501 },  // ~120m from user (very close)
      "since": 2025,
      "description": "A community club located very close to you, perfect for quick meetups and local events.",
      "contactNumbers": ["9000000000"],
      "logo": "https://picsum.photos/seed/nearby-test/200/200",
      "admins": [],
      "events": [
        {
          // "from_time": "00:00",
          // "to_time": "24:00",
          "id": 1001,
          "title": "Weekend Meetup",
          "year_count": 1,
          "start_date": "2026-02-20",
          "end_date": "2026-02-21",
          "currentStatus": "live",
          "locationCords": { "lat": 21.2301, "long": 81.4501 },  // Same as group location
          "images": ["https://picsum.photos/seed/test-event/800/500"],
          "description": "Casual weekend meetup for community members to connect, share ideas, and plan future activities together."
        }
      ]
    }
  ];

  searchTerm = signal<string>('');
  selectedDistance = signal<number>(1); // Default distance in kilometers

  getGroupsAndEvents(): Observable<groupDetailsModel[]> {
    // return this.http.get<any>(this.apiUrl);
    return new Observable(observer => {
      observer.next(this.samitiGroups);
      observer.complete();
    });
  }
}
