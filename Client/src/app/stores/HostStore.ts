/**
 * @file    HostStore.ts
 * @author  Alexis Allemann & Alexandre Mottier
 * @date    29.04.2021
 * @brief   Host store
 */

import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { Meeting, Location } from '../models/ApplicationTypes';
import AmphitryonDAO from '../data/AmphitryonDAO';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { AgendaItemsMap } from 'react-native-calendars';
import { Alert } from 'react-native';
import Strings from '../context/Strings';
import Utils from '../utils/Utils';

class HostStore {
  private static instance: HostStore;
  private amphitryonDAO = AmphitryonDAO.getInstance();
  private dateInCalendar = new Date();
  private utils = Utils.getInstance();

  @observable hostLocations: Location[] = [];
  @observable meetingsLocatedAtHostLocations: Meeting[] = [];
  @observable items: AgendaItemsMap<Meeting> | null = null;
  @observable locationToUpdate: Location | null = null;

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
  public static getInstance(): HostStore {
    if (!HostStore.instance) this.instance = new HostStore();
    return this.instance;
  }

  /**
   * Retrieve user data from API
   */
  @action async loadUserData(): Promise<void> {
    await this.loadLocationsCreatedByHost();
    await this.generateItems(new Date());
  }

  /**
   * Retrieve locations created by host
   */
  @action async loadLocationsCreatedByHost(): Promise<void> {
    const response = await this.amphitryonDAO.getHostLocations();
    if (response) {
      if (response.ok) {
        const locations = await response.json();
        runInAction(() => {
          this.hostLocations = locations;
        });
      } else {
        void this.utils.manageErrorInResponse(response);
      }
    }
  }

  /**
   * Retrieve meetings located at host locations
   * @param startDate from date
   * @param endDate to date
   */
  @action async loadMeetingsLocatedAtHostLocations(startDate: Date, endDate: Date): Promise<void> {
    const response = await this.amphitryonDAO.getReservations(startDate, endDate);
    if (response) {
      if (response.ok) {
        await runInAction(async () => {
          this.meetingsLocatedAtHostLocations = await response.json();
        });
      } else {
        void this.utils.manageErrorInResponse(response);
      }
    }
  }

  /**
   * Action when a location is updated
   * @param location to update
   */
  @action async updateLocation(location: Location): Promise<void> {
    const response = await this.amphitryonDAO.updateLocation(location);
    if (response) {
      if (response.ok) {
        runInAction(() => {
          if (this.hostLocations) {
            const index = this.hostLocations.findIndex((current: Location) => {
              return current.id == location.id;
            });
            if (index) this.hostLocations[index] = location;
          }
        });
      } else {
        void this.utils.manageErrorInResponse(response);
      }
    }
  }

  /**
   * Action when a location is created
   * @param location to create
   */
  @action async createLocation(location: Location): Promise<void> {
    const response = await this.amphitryonDAO.createLocation(location);
    if (response) {
      if (response.ok) {
        const locationWithId = await response.json();
        void runInAction(() => {
          this.hostLocations.push(locationWithId);
          Alert.alert(Strings.SAVED, Strings.LOCATION_CREATED);
        });
      } else {
        void this.utils.manageErrorInResponse(response);
      }
    }
  }

  /**
   * Action when a location is deleted
   * @param location to delete
   */
  @action async deleteLocation(locationId: string): Promise<void> {
    const response = await this.amphitryonDAO.deleteLocation(locationId);
    if (response) {
      if (response.ok) {
        runInAction(() => {
          if (this.hostLocations)
            this.hostLocations = this.hostLocations.filter((current: Location) => {
              return current.id !== locationId;
            });
          this.regenerateItems();
        });
      } else {
        void this.utils.manageErrorInResponse(response);
      }
    }
  }

  /**
   * Set location to update
   * @param location lieu à mettre à jour
   */
  @action setLocationToUpdate(location: Location | null): void {
    this.locationToUpdate = location;
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
    await this.loadMeetingsLocatedAtHostLocations(startOfDay(from), endOfDay(addDays(from, 10)));
    runInAction(() => {
      this.dateInCalendar = from;
      this.items = this.utils.generateItems(this.meetingsLocatedAtHostLocations, from);
    });
  }

  /**
   * Regeneration of calendar items
   */
  @action regenerateItems(): void {
    void this.generateItems(this.dateInCalendar);
  }
}

export default HostStore;
