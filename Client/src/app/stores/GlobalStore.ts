/**
 * @file    GlobalStore.ts
 * @author  Alexis Allemann & Alexandre Mottier
 * @date    22.03.2021
 * @brief   MobX global application state store
 */

import { action, computed, makeAutoObservable, observable } from 'mobx';
import { createContext } from 'react';
import { Meeting, User, Location, Host, Chat, Message, Filter } from '../models/ApplicationTypes';
import GoogleAuth from '../authentication/GoogleAuth';
import { TokenResponse } from 'expo-app-auth';
import AmphitryonDAO from '../data/AmphitryonDAO';
import Globals from '../context/Globals';
import { mockMeetings } from '../../mock/Meetings';
import { mockChat } from '../../mock/Chat';
import { mockLocations } from '../../mock/Locations';
import { mockHost } from '../../mock/Host';

class Store {
  private amphitryonDAO = AmphitryonDAO.getInstance();
  private googleAuth = GoogleAuth.getInstance();

  @observable theme: 'light' | 'dark' = 'light';
  @observable isLoading = false;
  @observable userToken: TokenResponse | null = null;
  @observable sessionToken: string | null = null;
  @observable authenticatedUser: User | null = null;
  @observable isLoggedIn = false;
  @observable meetingToUpdate: Meeting | null = null;
  @observable meetingsCreatedByUser: Meeting[] = [];
  @observable userMeetings: Meeting[] | null = null;
  @observable chat: Chat | null = null;
  @observable locations: Location[] | null = null;
  @observable locationToDisplay: Location | null = null;
  @observable hostToDisplay: Host | null = null;
  @observable searchMeetings: Meeting[] | null = null;

  /**
   * Instantiation of the store
   */
  constructor() {
    void this.loadTokens();
    makeAutoObservable(this);
  }

  /**
   * Inverting the theme colour
   */
  @action invertTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }

  /**
   * Set if the application is loading
   * @param isLoading if the application is loading
   */
  @action setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  /**
   * Set the user's token
   * @param token user's token
   */
  @action setUserToken(token: TokenResponse | null) {
    this.userToken = token;
  }

  /**
   * Set the authenticated user
   * @param userAuthenticated the authenticated user or null
   */
  @action getAuthenticatedUser(): User | null {
    return this.authenticatedUser;
  }

  /**
   * Set the authenticated user
   * @param userAuthenticated the authenticated user or null
   */
  @action setAuthenticatedUser(userAuthenticated: User | null) {
    this.authenticatedUser = userAuthenticated;
  }

  /**
   * Set if the user is logged in
   * @param isLoggedIn if the user is logged in
   */
  @action setIsLoggedIn(isLoggedIn: boolean) {
    this.isLoggedIn = isLoggedIn;
  }

  /**
   * Loading the user's tokens
   */
  @action async loadTokens(): Promise<void> {
    this.setIsLoading(true);
    const token = await this.googleAuth.getCachedAuthAsync();
    this.userToken = token;
    if (token && token.idToken) {
      const response = await this.amphitryonDAO.connectUser(token.idToken);
      if (response) {
        const sessionToken = response.headers.get(Globals.STRINGS.SESSION_TOKEN_NAME);
        this.sessionToken = sessionToken;
        this.amphitryonDAO.setSessionToken(sessionToken ? sessionToken : '');
        this.setAuthenticatedUser(await response.json());
        this.setIsLoggedIn(true);
      }
    }
    this.setIsLoading(false);
  }

  /**
   * Sign in with Google
   * @returns promise if user is sucessfully signed in
   */
  @action async signInWithGoogle(): Promise<boolean> {
    const token = await this.googleAuth.handleSignInAsync();
    if (token) {
      this.setUserToken(token);
      return true;
    }
    return false;
  }

  /**
   * Action done when the user logs out
   * @param user to sign out
   * @returns promise when sign out is completed
   */
  @action async signOutWithGoogle(): Promise<void> {
    this.setIsLoading(true);
    await this.googleAuth.handleSignOutAsync(this.userToken);
    this.setAuthenticatedUser(null);
    this.setIsLoggedIn(false);
    this.setIsLoading(false);
  }

  /**
   * Create a new user
   * @param user to create
   */
  @action async signUp(user: User): Promise<void> {
    this.setIsLoading(true);
    if (this.userToken?.idToken) {
      const response = await this.amphitryonDAO.createUser(this.userToken.idToken, user);
      if (response) {
        this.sessionToken = response.headers.get(Globals.STRINGS.SESSION_TOKEN_NAME);
        this.setAuthenticatedUser(user);
        this.setIsLoggedIn(true);
      }
    }
    this.setIsLoading(false);
  }

  /**
   * Sign in method
   */
  @action async signIn(): Promise<void> {
    this.setIsLoading(true);
    const loggedIn = await this.signInWithGoogle();
    if (loggedIn && this.userToken && this.userToken.idToken) {
      const response = await this.amphitryonDAO.connectUser(this.userToken?.idToken);
      if (response) {
        this.sessionToken = response.headers.get(Globals.STRINGS.SESSION_TOKEN_NAME);
        this.setAuthenticatedUser(await response.json());
      }
    }
    this.setIsLoading(false);
  }

  /**
   * Set meeting to update
   * @param meeting réunion à mettre à jour
   */
  @action setMeetingToUpdate(meeting: Meeting | null): void {
    this.meetingToUpdate = meeting;
  }

  /**
   * Get the meeting to create or edit default values
   * @returns the meeting to create or edit default values
   */
  @computed getMeetingDefaultValues(): Meeting {
    if (this.meetingToUpdate !== null) {
      return this.meetingToUpdate;
    } else
      return {
        id: '0',
        name: '',
        description: '',
        tags: [],
        locationID: '',
        locationName: '',
        maxPeople: 0,
        nbPeople: 0,
        startDate: '2021-04-15T15:00:00',
        endDate: '2021-04-15T16:00:00',
        ownerID: '',
        chatId: '',
        isPrivate: false,
      };
  }

  /**
   * Retrieve meetings created by user
   */
  @action async loadMeetingsCreatedByUser() {
    // const response = await this.amphitryonDAO.loadMeetingCreatedByUser();
    // if (response) {
    //   if (response.ok) {
    //     this.meetingsCreatedByUser = await response.json();
    //   }
    // }

    // TO DELETE
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.meetingsCreatedByUser = mockMeetings;
  }

  /**
   * Retrieve meetings where user is member of between two given dates
   * @param startDate from date
   * @param endDate to date
   */
  @action async loadUserMeetings(startDate: Date, endDate: Date) {
    // const response = await this.amphitryonDAO.loadUserMeetings(startDate, endDate);
    // if (response) {
    //   if (response.ok) {
    //     this.meetingsCreatedByUser = await response.json();
    //   }
    // }

    // TO DELETE
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.userMeetings = mockMeetings;
  }

  /**
   * Join a meeting
   * @param meeting to join
   */
  @action async joinMeeting(meeting: Meeting) {
    // const response = await this.amphitryonDAO.joinMeeting(meeting.id);
    // if (response) {
    //   if (response.ok) {
    //     if (this.userMeetings) {
    //       this.userMeetings.push(meeting);
    //     }
    //   }
    // }

    // TO DELETE
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (this.userMeetings) {
      this.userMeetings.push(meeting);
    }
  }

  /**
   * User leaves a meeting
   * @param meeting to leave
   */
  @action async leaveMeeting(meeting: Meeting) {
    // const response = await this.amphitryonDAO.leaveMeeting(meeting.id);
    // if (response) {
    //   if (response.ok) {
    //     if (this.userMeetings) {
    //       this.userMeetings = this.userMeetings?.filter((current: Meeting) => {
    //         return current.id !== current.id;
    //       });
    //     }
    //   }
    // }

    // TO DELETE
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (this.userMeetings) {
      this.userMeetings = this.userMeetings?.filter((current: Meeting) => {
        return meeting.id !== current.id;
      });
    }
  }

  /**
   * Load chat data
   * @param chatId to load
   */
  @action async loadChat(chatId: string) {
    // const response = await this.amphitryonDAO.loadMessages(chatId);
    // if (response) {
    //   if (response.ok) {
    //     this.chat = { id: chatId, messages: await response.json() };
    //   }
    // }

    // TO DELETE
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.chat = mockChat;
  }

  /**
   * Send a new message in a chat
   * @param chatId where to send the message
   * @param message to send
   */
  @action async sendMessage(chatId: string, message: Message) {
    // const response = await this.amphitryonDAO.sendMessage(chatId, message);
    // if (response) {
    //   if (response.ok) {
    //     this.chat?.messages.push(message);
    //   }
    // }

    // TO DELETE
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.chat?.messages.push(message);
  }

  /**
   * Load locations available between dates
   * @param startDate from date
   * @param endDate to date
   */
  @action async loadLocations(startDate: Date, endDate: Date) {
    // const response = await this.amphitryonDAO.getAllLocations(startDate, endDate);
    // if (response) {
    //   if (response.ok) {
    //     this.locations = await response.json();
    //   }
    // }

    // TO DELETE
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.locations = mockLocations;
  }

  /**
   * Load location details
   * @param locationId location id
   */
  @action async loadLocationToDisplay(locationId: string) {
    // const location = await this.loadLocation(locationId);
    // if (location) this.locationToDisplay = location;

    // TO DELETE
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.locationToDisplay = await this.loadLocation(locationId);
  }

  async loadLocation(locationId: string): Promise<Location | null> {
    // const response = await this.amphitryonDAO.getLocationDetails(locationId);
    // if (response) {
    //   if (response.ok) {
    //     return await response.json();
    //   }
    // }
    // return null;

    // TO DELETE
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockLocations[0];
  }

  /**
   * Load host details
   * @param hostId host id
   */
  @action async loadHost(hostId: string) {
    // const response = await this.amphitryonDAO.getHostDetails(hostId);
    // if (response) {
    //   if (response.ok) {
    //     this.locationToDisplay = await response.json();
    //   }
    // }

    // TO DELETE
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.hostToDisplay = mockHost;
  }

  /**
   * Action when a meeting is created
   * @param meeting to create
   */
  @action async createMeeting(meeting: Meeting) {
    // const response = await this.amphitryonDAO.createMeeting(meeting);
    // if (response) {
    //   if (response.ok) {
    //     this.userMeetings?.push(meeting);
    //     this.meetingsCreatedByUser?.push(meeting);
    //   }
    // }

    // TO DELETE
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.userMeetings?.push(meeting);
    this.meetingsCreatedByUser?.push(meeting);
  }

  /**
   * Action when a meeting is updated
   * @param meeting to update
   */
  @action async updateMeeting(meeting: Meeting) {
    // const response = await this.amphitryonDAO.updateMeeting(meeting);
    // if (response) {
    //   if (response.ok) {
    //     if (this.userMeetings) {
    //       const index = this.userMeetings.findIndex((current: Meeting) => {
    //         return current.id == meeting.id;
    //       });
    //       if (index) this.userMeetings[index] = meeting;
    //     }
    //     if (this.meetingsCreatedByUser) {
    //       const index = this.meetingsCreatedByUser.findIndex((current: Meeting) => {
    //         return current.id == meeting.id;
    //       });
    //       if (index) this.meetingsCreatedByUser[index] = meeting;
    //     }
    //   }
    // }

    // TO DELETE
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (this.userMeetings) {
      const index = this.userMeetings.findIndex((current: Meeting) => {
        return current.id === meeting.id;
      });
      if (index) this.userMeetings[index] = meeting;
    }
    if (this.meetingsCreatedByUser) {
      const index = this.meetingsCreatedByUser.findIndex((current: Meeting) => {
        return current.id === meeting.id;
      });
      if (index) this.meetingsCreatedByUser[index] = meeting;
    }
  }

  /**
   * Action when a meeting is deleted
   * @param meetingId to delete
   */
  @action async deleteMeeting(meetingId: string) {
    // const response = await this.amphitryonDAO.deleteMeeting(meetingId);
    // if (response) {
    //   if (response.ok) {
    //     if (this.userMeetings)
    //       this.userMeetings = this.userMeetings.filter((current: Meeting) => {
    //         return current.id !== meetingId;
    //       });
    //     if (this.meetingsCreatedByUser)
    //       this.meetingsCreatedByUser = this.meetingsCreatedByUser.filter((current: Meeting) => {
    //         return current.id !== meetingId;
    //       });
    //   }
    // }
    // TO DELETE
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (this.userMeetings)
      this.userMeetings = this.userMeetings.filter((current: Meeting) => {
        return current.id !== meetingId;
      });
    if (this.meetingsCreatedByUser)
      this.meetingsCreatedByUser = this.meetingsCreatedByUser.filter((current: Meeting) => {
        return current.id !== meetingId;
      });
  }

  /**
   * Action when a search is computed with an id
   * @param id to search
   */
  @action async searchWithId(id: string) {
    // const response = await this.amphitryonDAO.searchMeetingWithID(id);
    // if (response) {
    //   if (response.ok) {
    //     this.searchMeetings = await response.json();
    //   }
    // }

    // TO DELETE
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.searchMeetings = [mockMeetings[0]];
  }

  /**
   * Action when a search is computed with a filter
   * @param filter to apply
   */
  @action async searchWithFilter(filter: Filter) {
    // const response = await this.amphitryonDAO.searchMeeting(filter);
    // if (response) {
    //   if (response.ok) {
    //     this.searchMeetings = await response.json();
    //   }
    // }

    // TO DELETE
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.searchMeetings = mockMeetings;
  }
}

export default createContext(new Store());
