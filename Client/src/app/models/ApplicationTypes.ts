/**
 * @file    ApplicationTypes.ts
 * @author  Alexis Allemann & Alexandre Mottier
 * @date    08.04.2021
 * @brief   Application types for typing
 */

export type Address = {
  id: string;
  street: string;
  streetNb: string;
  cityName: string;
  npa: string;
};

export type Chat = {
  id: string;
  messages: Message[];
};

export type CovidData = {
  isOpen: boolean;
  masksRequired: boolean;
  disinfectionRequired: boolean;
  recommendedDistancing: string;
  comments: string;
};

export type Error = {
  message: string;
};

export type Filter = {
  name: string | null;
  startDate: string | null;
  endDate: string | null;
  tags: Tag[] | null;
  location: Location | null;
};

export type Host = {
  id: string;
  name: string;
  address: Address;
  description: string;
  tags: Tag[];
  covidData: CovidData;
};

export type Location = {
  id: string;
  name: string;
  description: string;
  nbPeople: number;
  hostId: string;
  hostName: string;
  tags: Tag[];
  openingHours: OpeningHour[];
};

export type OpeningHour = {
  startTime: string;
  endTime: string;
  day: number;
};

export type Meeting = {
  id: string;
  name: string;
  description: string;
  locationID: string;
  locationName: string;
  ownerID: string;
  chatID: string;
  tags: Tag[];
  membersId: string[];
  maxPeople: number;
  startDate: string;
  endDate: string;
  isPrivate: boolean;
};

export type Message = {
  message: string;
  username: string;
  date: string;
};

export type Tag = {
  name: string;
};

export type Student = {
  id: string;
  username: string;
};

export type UserResponse = {
  id: string;
  username: string;
  isStudent: boolean;
};
