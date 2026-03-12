import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventType, ProgramType, groupDetailsModel } from '../models/home.model';
import { Observable } from 'rxjs';
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
      "title": "Azad Navyuvak Mandal",
      "locationCords": { "lat": 21.2310, "long": 81.4508 },  // ~150m from user
      "since": 2018,
      "description": "Azad Navyuvak Mandal is a vibrant youth organization based in Raipur, Chhattisgarh. Founded in 2018, the group has quickly become a hub for young people passionate about community service, cultural activities, and social change. With a focus on empowering youth and fostering a sense of unity, Azad Navyuvak Mandal organizes a wide range of events throughout the year, including festivals, charity drives, educational workshops, and sports tournaments. The group is known for its inclusive and energetic approach, attracting members from diverse backgrounds who share a common goal of making a positive impact in their community.",
      "contactNumbers": ["9876543210", "9123456780"],
      "logo": "https://picsum.photos/seed/anm-logo/200/200",
      "admins": [],
      "events": [
        {
          "id": 101,
          "title": "Ganesh Utsav 2026",
          "type" : EventType.SPORTS,
          "year_count": 5,
          "start_date": "2026-02-01",
          "end_date": "2026-02-11",
          "locationCords": { "lat": 21.2312, "long": 81.4510 },  // ~180m from group
          "photos": [
            "https://picsum.photos/seed/ganesh-utsav/800/500",
            "https://picsum.photos/seed/ganesh-utsav-2/800/500"
          ],
          "programs": [
            { "id": 101001,'description' : "abcd", "title": "Prabhat Aarati", "type": ProgramType.SPIRITUAL, "date": "2026-02-01", "from_time": "06:00", "to_time": "07:00", "photos": ["https://picsum.photos/seed/program-101001-1/800/500", "https://picsum.photos/seed/program-101001-2/800/500"] },
            { "id": 101002, 'description' : "abcd", "title": "Sthapana Hawan", "type": ProgramType.SPIRITUAL, "date": "2026-02-01", "from_time": "09:00", "to_time": "10:30", "photos": ["https://picsum.photos/seed/program-101002-1/800/500", "https://picsum.photos/seed/program-101002-2/800/500"] },
            { "id": 101003, 'description' : "abcd", "title": "Bal Sanskar Sabha", "type": ProgramType.BHANDARA, "date": "2026-02-03", "from_time": "16:00", "to_time": "17:00", "photos": ["https://picsum.photos/seed/program-101003-1/800/500", "https://picsum.photos/seed/program-101003-2/800/500"] },
            { "id": 101004, 'description' : "abcd", "title": "Mahila Bhajan Sandhya", "type": ProgramType.CULTURAL, "date": "2026-02-08", "from_time": "18:30", "to_time": "20:00", "photos": ["https://picsum.photos/seed/program-101004-1/800/500", "https://picsum.photos/seed/program-101004-2/800/500"] },
            { "id": 101005, 'description' : "abcd", "title": "Mahaprasad Vitran", "type": ProgramType.BHANDARA, "date": "2026-02-08", "from_time": "20:15", "to_time": "21:30", "photos": ["https://picsum.photos/seed/program-101005-1/800/500", "https://picsum.photos/seed/program-101005-2/800/500"] },
            { "id": 101006, 'description' : "abcd", "title": "Ganesh Visarjan Yatra", "type": ProgramType.SPIRITUAL, "date": "2026-02-11", "from_time": "17:30", "to_time": "20:30", "photos": ["https://picsum.photos/seed/program-101006-1/800/500", "https://picsum.photos/seed/program-101006-2/800/500"] }
          ],
          "description": "Celebrate the vibrant festival of Ganesh Utsav with us! Join us for 10 days of cultural performances, community feasts, and spiritual activities as we honor Lord Ganesha. The event will feature traditional music and dance, delicious food stalls, and a grand procession on the final day. Don't miss this opportunity to experience the rich cultural heritage of Raipur and connect with fellow community members in a joyous celebration!"
        },
        {
          "id": 102,
          "title": "Blood Donation Camp",
          "type" : EventType.OTHER,
          "year_count": 2,
          "start_date": "2026-03-12",
          "end_date": "2026-03-14",
          "locationCords": { "lat": 21.2308, "long": 81.4506 },  // ~120m from group
          "photos": [
            "https://picsum.photos/seed/blood-donation/800/500",
            "https://picsum.photos/seed/blood-donation-2/800/500"
          ],
          "programs": [
            { "id": 102001, 'description' : "abcd", "title": "Shubh Aarambh Aarati", "type": ProgramType.SPIRITUAL, "date": "2026-03-12", "from_time": "08:00", "to_time": "08:30", "photos": ["https://picsum.photos/seed/program-102001-1/800/500", "https://picsum.photos/seed/program-102001-2/800/500"] },
            { "id": 102002, 'description' : "abcd", "title": "Health Desk", "type": ProgramType.BHANDARA, "date": "2026-03-12", "from_time": "00:00", "to_time": "23:59", "photos": ["https://picsum.photos/seed/program-102002-1/800/500", "https://picsum.photos/seed/program-102002-2/800/500"] },
            { "id": 102003, 'description' : "abcd", "title": "Seva Bhandara", "type": ProgramType.BHANDARA, "date": "2026-03-12", "from_time": "13:00", "to_time": "15:00", "photos": ["https://picsum.photos/seed/program-102003-1/800/500", "https://picsum.photos/seed/program-102003-2/800/500"] },
            { "id": 102004, 'description' : "abcd", "title": "Evening Aarati", "type": ProgramType.SPIRITUAL, "date": "2026-03-13", "from_time": "18:00", "to_time": "18:45", "photos": ["https://picsum.photos/seed/program-102004-1/800/500", "https://picsum.photos/seed/program-102004-2/800/500"] },
            { "id": 102005, 'description' : "abcd", "title": "Samapan Hawan", "type": ProgramType.SPIRITUAL, "date": "2026-03-14", "from_time": "16:00", "to_time": "17:30", "photos": ["https://picsum.photos/seed/program-102005-1/800/500", "https://picsum.photos/seed/program-102005-2/800/500"] }
          ],
          "description": "Save lives by donating blood! Our community blood donation camp provides a safe and hygienic environment for blood donors. Every donation can save up to three lives. Medical professionals will conduct health checks, and all donors will receive refreshments and certificates of appreciation. Join us in this noble cause!"
        },
        {
          "id": 103,
          "title": "Cricket League",
          "type" : EventType.SPORTS,
          "year_count": 10,
          "start_date": "2026-11-01",
          "end_date": "2026-11-12",
          "locationCords": { "lat": 21.2311, "long": 81.4512 },  // ~150m from group
          "photos": [
            "https://picsum.photos/seed/cricket-league/800/500",
            "https://picsum.photos/seed/cricket-league-2/800/500"
          ],
          "programs": [
            { "id": 103001, 'description' : "abcd", "title": "Opening Ceremony", "type": ProgramType.SPIRITUAL, "date": "2026-11-01", "from_time": "09:00", "to_time": "10:00", "photos": ["https://picsum.photos/seed/program-103001-1/800/500", "https://picsum.photos/seed/program-103001-2/800/500"] },
            { "id": 103002, 'description' : "abcd", "title": "Team Pledge Hawan", "type": ProgramType.SPIRITUAL, "date": "2026-11-01", "from_time": "10:30", "to_time": "11:15", "photos": ["https://picsum.photos/seed/program-103002-1/800/500", "https://picsum.photos/seed/program-103002-2/800/500"] },
            { "id": 103003, 'description' : "abcd", "title": "Players Bhandara", "type": ProgramType.BHANDARA, "date": "2026-11-06", "from_time": "14:00", "to_time": "15:30", "photos": ["https://picsum.photos/seed/program-103003-1/800/500", "https://picsum.photos/seed/program-103003-2/800/500"] },
            { "id": 103004, 'description' : "abcd", "title": "Fan Meet Prasad", "type": ProgramType.BHANDARA, "date": "2026-11-10", "from_time": "17:00", "to_time": "18:00", "photos": ["https://picsum.photos/seed/program-103004-1/800/500", "https://picsum.photos/seed/program-103004-2/800/500"] },
            { "id": 103005, 'description' : "abcd", "title": "Final Award Visarjan", "type": ProgramType.SPIRITUAL, "date": "2026-11-12", "from_time": "18:00", "to_time": "20:00", "photos": ["https://picsum.photos/seed/program-103005-1/800/500", "https://picsum.photos/seed/program-103005-2/800/500"] }
          ],
          "description": "Experience thrilling cricket action in our annual league tournament! Teams from across the city will compete in this exciting 12-day event featuring matches, skill demonstrations, and awards for outstanding performances. Whether you're a player or a spectator, this is the ultimate cricket celebration!"
        }
      ]
    },
    {
      "id": 2,
      "groupId": "ESB_2",
      "title": "Ekta Samiti Bhilai",
      "locationCords": { "lat": 21.2345, "long": 81.4520 },  // ~550m from user
      "since": 2010,
      "description": "Ekta Samiti Bhilai promotes community harmony and organizes cultural events that bring people together in celebration and solidarity.",
      "contactNumbers": ["9876123456", "9123456781"],
      "logo": "https://picsum.photos/seed/esb-logo/200/200",
      "admins": [],
      "events": [
        {
          "id": 201,
          "title": "Durga Puja 2025",
          "type" : EventType.PUJA,
          "year_count": 51,
          "start_date": "2026-03-12",
          "end_date": "2026-03-15",
          "locationCords": { "lat": 21.2347, "long": 81.4522 },  // ~160m from group
          "photos": [
            "https://picsum.photos/seed/durga-puja/800/500",
            "https://picsum.photos/seed/durga-puja-2/800/500"
          ],
          "programs": [
            { "id": 201001, 'description' : "abcd", "title": "Kalash Sthapana", "type": ProgramType.SPIRITUAL, "date": "2026-03-12", "from_time": "06:30", "to_time": "08:00", "photos": ["https://picsum.photos/seed/program-201001-1/800/500", "https://picsum.photos/seed/program-201001-2/800/500"] },
            { "id": 201002, 'description' : "abcd", "title": "Kumari Pujan", "type": ProgramType.SPIRITUAL, "date": "2026-03-12", "from_time": "10:00", "to_time": "11:30", "photos": ["https://picsum.photos/seed/program-201002-1/800/500", "https://picsum.photos/seed/program-201002-2/800/500"] },
            { "id": 201003, 'description' : "abcd", "title": "Maha Bhandara", "type": ProgramType.BHANDARA, "date": "2026-03-12", "from_time": "00:00", "to_time": "23:59", "photos": ["https://picsum.photos/seed/program-201003-1/800/500", "https://picsum.photos/seed/program-201003-2/800/500"] },
            { "id": 201004, 'description' : "abcd", "title": "Sandhya Aarati", "type": ProgramType.SPIRITUAL, "date": "2026-03-13", "from_time": "19:00", "to_time": "20:00", "photos": ["https://picsum.photos/seed/program-201004-1/800/500", "https://picsum.photos/seed/program-201004-2/800/500"] },
            { "id": 201005, 'description' : "abcd", "title": "Visarjan Shobha Yatra", "type": ProgramType.SPIRITUAL, "date": "2026-03-15", "from_time": "16:00", "to_time": "20:00", "photos": ["https://picsum.photos/seed/program-201005-1/800/500", "https://picsum.photos/seed/program-201005-2/800/500"] }
          ],
          "description": "Join us for the most revered festival celebration! This 51-year-old tradition brings together thousands of devotees for cultural performances, traditional feasts, and spiritual ceremonies to honor Goddess Durga. Experience intricate decorations, elaborate pujas, and community bonding at its finest!"
        },
        {
          "id": 202,
          "title": "Garba Night",
          "year_count": 5,
          "type": EventType.PUJA,
          "start_date": "2025-12-15",
          "end_date": "2025-12-25",
          "locationCords": { "lat": 21.2343, "long": 81.4518 },  // ~140m from group
          "photos": [
            "https://picsum.photos/seed/garba-night/800/500",
            "https://picsum.photos/seed/garba-night-2/800/500"
          ],
          "programs": [
            { "id": 202001, 'description' : "abcd", "title": "Garba Opening Aarati", "type": ProgramType.SPIRITUAL, "date": "2025-12-15", "from_time": "18:30", "to_time": "19:00", "photos": ["https://picsum.photos/seed/program-202001-1/800/500", "https://picsum.photos/seed/program-202001-2/800/500"] },
            { "id": 202002, 'description' : "abcd", "title": "Dandiya Workshop", "type": ProgramType.CULTURAL, "date": "2025-12-15", "from_time": "19:15", "to_time": "20:15", "photos": ["https://picsum.photos/seed/program-202002-1/800/500", "https://picsum.photos/seed/program-202002-2/800/500"] },
            { "id": 202003, 'description' : "abcd", "title": "Community Prasad Vitran", "type": ProgramType.BHANDARA, "date": "2025-12-20", "from_time": "21:00", "to_time": "22:00", "photos": ["https://picsum.photos/seed/program-202003-1/800/500", "https://picsum.photos/seed/program-202003-2/800/500"] },
            { "id": 202004, 'description' : "abcd", "title": "Youth Garba Round", "type": ProgramType.CULTURAL, "date": "2025-12-22", "from_time": "20:00", "to_time": "21:30", "photos": ["https://picsum.photos/seed/program-202004-1/800/500", "https://picsum.photos/seed/program-202004-2/800/500"] },
            { "id": 202005, 'description' : "abcd", "title": "Grand Finale Bhandara", "type": ProgramType.BHANDARA, "date": "2025-12-25", "from_time": "20:30", "to_time": "22:30", "photos": ["https://picsum.photos/seed/program-202005-1/800/500", "https://picsum.photos/seed/program-202005-2/800/500"] }
          ],
          "description": "Dance into the festive season with our vibrant Garba Night! This traditional circular dance celebrates the joy of togetherness. Come dressed in colorful attire to participate in group dances, enjoy music, and connect with the community in a fun and energetic atmosphere!"
        }
      ]
    },
    {
      "id": 3,
      "groupId": "NSM_3",
      "title": "Navjivan Samaj Mandal",
      "locationCords": { "lat": 21.2420, "long": 81.4580 },  // ~1.5km from user
      "since": 2015,
      "description": "Navjivan Samaj Mandal works towards social welfare and youth empowerment through various educational and cultural programs.",
      "contactNumbers": ["9876543211", "9123456782"],
      "logo": "https://picsum.photos/seed/nsm-logo/200/200",
      "admins": [],
      "events": [
        {
          "id": 301,
          "title": "Holi Celebration",
          "year_count": 8,
          "type" : EventType.FESTIVAL,
          "start_date": "2026-03-20",
          "end_date": "2026-03-21",
          "locationCords": { "lat": 21.2422, "long": 81.4578 },  // ~180m from group
          "photos": [
            "https://picsum.photos/seed/holi/800/500",
            "https://picsum.photos/seed/holi-2/800/500"
          ],
          "programs": [
            { "id": 301001, 'description' : "abcd", "title": "Holi Milan Aarati", "type": ProgramType.SPIRITUAL, "date": "2026-03-20", "from_time": "09:00", "to_time": "09:45", "photos": ["https://picsum.photos/seed/program-301001-1/800/500", "https://picsum.photos/seed/program-301001-2/800/500"] },
            { "id": 301002, 'description' : "abcd", "title": "Rangotsav Bhandara", "type": ProgramType.BHANDARA, "date": "2026-03-20", "from_time": "13:00", "to_time": "15:00", "photos": ["https://picsum.photos/seed/program-301002-1/800/500", "https://picsum.photos/seed/program-301002-2/800/500"] },
            { "id": 301003, 'description' : "abcd", "title": "Folk Dance Program", "type": ProgramType.CULTURAL, "date": "2026-03-20", "from_time": "13:00", "to_time": "15:00", "photos": ["https://picsum.photos/seed/program-301003-1/800/500", "https://picsum.photos/seed/program-301003-2/800/500"] },
            { "id": 301004, 'description' : "abcd", "title": "Evening Hawan", "type": ProgramType.SPIRITUAL, "date": "2026-03-20", "from_time": "18:30", "to_time": "19:30", "photos": ["https://picsum.photos/seed/program-301004-1/800/500", "https://picsum.photos/seed/program-301004-2/800/500"] }
          ],
          "description": "Celebrate the festival of colors with our grand Holi event! Join us for music, dance, and colorful fun as we welcome spring with joy and enthusiasm."
        },
        {
          "id": 302,
          "title": "Youth Sports Meet",
          "type" : EventType.SPORTS,
          "year_count": 3,
          "start_date": "2026-04-10",
          "end_date": "2026-04-15",
          "locationCords": { "lat": 21.2418, "long": 81.4582 },  // ~150m from group
          "photos": [
            "https://picsum.photos/seed/sports/800/500",
            "https://picsum.photos/seed/sports-2/800/500"
          ],
          "programs": [
            { "id": 302001, 'description' : "abcd", "title": "Torch Rally", "type": ProgramType.OTHER, "date": "2026-04-10", "from_time": "08:00", "to_time": "09:00", "photos": ["https://picsum.photos/seed/program-302001-1/800/500", "https://picsum.photos/seed/program-302001-2/800/500"] },
            { "id": 302002, 'description' : "abcd", "title": "Opening Hawan", "type": ProgramType.SPIRITUAL, "date": "2026-04-10", "from_time": "09:30", "to_time": "10:15", "photos": ["https://picsum.photos/seed/program-302002-1/800/500", "https://picsum.photos/seed/program-302002-2/800/500"] },
            { "id": 302003, 'description' : "abcd", "title": "Athlete Nutrition Prasad", "type": ProgramType.BHANDARA, "date": "2026-04-12", "from_time": "12:30", "to_time": "13:30", "photos": ["https://picsum.photos/seed/program-302003-1/800/500", "https://picsum.photos/seed/program-302003-2/800/500"] },
            { "id": 302004, 'description' : "abcd", "title": "Mentor Talk", "type": ProgramType.CULTURAL, "date": "2026-04-14", "from_time": "17:00", "to_time": "18:00", "photos": ["https://picsum.photos/seed/program-302004-1/800/500", "https://picsum.photos/seed/program-302004-2/800/500"] },
            { "id": 302005, 'description' : "abcd", "title": "Closing Ceremony", "type": ProgramType.SPIRITUAL, "date": "2026-04-15", "from_time": "18:00", "to_time": "19:30", "photos": ["https://picsum.photos/seed/program-302005-1/800/500", "https://picsum.photos/seed/program-302005-2/800/500"] }
          ],
          "description": "Annual sports meet featuring various competitions including cricket, volleyball, badminton, and athletics for youth from across the city."
        }
      ]
    },
    {
      "id": 4,
      "groupId": "RSYC_4",
      "title": "Rising Star Youth Club",
      "locationCords": { "lat": 21.2510, "long": 81.4620 },  // ~2.8km from user
      "since": 2021,
      "description": "Rising Star Youth Club nurtures young talent through sports, education, and personality development programs.",
      "contactNumbers": ["9876456789", "9123456784"],
      "logo": "https://picsum.photos/seed/rsyc-logo/200/200",
      "admins": [],
      "events": [
        {
          "id": 401,
          "title": "Dance Competition",
          "type" : EventType.SPORTS,
          "year_count": 4,
          "start_date": "2026-05-15",
          "end_date": "2026-05-25",
          "locationCords": { "lat": 21.2512, "long": 81.4618 },  // ~170m from group
          "photos": [
            "https://picsum.photos/seed/dance-competition/800/500",
            "https://picsum.photos/seed/dance-competition-2/800/500"
          ],
          "programs": [
            { "id": 401001, 'description' : "abcd", "title": "Stage Poojan", "type": ProgramType.SPIRITUAL, "date": "2026-05-15", "from_time": "10:00", "to_time": "11:00", "photos": ["https://picsum.photos/seed/program-401001-1/800/500", "https://picsum.photos/seed/program-401001-2/800/500"] },
            { "id": 401002, 'description' : "abcd", "title": "Junior Category Round", "type": ProgramType.CULTURAL, "date": "2026-05-15", "from_time": "16:00", "to_time": "18:00", "photos": ["https://picsum.photos/seed/program-401002-1/800/500", "https://picsum.photos/seed/program-401002-2/800/500"] },
            { "id": 401003, 'description' : "abcd", "title": "Audience Bhandara", "type": ProgramType.BHANDARA, "date": "2026-05-20", "from_time": "14:00", "to_time": "15:30", "photos": ["https://picsum.photos/seed/program-401003-1/800/500", "https://picsum.photos/seed/program-401003-2/800/500"] },
            { "id": 401004, 'description' : "abcd", "title": "Semi Final Showcase", "type": ProgramType.CULTURAL, "date": "2026-05-23", "from_time": "18:30", "to_time": "20:00", "photos": ["https://picsum.photos/seed/program-401004-1/800/500", "https://picsum.photos/seed/program-401004-2/800/500"] },
            { "id": 401005, 'description' : "abcd", "title": "Winner Celebration", "type": ProgramType.SPIRITUAL, "date": "2026-05-25", "from_time": "19:00", "to_time": "21:00", "photos": ["https://picsum.photos/seed/program-401005-1/800/500", "https://picsum.photos/seed/program-401005-2/800/500"] }
          ],
          "description": "Showcase your dance talent in our inter-city dance competition featuring various styles from classical to contemporary!"
        }
      ]
    },
    {
      "id": 5,
      "groupId": "USM_5",
      "title": "Unity Seva Mandal",
      "locationCords": { "lat": 21.2640, "long": 81.4710 },  // ~4.5km from user
      "since": 2012,
      "description": "Unity Seva Mandal is dedicated to community service, organizing health camps, educational programs, and social welfare activities.",
      "contactNumbers": ["9876789012", "9123456785"],
      "logo": "https://picsum.photos/seed/usm-logo/200/200",
      "admins": [],
      "events": [
        {
          "id": 501,
          "title": "Free Health Camp",
          "type" : EventType.OTHER,
          "year_count": 11,
          "start_date": "2026-06-01",
          "end_date": "2026-06-05",
          "locationCords": { "lat": 21.2638, "long": 81.4708 },  // ~140m from group
          "photos": [
            "https://picsum.photos/seed/health-camp/800/500",
            "https://picsum.photos/seed/health-camp-2/800/500"
          ],
          "programs": [
            { "id": 501001, 'description' : "abcd", "title": "Health Sankalp Aarati", "type": ProgramType.SPIRITUAL, "date": "2026-06-01", "from_time": "08:30", "to_time": "09:00", "photos": ["https://picsum.photos/seed/program-501001-1/800/500", "https://picsum.photos/seed/program-501001-2/800/500"] },
            { "id": 501002, 'description' : "abcd", "title": "Health Talk Session", "type": ProgramType.CULTURAL, "date": "2026-06-01", "from_time": "10:00", "to_time": "11:00", "photos": ["https://picsum.photos/seed/program-501002-1/800/500", "https://picsum.photos/seed/program-501002-2/800/500"] },
            { "id": 501003, 'description' : "abcd", "title": "Patient Meal Bhandara", "type": ProgramType.BHANDARA, "date": "2026-06-03", "from_time": "13:00", "to_time": "14:30", "photos": ["https://picsum.photos/seed/program-501003-1/800/500", "https://picsum.photos/seed/program-501003-2/800/500"] },
            { "id": 501004, 'description' : "abcd", "title": "Doctor Q&A Camp", "type": ProgramType.CULTURAL, "date": "2026-06-04", "from_time": "16:00", "to_time": "17:00", "photos": ["https://picsum.photos/seed/program-501004-1/800/500", "https://picsum.photos/seed/program-501004-2/800/500"] },
            { "id": 501005, 'description' : "abcd", "title": "Samapan Hawan", "type": ProgramType.SPIRITUAL, "date": "2026-06-05", "from_time": "17:00", "to_time": "18:00", "photos": ["https://picsum.photos/seed/program-501005-1/800/500", "https://picsum.photos/seed/program-501005-2/800/500"] }
          ],
          "description": "Free health checkup camp providing medical consultations, blood tests, and health awareness sessions for the community."
        },
        {
          "id": 502,
          "title": "Educational Workshop",
          "type" : EventType.OTHER,
          "year_count": 6,
          "start_date": "2026-07-10",
          "end_date": "2026-07-12",
          "locationCords": { "lat": 21.2642, "long": 81.4712 },  // ~160m from group
          "photos": [
            "https://picsum.photos/seed/workshop/800/500",
            "https://picsum.photos/seed/workshop-2/800/500"
          ],
          "programs": [
            { "id": 502001, 'description' : "abcd", "title": "Workshop Inaugural Aarati", "type": ProgramType.SPIRITUAL, "date": "2026-07-10", "from_time": "09:30", "to_time": "10:00", "photos": ["https://picsum.photos/seed/program-502001-1/800/500", "https://picsum.photos/seed/program-502001-2/800/500"] },
            { "id": 502002, 'description' : "abcd", "title": "Skill Lab Session", "type": ProgramType.CULTURAL, "date": "2026-07-10", "from_time": "11:00", "to_time": "12:30", "photos": ["https://picsum.photos/seed/program-502002-1/800/500", "https://picsum.photos/seed/program-502002-2/800/500"] },
            { "id": 502006, 'description' : "abcd", "title": "Volunteer Bhandara", "type": ProgramType.BHANDARA, "date": "2026-07-10", "from_time": "11:00", "to_time": "12:30", "photos": ["https://picsum.photos/seed/program-502006-1/800/500", "https://picsum.photos/seed/program-502006-2/800/500"] },
            { "id": 502003, 'description' : "abcd", "title": "Student Prasad Vitran", "type": ProgramType.BHANDARA, "date": "2026-07-11", "from_time": "12:30", "to_time": "13:30", "photos": ["https://picsum.photos/seed/program-502003-1/800/500", "https://picsum.photos/seed/program-502003-2/800/500"] },
            { "id": 502004, 'description' : "abcd", "title": "Career Guidance Panel", "type": ProgramType.CULTURAL, "date": "2026-07-11", "from_time": "15:00", "to_time": "16:00", "photos": ["https://picsum.photos/seed/program-502004-1/800/500", "https://picsum.photos/seed/program-502004-2/800/500"] },
            { "id": 502005, 'description' : "abcd", "title": "Closing Visarjan Program", "type": ProgramType.SPIRITUAL, "date": "2026-07-12", "from_time": "17:30", "to_time": "18:30", "photos": ["https://picsum.photos/seed/program-502005-1/800/500", "https://picsum.photos/seed/program-502005-2/800/500"] }
          ],
          "description": "Educational workshop for students covering career guidance, personality development, and skill enhancement programs."
        }
      ]
    },
    {
      "id": 10,
      "groupId": "VNC_10",
      "title": "Very Nearby Club",
      "locationCords": { "lat": 21.2301, "long": 81.4501 },  // ~120m from user (very close)
      "since": 2025,
      "description": "A community club located very close to you, perfect for quick meetups and local events.",
      "contactNumbers": ["9000000000"],
      "logo": "https://picsum.photos/seed/nearby-test/200/200",
      "admins": [],
      "events": [
        {
          "id": 1001,
          "title": "Weekend Meetup",
          "type" : EventType.OTHER,
          "year_count": 1,
          "start_date": "2026-03-12",
          "end_date": "2026-03-13",
          "locationCords": { "lat": 21.2301, "long": 81.4501 },  // Same as group location
          "photos": ["https://picsum.photos/seed/test-event/800/500"],
          "programs": [
            { "id": 1001001, 'description' : "abcd", "title": "Morning Aarati", "type": ProgramType.SPIRITUAL, "date": "2026-03-13", "from_time": "07:00", "to_time": "07:45", "photos": ["https://picsum.photos/seed/program-1001001-1/800/500", "https://picsum.photos/seed/program-1001001-2/800/500"] },
            { "id": 1001002, 'description' : "abcd", "title": "Community Bhandara", "type": ProgramType.BHANDARA, "date": "2026-03-12", "from_time": "00:00", "to_time": "23:59", "photos": ["https://picsum.photos/seed/program-1001002-1/800/500", "https://picsum.photos/seed/program-1001002-2/800/500"] }
          ],
          "description": "Casual weekend meetup for community members to connect, share ideas, and plan future activities together."
        }
      ]
    }
  ];

  groupSearchTerm = signal<string>('');
  groupSelectedDistance = signal<number>(1); // Default distance in kilometers

  getGroupsEventsPrograms(): Observable<groupDetailsModel[]> {
    // return this.http.get<any>(this.apiUrl);
    return new Observable(observer => {
      observer.next(this.samitiGroups);
      observer.complete();
    });
  }
}
