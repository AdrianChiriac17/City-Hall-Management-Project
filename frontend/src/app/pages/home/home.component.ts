import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

interface HomeFeature {
  id?: string;
  title: string;
  subtitle: string;
  text: string;
  image: string;
  reverse?: boolean;
}

interface ServiceCard {
  title: string;
  text: string;
  anchor: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  readonly features: HomeFeature[] = [
    {
      id: 'requests',
      title: 'Digital services for citizens',
      subtitle: 'Submit and track requests online',
      text: 'Citizens can create accounts, send requests to the city hall and follow their status from one simple dashboard.',
      image: '/images/home/city-hall-building.jpg'
    },
    {
      id: 'announcements',
      title: 'Official announcements',
      subtitle: 'Stay informed about your community',
      text: 'Important updates, public notices and city hall announcements are available directly on the platform.',
      image: '/images/home/city-street.jpg',
      reverse: true
    },
    {
      id: 'forum',
      title: 'Community communication',
      subtitle: 'A space for questions and discussions',
      text: 'Citizens can use the forum to ask questions, follow discussions and communicate more easily with city hall staff.',
      image: '/images/home/community-meeting.jpg'
    },
    {
      id: 'documents',
      title: 'Document access',
      subtitle: 'Public and personal documents in one place',
      text: 'Users can download public documents, attach files to requests and manage the documents linked to their account.',
      image: '/images/home/public-documents.jpg',
      reverse: true
    },
    {
      title: 'Organized administration',
      subtitle: 'Better internal workflow',
      text: 'The platform helps departments, employees, requests and documents stay organized in a clear digital system.',
      image: '/images/home/city-office.jpg'
    }
  ];

  readonly services: ServiceCard[] = [
    {
      title: 'Citizen Requests',
      text: 'Submit requests online and check their progress.',
      anchor: '#requests'
    },
    {
      title: 'Documents',
      text: 'Access public documents and manage personal files.',
      anchor: '#documents'
    },
    {
      title: 'Announcements',
      text: 'Read official updates published by city hall.',
      anchor: '#announcements'
    }
  ];
}