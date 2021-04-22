import { Meeting } from '../app/models/ApplicationTypes';

export const mockMeetings: Meeting[] = [
  {
    id: '#1',
    name: 'PRO - Coordination',
    description: "Réunion pour coordiner l'avancement du projet",
    tags: [{ name: 'PRO' }, { name: 'Coordination' }],
    locationID: '',
    locationName: 'Salle G01',
    nbPeople: 2,
    maxPeople: 5,
    startDate: '2021-04-25T15:00:00',
    endDate: '2021-04-25T16:00:00',
    ownerID: '',
    chatId: '',
    isPrivate: true,
  },
  {
    id: '#2',
    name: 'RES - Préparation TE1',
    description: 'Java IO et programmation TCP',
    tags: [{ name: 'RES' }, { name: 'Java IO' }, { name: 'TCP' }],
    locationID: '',
    locationName: 'Bibliothèque',
    nbPeople: 1,
    maxPeople: 3,
    startDate: '2021-04-26T15:00:00',
    endDate: '2021-04-26T16:00:00',
    ownerID: '',
    chatId: '',
    isPrivate: true,
  },
  {
    id: '#3',
    name: 'PCO - Labo train',
    description: 'Laboratoire train PCO',
    tags: [{ name: 'PCO' }, { name: 'Laboratoire' }],
    locationID: '',
    locationName: 'Salle G04',
    nbPeople: 4,
    maxPeople: 10,
    startDate: '2021-04-26T15:00:00',
    endDate: '2021-04-26T16:00:00',
    ownerID: '',
    chatId: '',
    isPrivate: false,
  },
];
