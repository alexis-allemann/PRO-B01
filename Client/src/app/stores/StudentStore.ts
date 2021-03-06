/**
 * @file    StudentStore.ts
 * @author  Alexis Allemann & Alexandre Mottier
 * @date    22.03.2021
 * @brief   Student store
 */

import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { Meeting, Location, Host, Chat, Message, Filter } from '../models/ApplicationTypes';
import AmphitryonDAO from '../data/AmphitryonDAO';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { Alert } from 'react-native';
import { AgendaItemsMap } from 'react-native-calendars';
import Strings from '../context/Strings';
import Utils from '../utils/Utils';

class StudentStore {
  private static instance: StudentStore;
  private amphitryonDAO = AmphitryonDAO.getInstance();
  private utils = Utils.getInstance();
  private dateInCalendar = new Date();

  @observable meetingToUpdate: Meeting | null = null;
  @observable meetingsCreatedByUser: Meeting[] = [];
  @observable userMeetings: Meeting[] = [];
  @observable chat: Chat | null = null;
  @observable locations: Location[] = [];
  @observable locationToDisplay: Location | null = null;
  @observable hostToDisplay: Host | null = null;
  @observable searchMeetings: Meeting[] = [];
  @observable locationToLoad = '';
  @observable hostToLoad = '';
  @observable chatToLoad = '';
  @observable items: AgendaItemsMap<Meeting> | null = null;

  /**
   * Instantiation of the store
   */
  private constructor() {
    makeAutoObservable(this);
  }

  /**
   * Get store instance
   * @returns the store instance
   */
  public static getInstance(): StudentStore {
    if (!StudentStore.instance) this.instance = new StudentStore();
    return this.instance;
  }

  /**
   * Retrieve user data from API
   */
  @action async loadUserData(): Promise<void> {
    await this.loadMeetingsCreatedByUser();
    await this.generateItems(new Date());
  }

  /**
   * Set meeting to update
   * @param meeting réunion à mettre à jour
   */
  @action setMeetingToUpdate(meeting: Meeting | null): void {
    this.meetingToUpdate = meeting;
  }

  /**
   * Retrieve meetings created by user
   */
  @action async loadMeetingsCreatedByUser(): Promise<void> {
    const response = await this.amphitryonDAO.loadMeetingCreatedByUser();
    if (response) {
      if (response.ok) {
        const meetings = await response.json();
        runInAction(() => {
          this.meetingsCreatedByUser = meetings;
        });
      } else {
        void this.utils.manageErrorInResponse(response);
      }
    }
  }

  /**
   * Retrieve meetings where user is member of between two given dates
   * @param startDate from date
   * @param endDate to date
   */
  @action async loadUserMeetings(startDate: Date, endDate: Date): Promise<void> {
    const response = await this.amphitryonDAO.loadUserMeetings(startDate, endDate);
    if (response) {
      if (response.ok) {
        await runInAction(async () => {
          this.userMeetings = await response.json();
        });
      } else {
        void this.utils.manageErrorInResponse(response);
      }
    }
  }

  /**
   * Join a meeting
   * @param meeting to join
   */
  @action async joinMeeting(meeting: Meeting): Promise<void> {
    const response = await this.amphitryonDAO.joinMeeting(meeting.id);
    if (response) {
      if (response.ok) {
        void runInAction(async () => {
          if (this.userMeetings) {
            const newMeeting = await response.json();
            this.setMeetingToUpdate(newMeeting);
            this.userMeetings.push(newMeeting);
            Alert.alert(Strings.SAVED, Strings.MEETING_JOINED + meeting.name);
            this.regenerateItems();
          }
        });
      } else {
        void this.utils.manageErrorInResponse(response);
      }
    }
  }

  /**
   * User leaves a meeting
   * @param meeting to leave
   */
  @action async leaveMeeting(meeting: Meeting): Promise<void> {
    const response = await this.amphitryonDAO.leaveMeeting(meeting.id);
    if (response) {
      if (response.ok) {
        void runInAction(async () => {
          if (this.userMeetings) {
            this.setMeetingToUpdate(await response.json());
            this.userMeetings = this.userMeetings?.filter((current: Meeting) => {
              return current.id !== current.id;
            });
            this.regenerateItems();
          }
        });
      } else {
        void this.utils.manageErrorInResponse(response);
      }
    }
  }

  /**
   * Set the chat to load
   * @param chatId to load
   */
  @action setChatToLoad(chatId: string): void {
    this.chatToLoad = chatId;
  }

  /**
   * Load chat data
   * @param chatId to load
   */
  @action async loadChat(): Promise<void> {
    const response = await this.amphitryonDAO.loadChat(this.chatToLoad);
    if (response) {
      if (response.ok) {
        this.chat = await response.json();
      } else {
        void this.utils.manageErrorInResponse(response);
      }
    }
  }

  /**
   * Send a new message in a chat
   * @param chatId where to send the message
   * @param message to send
   */
  @action async sendMessage(chatId: string, message: Message): Promise<void> {
    const response = await this.amphitryonDAO.sendMessage(chatId, message);
    if (response) {
      if (response.ok) {
        runInAction(() => {
          this.chat?.messages.push(message);
        });
      } else {
        void this.utils.manageErrorInResponse(response);
      }
    }
  }

  /**
   * Set location to load
   * @param locationId to load
   */
  @action setLocationToLoad(locationId: string): void {
    this.locationToLoad = locationId;
  }

  /**
   * Load locations available between dates
   * @param startDate from date
   * @param endDate to date
   * @param meetingId meeting id
   */
  @action async loadLocations(
    startDate: Date,
    endDate: Date,
    meetingId: string | null,
  ): Promise<void> {
    const response = await this.amphitryonDAO.getAllLocationsAvailable(
      startDate,
      endDate,
      meetingId,
    );
    if (response) {
      if (response.ok) {
        this.locations = await response.json();
      } else {
        void this.utils.manageErrorInResponse(response);
      }
    }
  }

  /**
   * Load all locations
   */
  @action async loadAllLocations(): Promise<void> {
    const response = await this.amphitryonDAO.getAllLocations();
    if (response) {
      if (response.ok) {
        this.locations = await response.json();
      } else {
        void this.utils.manageErrorInResponse(response);
      }
    }
  }

  /**
   * Load location details
   * @param locationId location id
   */
  @action async loadLocationToDisplay(): Promise<void> {
    const location = await this.loadLocation(this.locationToLoad);
    if (location) this.locationToDisplay = location;
  }

  /**
   * Load location with given id
   * @param locationId to load
   * @returns the location loaded
   */
  @action async loadLocation(locationId: string): Promise<Location | null> {
    const response = await this.amphitryonDAO.getLocationDetails(locationId);
    if (response) {
      if (response.ok) {
        return await response.json();
      } else {
        void this.utils.manageErrorInResponse(response);
      }
    }
    return null;
  }

  /**
   * Set host to load
   * @param hostId to load
   */
  @action setHostToLoad(hostId: string): void {
    this.hostToLoad = hostId;
  }

  /**
   * Load host details
   * @param hostId host id
   */
  @action async loadHost(): Promise<void> {
    const response = await this.amphitryonDAO.getHostDetails(this.hostToLoad);
    if (response) {
      if (response.ok) {
        this.hostToDisplay = await response.json();
      } else {
        void this.utils.manageErrorInResponse(response);
      }
    }
  }

  /**
   * Action when a meeting is created
   * @param meeting to create
   */
  @action async createMeeting(meeting: Meeting): Promise<void> {
    const response = await this.amphitryonDAO.createMeeting(meeting);
    if (response) {
      if (response.ok) {
        void runInAction(async () => {
          const meetingWithId = await response.json();
          this.userMeetings?.push(meetingWithId);
          runInAction(() => {
            this.meetingsCreatedByUser?.push(meetingWithId);
          });
          this.regenerateItems();
          Alert.alert(Strings.CREATED, Strings.MEETING_CREATED);
        });
        this.regenerateItems();
      } else {
        void this.utils.manageErrorInResponse(response);
      }
    }
  }

  /**
   * Action when a meeting is updated
   * @param meeting to update
   */
  @action async updateMeeting(meeting: Meeting): Promise<void> {
    const response = await this.amphitryonDAO.updateMeeting(meeting);
    if (response) {
      if (response.ok) {
        runInAction(() => {
          if (this.userMeetings) {
            const index = this.userMeetings.findIndex((current: Meeting) => {
              return current.id == meeting.id;
            });
            if (index !== -1) this.userMeetings[index] = meeting;
          }
          if (this.meetingsCreatedByUser) {
            const index = this.meetingsCreatedByUser.findIndex((current: Meeting) => {
              return current.id == meeting.id;
            });
            if (index !== -1) this.meetingsCreatedByUser[index] = meeting;
          }
        });
        this.regenerateItems();
      } else {
        void this.utils.manageErrorInResponse(response);
      }
    }
  }

  /**
   * Action when a meeting is deleted
   * @param meetingId to delete
   */
  @action async deleteMeeting(meetingId: string): Promise<void> {
    const response = await this.amphitryonDAO.deleteMeeting(meetingId);
    if (response) {
      if (response.ok) {
        runInAction(() => {
          if (this.userMeetings)
            this.userMeetings = this.userMeetings.filter((current: Meeting) => {
              return current.id !== meetingId;
            });
          if (this.meetingsCreatedByUser)
            this.meetingsCreatedByUser = this.meetingsCreatedByUser.filter((current: Meeting) => {
              return current.id !== meetingId;
            });
          this.regenerateItems();
        });
      } else {
        void this.utils.manageErrorInResponse(response);
      }
    }
  }

  /**
   * Action when a search is computed with an id
   * @param id to search
   */
  @action async searchWithId(id: string): Promise<void> {
    const response = await this.amphitryonDAO.searchMeetingWithID(id);
    if (response) {
      if (response.ok) {
        return await runInAction(async () => {
          this.searchMeetings = [await response.json()];
        });
      } else {
        return runInAction(() => {
          this.searchMeetings = [];
        });
      }
    }
  }

  /**
   * Action when a search is computed with a filter
   * @param filter to apply
   */
  @action async searchWithFilter(filter: Filter): Promise<void> {
    const response = await this.amphitryonDAO.searchMeeting(filter);
    if (response) {
      if (response.ok) {
        await runInAction(async () => {
          this.searchMeetings = await response.json();
        });
      } else {
        return runInAction(() => {
          this.searchMeetings = [];
        });
      }
    }
  }

  /**
   * Set items in the calendar
   * @param items in the calendard
   */
  @action setItems(items: AgendaItemsMap<Meeting>): void {
    this.items = items;
  }

  /**
   * Generate next 10 days agenda items from a given date
   * @param from date from to generate items
   */
  @action async generateItems(from: Date): Promise<void> {
    await this.loadUserMeetings(startOfDay(from), endOfDay(addDays(from, 10)));
    runInAction(() => {
      this.dateInCalendar = from;
      this.items = this.utils.generateItems(this.userMeetings, from);
    });
  }

  /**
   * Regeneration of calendar items
   */
  @action regenerateItems(): void {
    void this.generateItems(this.dateInCalendar);
  }
}

export default StudentStore;
