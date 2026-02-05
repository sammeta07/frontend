import { Component } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlatTreeControl } from '@angular/cdk/tree';

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-sidebar',
  imports: [
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node.events && node.events.length > 0,
      name: node.name || node.title,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.events,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = this.samitiGroups;
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  samitiGroups = [
    {
      name: 'Azad Navyuvak Mandal',
      location: 'Raipur, CG',
      events: [
        { id: 101, title: 'Ganesh Utsav 2026', budget: '₹1.5L', status: 'In Progress' },
        { id: 102, title: 'Blood Donation Camp', budget: '₹15K', status: 'Upcoming' },
        { id: 103, title: 'Cricket League', budget: '₹40K', status: 'Planning' }
      ]
    },
    {
      name: 'Ekta Samiti Bhilai',
      location: 'Bhilai, CG',
      events: [
        { id: 201, title: 'Durga Puja 2025', budget: '₹3L', status: 'Completed' },
        { id: 202, title: 'Garba Night', budget: '₹80K', status: 'Completed' },
        { id: 203, title: 'Diwali Mela', budget: '₹50K', status: 'Upcoming' },
        { id: 204, title: 'Winter Charity Drive', budget: '₹20K', status: 'In Progress' }
      ]
    },
    {
      name: 'Shiv Shakti Sewa Mandal',
      location: 'Durg, CG',
      events: [
        { id: 301, title: 'Maha Shivratri Bhandara', budget: '₹2L', status: 'In Progress' },
        { id: 302, title: 'Yoga Workshop', budget: '₹5K', status: 'Upcoming' },
        { id: 303, title: 'Satsang Series', budget: '₹10K', status: 'Active' },
        { id: 304, title: 'Temple Renovation', budget: '₹5L', status: 'Planning' },
        { id: 305, title: 'Free Medical Checkup', budget: '₹30K', status: 'In Progress' }
      ]
    },
    {
      name: 'Pragati Welfare Group',
      location: 'Bilaspur, CG',
      events: [
        { id: 401, title: 'Street Play (Nukkad)', budget: '₹12K', status: 'In Progress' },
        { id: 402, title: 'Clean City Campaign', budget: '₹5K', status: 'Active' },
        { id: 403, title: 'Plantation Drive', budget: '₹8K', status: 'Upcoming' }
      ]
    },
    {
      name: 'Rising Star Youth Club',
      location: 'Raigarh, CG',
      events: [
        { id: 501, title: 'Dance Competition', budget: '₹25K', status: 'Planning' },
        { id: 502, title: 'Summer Coaching', budget: '₹15K', status: 'Active' },
        { id: 503, title: 'Football Tournament', budget: '₹60K', status: 'In Progress' },
        { id: 504, title: 'Cyber Security Seminar', budget: '₹10K', status: 'Upcoming' }
      ]
    },
    {
      name: 'Maitri Pariwar',
      location: 'Korba, CG',
      events: [
        { id: 601, title: 'Holi Milan', budget: '₹35K', status: 'Completed' },
        { id: 602, title: 'Tree Adoption', budget: '₹20K', status: 'Active' },
        { id: 603, title: 'Old Age Home Visit', budget: '₹15K', status: 'In Progress' },
        { id: 604, title: 'Digital Literacy Camp', budget: '₹12K', status: 'Planning' },
        { id: 605, title: 'Handicraft Exhibition', budget: '₹45K', status: 'Upcoming' },
        { id: 606, title: 'Food Donation', budget: '₹10K', status: 'Active' }
      ]
    },
    {
      name: 'Sanskriti Kala Manch',
      location: 'Jagdalpur, CG',
      events: [
        { id: 701, title: 'Tribal Art Fest', budget: '₹1.2L', status: 'In Progress' },
        { id: 702, title: 'Photography Contest', budget: '₹8K', status: 'Upcoming' },
        { id: 703, title: 'Local Music Night', budget: '₹30K', status: 'Planning' }
      ]
    },
    {
      name: 'Umeed Foundation',
      location: 'Ambikapur, CG',
      events: [
        { id: 801, title: 'Scholarship Exam', budget: '₹50K', status: 'Active' },
        { id: 802, title: 'Winter Clothes Drive', budget: '₹25K', status: 'In Progress' },
        { id: 803, title: 'Library Setup', budget: '₹1L', status: 'Planning' },
        { id: 804, title: 'Skill Training', budget: '₹40K', status: 'Upcoming' }
      ]
    },
    {
      name: 'Adarsh Gram Samiti',
      location: 'Dhamtari, CG',
      events: [
        { id: 901, title: 'Agri-Tech Seminar', budget: '₹20K', status: 'Active' },
        { id: 902, title: 'Pond Cleaning', budget: '₹15K', status: 'In Progress' },
        { id: 903, title: 'Village Sports Day', budget: '₹35K', status: 'Upcoming' },
        { id: 904, title: 'Sanitation Awareness', budget: '₹5K', status: 'Completed' },
        { id: 905, title: 'Cattle Health Camp', budget: '₹25K', status: 'Planning' }
      ]
    },
    {
      name: 'Nav Nirman Group',
      location: 'Rajnandgaon, CG',
      events: [
        { id: 1001, title: 'Entrepreneurship Meet', budget: '₹50K', status: 'In Progress' },
        { id: 1002, title: 'Career Counselling', budget: '₹10K', status: 'Upcoming' },
        { id: 1003, title: 'Youth Icon Awards', budget: '₹1L', status: 'Planning' }
      ]
    },
    {
      name: 'Jan Kalyan Trust',
      location: 'Mahasamund, CG',
      events: [
        { id: 1101, title: 'Eye Surgery Camp', budget: '₹2L', status: 'In Progress' },
        { id: 1102, title: 'Women Empowerment Talk', budget: '₹15K', status: 'Active' },
        { id: 1103, title: 'Cycle Marathon', budget: '₹25K', status: 'Upcoming' },
        { id: 1104, title: 'Legal Aid Workshop', budget: '₹10K', status: 'Planning' },
        { id: 1105, title: 'Organic Farming Intro', budget: '₹20K', status: 'In Progress' },
        { id: 1106, title: 'Blood Group Testing', budget: '₹5K', status: 'Active' },
        { id: 1107, title: 'Evening School Support', budget: '₹12K', status: 'Active' }
      ]
    }
  ];
}
