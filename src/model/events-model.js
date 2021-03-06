import dayjs from 'dayjs';
import Observer from '../utils/observer.js';
import {getEventDuration, getUpdatedList} from '../utils/utils-common.js';

export default class EventsModel extends Observer {
  constructor() {
    super();
    this._events = [];
    this._offers = [];
    this._destinations = [];
  }

  setData(updateType, [events, offers, destinations]) {
    this._setEvents(events);
    this._setOffers(offers);
    this._setDestinations(destinations);
    this.notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  _setEvents(events) {
    this._events = events.slice();
  }

  getOffers() {
    return this._offers;
  }

  _setOffers(offers) {
    this._offers = offers.slice();
  }

  getDestinations() {
    return this._destinations;
  }

  _setDestinations(destinations) {
    this._destinations = destinations.slice();
  }

  updateEvent(updateType, update) {
    this._events = getUpdatedList(this._events, update);
    this.notify(updateType, update);
  }

  addEvent(updateType, newEvent) {
    this._events.push(newEvent);
    this.notify(updateType, newEvent);
  }

  deleteEvent(updateType, deletedEvent) {
    const index = this._events.findIndex((event) => event.id === deletedEvent.id);
    if (index === -1) {
      throw new Error(`Can't delete unexisting event`);
    }
    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1)
    ];
    this.notify(updateType);
  }

  static adaptEventToClient(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          price: event.base_price,
          date: {
            START: dayjs(event.date_from),
            END: dayjs(event.date_to),
          },
          duration: getEventDuration(dayjs(event.date_to), dayjs(event.date_from)),
          destination: {
            NAME: event.destination.name,
            INFO: event.destination.description,
            PHOTOS: event.destination.pictures,
          },
          isFavorite: event.is_favorite,
        }
    );

    delete adaptedEvent.base_price;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.is_favorite;

    return adaptedEvent;
  }

  static adaptEventToServer(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          "base_price": event.price,
          "date_from": event.date.START.toISOString(),
          "date_to": event.date.END.toISOString(),
          "is_favorite": event.isFavorite,
          "destination": {
            name: event.destination.NAME,
            description: event.destination.INFO,
            pictures: event.destination.PHOTOS,
          },
        }
    );

    delete adaptedEvent.price;
    delete adaptedEvent.date;
    delete adaptedEvent.duration;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }

  static adaptDestinationToClient(destination) {
    return {
      NAME: destination.name,
      INFO: destination.description,
      PHOTOS: destination.pictures,
    };
  }
}
