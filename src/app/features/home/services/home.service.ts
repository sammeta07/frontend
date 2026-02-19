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

  samitiGroups: groupDetailsModel[] = [
    {
      "id": 1,
      "groupId": "ANM_1",
      "name": "Azad Navyuvak Mandal",
      "location": {
        "lat": 21.2514,
        "long": 81.6296
      },
      "since": 2018,
      "description": "Azad Navyuvak Mandal is a vibrant youth organization based in Raipur, Chhattisgarh. Founded in 2018, the group has quickly become a hub for young people passionate about community service, cultural activities, and social change. With a focus on empowering youth and fostering a sense of unity, Azad Navyuvak Mandal organizes a wide range of events throughout the year, including festivals, charity drives, educational workshops, and sports tournaments. The group is known for its inclusive and energetic approach, attracting members from diverse backgrounds who share a common goal of making a positive impact in their community.",
      "contactNumbers": [
        "9876543210",
        "9123456780"
      ],
      "logo": "https://picsum.photos/seed/anm-logo/200/200",
      "admins": [],
      "events": [
        {
          "id": 101,
          "title": "Ganesh Utsav 2026",
          "year_count": 5,
          "start_date": "2026-02-01",
          "end_date": "2026-02-11",
          "location": {
            "lat": 21.252,
            "long": 81.63
          },
          "images": [
            "https://picsum.photos/seed/ganesh-utsav/800/500",
            "https://picsum.photos/seed/ganesh-utsav-2/800/500"
          ],
          "description": "Celebrate the vibrant festival of Ganesh Utsav with us! Join us for 10 days of cultural performances, community feasts, and spiritual activities as we honor Lord Ganesha. The event will feature traditional music and dance, delicious food stalls, and a grand procession on the final day. Don't miss this opportunity to experience the rich cultural heritage of Raipur and connect with fellow community members in a joyous celebration!"
        },
        {
          "id": 102,
          "title": "Blood Donation Camp",
          "year_count": 2,
          "start_date": "2026-03-10",
          "end_date": "2026-03-15",
          "location": {
            "lat": 21.25,
            "long": 81.628
          },
          "images": [
            "https://picsum.photos/seed/blood-donation/800/500",
            "https://picsum.photos/seed/blood-donation-2/800/500"
          ],
          "description": "Save lives by donating blood! Our community blood donation camp provides a safe and hygienic environment for blood donors. Every donation can save up to three lives. Medical professionals will conduct health checks, and all donors will receive refreshments and certificates of appreciation. Join us in this noble cause!"
        },
        {
          "id": 103,
          "title": "Cricket League",
          "year_count": 10,
          "start_date": "2026-11-01",
          "end_date": "2026-11-12",
          "location": {
            "lat": 21.253,
            "long": 81.631
          },
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
      "location": {
        "lat": 21.1938,
        "long": 81.3509
      },
      "since": 2010,
      "description": "",
      "contactNumbers": [
        "9876123456",
        "9123456781"
      ],
      "logo": "https://picsum.photos/seed/esb-logo/200/200",
      "admins": [],
      "events": [
        {
          "id": 201,
          "title": "Durga Puja 2025",
          "year_count": 51,
          "start_date": "2026-01-10",
          "end_date": "2026-01-20",
          "location": {
            "lat": 21.194,
            "long": 81.351
          },
          "images": [
            "https://picsum.photos/seed/durga-puja/800/500",
            "https://picsum.photos/seed/durga-puja-2/800/500"
          ],
          "description": "Join us for the most revered festival celebration! This 51-year-old tradition brings together thousands of devotees for cultural performances, traditional feasts, and spiritual ceremonies to honor Goddess Durga. Experience intricate decorations, elaborate pujas, and community bonding at its finest!"
        },
        {
          "id": 202,
          "title": "Garba Night",
          "year_count": 5,
          "start_date": "2025-12-15",
          "end_date": "2025-12-25",
          "location": {
            "lat": 21.195,
            "long": 81.352
          },
          "images": [
            "https://picsum.photos/seed/garba-night/800/500",
            "https://picsum.photos/seed/garba-night-2/800/500"
          ],
          "description": "Dance into the festive season with our vibrant Garba Night! This traditional circular dance celebrates the joy of togetherness. Come dressed in colorful attire to participate in group dances, enjoy music, and connect with the community in a fun and energetic atmosphere!"
        },
        {
          "id": 203,
          "title": "Diwali Mela",
          "year_count": 8,
          "start_date": "2026-11-05",
          "end_date": "2026-11-15",
          "location": {
            "lat": 21.196,
            "long": 81.353
          },
          "images": [
            "https://picsum.photos/seed/diwali-mela/800/500",
            "https://picsum.photos/seed/diwali-mela-2/800/500"
          ],
          "description": "Experience the festival of lights like never before! Our Diwali Mela is a grand celebration featuring food stalls, cultural performances, fireworks, and shopping. Families and friends gather to celebrate prosperity, happiness, and the victory of good over evil."
        },
        {
          "id": 204,
          "title": "Winter Charity Drive",
          "year_count": 12,
          "start_date": "2026-01-28",
          "end_date": "2026-02-08",
          "location": {
            "lat": 21.197,
            "long": 81.354
          },
          "images": [
            "https://picsum.photos/seed/winter-charity/800/500",
            "https://picsum.photos/seed/winter-charity-2/800/500"
          ],
          "description": "Spread warmth this winter! Our 12-year tradition of charity helps underprivileged families during the cold season. We collect and distribute blankets, warm clothes, and essentials. Your contribution can make a real difference in someone's life."
        }
      ]
    },

    // Moved out: Nearby Test Group
    {
      "id": 10,
      "groupId": "ANM_10",
      "name": "Nearby Test Group",
      "location": {
        "lat": 21.2251827,
        "long": 81.4535621
      },
      "since": 2025,
      "description": "A test group located less than 1 km from Azad Navyuvak Mandal for proximity testing.",
      "contactNumbers": [
        "9000000000"
      ],
      "logo": "https://picsum.photos/seed/nearby-test/200/200",
      "admins": [],
      "events": [
        {
          "id": 1001,
          "title": "Test Event",
          "year_count": 1,
          "start_date": "2026-02-20",
          "end_date": "2026-02-21",
          "location": {
            "lat": 21.2251827,
            "long": 81.4535621
          },
          "images": [
            "https://picsum.photos/seed/test-event/800/500"
          ],
          "description": "A sample event for the nearby test group."
        }
      ]
    },
    {
      "id": 3,
      "groupId": "SSSM_3",
      "name": "Shiv Shakti Sewa Mandal",
      "location": {
        "lat": 21.1904,
        "long": 81.2849
      },
      "since": 2005,
      "description": "Shiv Shakti Sewa Mandal is a spiritual and social organization focused on community service and religious ceremonies.",
      "contactNumbers": [
        "9876234567",
        "9123456782"
      ],
      "logo": "https://picsum.photos/seed/sssm-logo/200/200",
      "admins": [],
      "events": [
        {
          "id": 301,
          "title": "Maha Shivratri Bhandara",
          "year_count": 15,
          "start_date": "2026-01-30",
          "end_date": "2026-02-10",
          "location": {
            "lat": 21.191,
            "long": 81.285
          },
          "images": [
            "https://picsum.photos/seed/maha-shivratri/800/500",
            "https://picsum.photos/seed/maha-shivratri-2/800/500"
          ],
          "description": "Celebrate the great night of Lord Shiva with traditional bhandara (community feast)! This 15-year-old event honors Shiva worship through prayers, meditation, and free meals for all devotees. Experience spiritual awakening and community solidarity."
        },
        {
          "id": 302,
          "title": "Yoga Workshop",
          "year_count": 3,
          "start_date": "2026-04-01",
          "end_date": "2026-04-12",
          "location": {
            "lat": 21.192,
            "long": 81.286
          },
          "images": [
            "https://picsum.photos/seed/yoga-workshop/800/500",
            "https://picsum.photos/seed/yoga-workshop-2/800/500"
          ],
          "description": "Achieve wellness and inner peace through guided yoga sessions! Our expert instructors will teach you traditional asanas, pranayama, and meditation techniques. Perfect for beginners and experienced practitioners alike."
        },
        {
          "id": 303,
          "title": "Satsang Series",
          "year_count": 7,
          "start_date": "2026-01-20",
          "end_date": "2026-02-04",
          "location": {
            "lat": 21.193,
            "long": 81.287
          },
          "images": [
            "https://picsum.photos/seed/satsang-series/800/500",
            "https://picsum.photos/seed/satsang-series-2/800/500"
          ],
          "description": "Join our 7-year tradition of spiritual gatherings! Satsang brings together people for meaningful discussions, devotional singing, and spiritual teachings. A unique opportunity to explore inner consciousness and connect with like-minded seekers."
        },
        {
          "id": 304,
          "title": "Temple Renovation",
          "year_count": 4,
          "start_date": "2026-06-01",
          "end_date": "2026-06-10",
          "location": {
            "lat": 21.194,
            "long": 81.288
          },
          "images": [
            "https://picsum.photos/seed/temple-renovation/800/500",
            "https://picsum.photos/seed/temple-renovation-2/800/500"
          ],
          "description": "Be part of preserving our heritage! Help us restore and beautify the historic temple through community participation. Every contribution, big or small, helps preserve the cultural and spiritual significance of this sacred place."
        },
        {
          "id": 305,
          "title": "Free Medical Checkup",
          "year_count": 6,
          "start_date": "2026-01-29",
          "end_date": "2026-02-09",
          "location": {
            "lat": 21.195,
            "long": 81.289
          },
          "images": [
            "https://picsum.photos/seed/free-medical-checkup/800/500",
            "https://picsum.photos/seed/free-medical-checkup-2/800/500"
          ],
          "description": "Your health matters! Our free medical camp provides comprehensive health examinations, consultations, and basic treatments. Qualified doctors and healthcare professionals are available for everyone in the community."
        }
      ]
    },
    {
      "id": 4,
      "groupId": "PWG_4",
      "name": "Pragati Welfare Group",
      "location": {
        "lat": 22.0797,
        "long": 82.1409
      },
      "since": 2019,
      "description": "Pragati Welfare Group drives social change through street awareness, environmental conservation, and community empowerment initiatives.",
      "contactNumbers": [
        "9876345678",
        "9123456783"
      ],
      "logo": "https://picsum.photos/seed/pwg-logo/200/200",
      "admins": [],
      "events": [
        {
          "id": 401,
          "title": "Street Play (Nukkad)",
          "year_count": 2,
          "start_date": "2026-01-27",
          "end_date": "2026-02-06",
          "location": {
            "lat": 22.08,
            "long": 82.141
          },
          "images": [
            "https://picsum.photos/seed/street-play/800/500",
            "https://picsum.photos/seed/street-play-2/800/500"
          ],
          "description": "Experience socially relevant performances right on the streets! Our street plays tackle important social issues through engaging theatrical performances. This unique art form brings awareness and entertainment to the public square."
        },
        {
          "id": 402,
          "title": "Clean City Campaign",
          "year_count": 5,
          "start_date": "2026-01-25",
          "end_date": "2026-02-08",
          "location": {
            "lat": 22.081,
            "long": 82.142
          },
          "images": [
            "https://picsum.photos/seed/clean-city/800/500",
            "https://picsum.photos/seed/clean-city-2/800/500"
          ],
          "description": "Make our city cleaner and greener! Join our 5-year initiative to clean public spaces, remove litter, and promote environmental awareness. Together, we create a healthier and more beautiful city for everyone."
        },
        {
          "id": 403,
          "title": "Plantation Drive",
          "year_count": 9,
          "start_date": "2026-07-01",
          "end_date": "2026-07-15",
          "location": {
            "lat": 22.082,
            "long": 82.143
          },
          "images": [
            "https://picsum.photos/seed/plantation-drive/800/500",
            "https://picsum.photos/seed/plantation-drive-2/800/500"
          ],
          "description": "Plant trees and grow the future! Our plantation drive aims to increase green cover and combat climate change. Join us in planting thousands of trees along the river bank and witness your contribution to environmental conservation."
        }
      ]
    },
    {
      "id": 5,
      "groupId": "RSYC_5",
      "name": "Rising Star Youth Club",
      "location": {
        "lat": 21.8958,
        "long": 83.4016
      },
      "since": 2021,
      "description": "Rising Star Youth Club nurtures young talent through sports, education, and personality development programs.",
      "contactNumbers": [
        "9876456789",
        "9123456784"
      ],
      "logo": "https://picsum.photos/seed/rsyc-logo/200/200",
      "admins": [],
      "events": [
        {
          "id": 501,
          "title": "Dance Competition",
          "year_count": 4,
          "start_date": "2026-05-15",
          "end_date": "2026-05-25",
          "location": {
            "lat": 21.896,
            "long": 83.402
          },
          "images": [
            "https://picsum.photos/seed/dance-competition/800/500",
            "https://picsum.photos/seed/dance-competition-2/800/500"
          ],
          "description": "Showcase your dance talent! Our annual dance competition welcomes dancers of all styles and skill levels. Compete for prizes, recognition, and the opportunity to perform on stage. It's a celebration of movement, music, and talent!"
        },
        {
          "id": 502,
          "title": "Summer Coaching",
          "year_count": 8,
          "start_date": "2026-01-22",
          "end_date": "2026-02-05",
          "location": {
            "lat": 21.897,
            "long": 83.403
          },
          "images": [
            "https://picsum.photos/seed/summer-coaching/800/500",
            "https://picsum.photos/seed/summer-coaching-2/800/500"
          ],
          "description": "Empower students for success! Our summer coaching program provides academic support in key subjects. Expert tutors help students strengthen fundamentals and prepare for exams. Make the most of your summer break!"
        },
        {
          "id": 503,
          "title": "Football Tournament",
          "year_count": 6,
          "start_date": "2026-01-24",
          "end_date": "2026-02-07",
          "location": {
            "lat": 21.898,
            "long": 83.404
          },
          "images": [
            "https://picsum.photos/seed/football-tournament/800/500",
            "https://picsum.photos/seed/football-tournament-2/800/500"
          ],
          "description": "Goal! Experience the thrill of competitive football! Our tournament brings together talented players for intense matches, thrilling goals, and team spirit. Support your favorite teams and enjoy this exciting sporting extravaganza!"
        },
        {
          "id": 504,
          "title": "Cyber Security Seminar",
          "year_count": 1,
          "start_date": "2026-08-05",
          "end_date": "2026-08-10",
          "location": {
            "lat": 21.899,
            "long": 83.405
          },
          "images": [
            "https://picsum.photos/seed/cyber-security/800/500",
            "https://picsum.photos/seed/cyber-security-2/800/500"
          ],
          "description": "Protect yourself in the digital age! Learn about cyber threats, data protection, and online safety from industry experts. This inaugural seminar equips you with essential cybersecurity knowledge for the modern world."
        }
      ]
    },
    {
      "id": 6,
      "groupId": "MP_6",
      "name": "Maitri Pariwar",
      "location": {
        "lat": 22.3458,
        "long": 82.7018
      },
      "since": 1995,
      "description": "Maitri Pariwar is a trusted community organization with 28+ years of experience in social welfare, charity, and environmental conservation.",
      "contactNumbers": [
        "9876567890",
        "9123456785"
      ],
      "logo": "https://picsum.photos/seed/mp-logo/200/200",
      "admins": [],
      "events": [
        {
          "id": 601,
          "title": "Holi Milan",
          "year_count": 20,
          "start_date": "2026-01-05",
          "end_date": "2026-01-15",
          "location": {
            "lat": 22.346,
            "long": 82.702
          },
          "images": [
            "https://picsum.photos/seed/holi-milan/800/500",
            "https://picsum.photos/seed/holi-milan-2/800/500"
          ],
          "description": "Celebrate colors and unity! Our 20-year tradition of Holi brings the community together for a joyous festival. Experience colored powder showers, traditional sweets, and genuine bonding. This is the perfect time to forgive, forget, and celebrate relationships!"
        },
        {
          "id": 602,
          "title": "Tree Adoption",
          "year_count": 3,
          "start_date": "2026-01-26",
          "end_date": "2026-02-06",
          "location": {
            "lat": 22.347,
            "long": 82.703
          },
          "images": [
            "https://picsum.photos/seed/tree-adoption/800/500",
            "https://picsum.photos/seed/tree-adoption-2/800/500"
          ],
          "description": "Become a tree guardian! Adopt a tree and help nurture it for years to come. Your adoption supports environmental conservation and creates green spaces for the community. Track your tree's growth and make a lasting impact!"
        },
        {
          "id": 603,
          "title": "Old Age Home Visit",
          "year_count": 7,
          "start_date": "2026-01-28",
          "end_date": "2026-02-07",
          "location": {
            "lat": 22.348,
            "long": 82.704
          },
          "images": [
            "https://picsum.photos/seed/old-age-home/800/500",
            "https://picsum.photos/seed/old-age-home-2/800/500"
          ],
          "description": "Bring joy to seniors! Our care visits provide companionship, assistance, and love to elderly residents. Share stories, play games, and spend meaningful time with people who appreciate interaction. Make a difference one visit at a time!"
        },
        {
          "id": 604,
          "title": "Digital Literacy Camp",
          "year_count": 2,
          "start_date": "2026-09-01",
          "end_date": "2026-09-12",
          "location": {
            "lat": 22.349,
            "long": 82.705
          },
          "images": [
            "https://picsum.photos/seed/digital-literacy/800/500",
            "https://picsum.photos/seed/digital-literacy-2/800/500"
          ],
          "description": "Bridge the digital divide! Learn essential computer and internet skills. Our camp teaches basic computer operations, email, online safety, and digital tools. Perfect for those new to technology and wanting to stay connected."
        },
        {
          "id": 605,
          "title": "Handicraft Exhibition",
          "year_count": 5,
          "start_date": "2026-10-02",
          "end_date": "2026-10-10",
          "location": {
            "lat": 22.35,
            "long": 82.706
          },
          "images": [
            "https://picsum.photos/seed/handicraft-exhibition/800/500",
            "https://picsum.photos/seed/handicraft-exhibition-2/800/500"
          ],
          "description": "Celebrate local artistry! Showcase traditional and contemporary handicrafts from talented artisans. Visitors can view, purchase, and support local craftspeople. A perfect blend of art, culture, and commerce!"
        },
        {
          "id": 606,
          "title": "Food Donation",
          "year_count": 12,
          "start_date": "2026-01-20",
          "end_date": "2026-02-04",
          "location": {
            "lat": 22.351,
            "long": 82.707
          },
          "images": [
            "https://picsum.photos/seed/food-donation/800/500",
            "https://picsum.photos/seed/food-donation-2/800/500"
          ],
          "description": "Feed the hungry! Our 12-year food donation drive ensures no one goes hungry. We collect and distribute nutritious meals to underprivileged families and individuals. Every meal is prepared with care and served with compassion."
        }
      ]
    },
    {
      "id": 7,
      "groupId": "SKM_7",
      "name": "Sanskriti Kala Manch",
      "location": {
        "lat": 19.0748,
        "long": 82.0186
      },
      "since": 2008,
      "description": "Sanskriti Kala Manch celebrates tribal and local art, promoting cultural heritage and artistic expression through festivals and exhibitions.",
      "contactNumbers": [
        "9876678901",
        "9123456786"
      ],
      "logo": "https://picsum.photos/seed/skm-logo/200/200",
      "admins": [],
      "events": [
        {
          "id": 701,
          "title": "Tribal Art Fest",
          "year_count": 25,
          "start_date": "2026-01-29",
          "end_date": "2026-02-09",
          "location": {
            "lat": 19.075,
            "long": 82.019
          },
          "images": [
            "https://picsum.photos/seed/tribal-art-fest/800/500",
            "https://picsum.photos/seed/tribal-art-fest-2/800/500"
          ],
          "description": "Celebrate tribal heritage and artistry! This 25-year celebration showcases magnificent tribal art, traditional crafts, and cultural performances. Discover the rich history and talent of tribal communities through art exhibitions and demonstrations."
        },
        {
          "id": 702,
          "title": "Photography Contest",
          "year_count": 4,
          "start_date": "2026-08-19",
          "end_date": "2026-08-30",
          "location": {
            "lat": 19.076,
            "long": 82.02
          },
          "images": [
            "https://picsum.photos/seed/photography-contest/800/500",
            "https://picsum.photos/seed/photography-contest-2/800/500"
          ],
          "description": "Capture moments, win recognition! Photographers of all levels can submit their best work. Categories include nature, culture, portraits, and abstracts. Showcase your creative vision and compete for prizes and publication!"
        },
        {
          "id": 703,
          "title": "Local Music Night",
          "year_count": 6,
          "start_date": "2026-11-14",
          "end_date": "2026-11-20",
          "location": {
            "lat": 19.077,
            "long": 82.021
          },
          "images": [
            "https://picsum.photos/seed/local-music-night/800/500",
            "https://picsum.photos/seed/local-music-night-2/800/500"
          ],
          "description": "Feel the rhythm of local talent! Our music nights feature local musicians and bands performing diverse genres. From traditional to contemporary, this is a platform for musical expression and community entertainment."
        }
      ]
    },
    {
      "id": 8,
      "groupId": "DNG_8",
      "name": "Dongargarh Youth Club",
      "location": {
        "lat": 21.1889,
        "long": 80.7541
      },
      "since": 2015,
      "description": "Dongargarh Youth Club is a vibrant group focused on youth empowerment and cultural activities in Dongargarh.",
      "contactNumbers": [
        "9876888888",
        "9123456799"
      ],
      "logo": "https://picsum.photos/seed/dng-logo/200/200",
      "admins": [],
      "events": [
        {
          "id": 801,
          "title": "Temple Festival",
          "year_count": 7,
          "start_date": "2026-03-01",
          "end_date": "2026-03-05",
          "location": {
            "lat": 21.189,
            "long": 80.755
          },
          "images": [
            "https://picsum.photos/seed/temple-festival/800/500"
          ],
          "description": "Annual festival at Dongargarh temple with cultural programs and community feasts."
        },
        {
          "id": 802,
          "title": "Clean City Drive",
          "year_count": 3,
          "start_date": "2026-04-10",
          "end_date": "2026-04-12",
          "location": {
            "lat": 21.19,
            "long": 80.756
          },
          "images": [
            "https://picsum.photos/seed/clean-dongargarh/800/500"
          ],
          "description": "Join us to clean and beautify Dongargarh city."
        }
      ]
    },
    {
      "id": 9,
      "groupId": "RJN_9",
      "name": "Rajnandgaon Samiti",
      "location": {
        "lat": 21.0972,
        "long": 81.0337
      },
      "since": 2017,
      "description": "Rajnandgaon Samiti is dedicated to social and cultural development in Rajnandgaon.",
      "contactNumbers": [
        "9876999999",
        "9123456700"
      ],
      "logo": "https://picsum.photos/seed/rjn-logo/200/200",
      "admins": [],
      "events": [
        {
          "id": 901,
          "title": "Youth Carnival",
          "year_count": 4,
          "start_date": "2026-02-01",
          "end_date": "2026-02-06",
          "location": {
            "lat": 21.098,
            "long": 81.034
          },
          "images": [
            "https://picsum.photos/seed/youth-carnival/800/500"
          ],
          "description": "A fun-filled carnival for the youth of Rajnandgaon."
        },
        {
          "id": 902,
          "title": "Health Awareness Camp",
          "year_count": 2,
          "start_date": "2026-03-10",
          "end_date": "2026-03-12",
          "location": {
            "lat": 21.099,
            "long": 81.035
          },
          "images": [
            "https://picsum.photos/seed/health-camp/800/500"
          ],
          "description": "Free health checkups and awareness sessions for the community."
        }
      ]
    }
  ];

  searchTerm = signal<string>('');
  selectedDistance = signal<number>(50); // Default distance in kilometers

  getGroupsAndEvents(): Observable<groupDetailsModel[]> {
    // return this.http.get<any>(this.apiUrl);
    return new Observable(observer => {
      observer.next(this.samitiGroups);
      observer.complete();
    });
  }
}
