import {humanizeDate} from '../utils/utils-event.js';
import {draft} from '../utils/utils-render.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';
import he from 'he';
import {capitalizeString, getEventDuration} from '../utils/utils-common.js';
import {eventTypes} from '../const.js';
import {destinationsOffline} from '../const.js';

const createEventEditTemplate = (data, offerItem, destinationsFromServer) => {
  const {
    type,
    destination,
    price,
    date,
    offers,
    eventHasInfo,
    eventHasPhotos,
    isDeleting,
    isDisabled,
    isSaving,
    isNewEvent,
  } = data;
  const destinationsNames = destinationsFromServer.length !== 0 ?
    destinationsFromServer.map((item) => item.NAME) : destinationsOffline;
  const eventDate = {
    START: humanizeDate(`DD/MM/YY HH:mm`, date.START),
    END: humanizeDate(`DD/MM/YY HH:mm`, date.END)
  };
  const disabledAttribute = isDisabled ? `disabled` : ``;
  const SaveBtnLabelName = isSaving ? `Saving...` : `Save`;
  const deleteBtnLabelName = isDeleting ? `Deleting...` : `Delete`;
  const cancelBtnLabelName = `Cancel`;

  const createEventTypeListTemplate = () => {
    return eventTypes.reduce((finalTemplate, currentType) => {
      const currentTypeNameCapitalized = capitalizeString(currentType);
      const checkedAttribute = currentType === type ? `checked` : ``;
      const currentTemplate = `
        <div class="event__type-item">
          <input id="event-type-${currentType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${currentType}" ${checkedAttribute} ${disabledAttribute}>
          <label class="event__type-label  event__type-label--${currentType}" for="event-type-${currentType}-1">${currentTypeNameCapitalized}</label>
        </div>
      `;
      return `${currentTemplate}${finalTemplate}`;
    }, draft);
  };

  const createDestinationOptionsTemplate = () => {
    return destinationsNames.reduce((finalTemplate, currentOption) => {
      const currentTemplate = `<option value="${currentOption}"></option>`;
      return `${currentTemplate}${finalTemplate}`;
    }, draft);
  };


  const createEventOffersSectionTemplate = () => {
    if (offerItem.offers.length === 0) {
      return ``;
    }
    const renderOffers = () => {
      return offerItem.offers.reduce((finalTemplate, currentOffer, currentOfferIndex) => {
        const getCheckedOfferAttribute = () => offers.some((eventOffer) => eventOffer.title === currentOffer.title) ? `checked` : ``;
        const currentTemplate = `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${currentOfferIndex}" type="checkbox" name="event-offer-${type}" ${getCheckedOfferAttribute()} ${disabledAttribute}>
            <label class="event__offer-label" for="event-offer-${type}-${currentOfferIndex}">
              <span class="event__offer-title">${currentOffer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${currentOffer.price}</span>
            </label>
          </div>
        `;
        return `${currentTemplate}${finalTemplate}`;
      }, draft);
    };
    return `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${renderOffers()}
        </div>
      </section>
    `;
  };

  const createEventDestinationSectionTemplate = () => {
    if (!eventHasInfo) {
      return ``;
    }
    const renderPhotos = () => {
      return destination.PHOTOS.reduce((finalTemplate, currentPhoto) => {
        const currentTemplate = `<img class="event__photo" src="${currentPhoto.src}" alt="${currentPhoto.description}"></img>`;
        return `${currentTemplate}${finalTemplate}`;
      }, draft);
    };
    const renderPhotosContainer = () => {
      if (!eventHasPhotos) {
        return ``;
      }
      return `
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${renderPhotos()}
          </div>
        </div>
      `;
    };
    return `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.INFO}</p>
        ${renderPhotosContainer()}
      </section>
    `;
  };

  const createEventDetailsSectionTemplate = () => {
    return `
      <section class="event__details">
        ${createEventOffersSectionTemplate()}
        ${createEventDestinationSectionTemplate()}
      </section>
    `;
  };


  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${disabledAttribute}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createEventTypeListTemplate()}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination.NAME)}" list="destination-list-1" ${disabledAttribute}>
            <datalist id="destination-list-1">
              ${createDestinationOptionsTemplate()}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${he.encode(eventDate.START)}" ${disabledAttribute}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${he.encode(eventDate.END)}" ${disabledAttribute}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}" ${disabledAttribute}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${disabledAttribute}>
            ${SaveBtnLabelName}
          </button>
          <button class="event__reset-btn" type="reset" ${disabledAttribute}>
            ${isNewEvent ? cancelBtnLabelName : deleteBtnLabelName}
          </button>
          <button class="event__rollup-btn" type="button" ${disabledAttribute}>
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        ${createEventDetailsSectionTemplate()}
      </form>
    </li>
  `;
};

export default class EventEdit extends SmartView {
  constructor(event, offers, destinations) {
    super();
    this._event = JSON.parse(JSON.stringify(event));
    this._data = EventEdit.parseEventToData(event);
    this._dateStartPicker = null;
    this._dateEndPicker = null;

    this._offers = offers;
    this._destinations = destinations;

    this._formCloseHandler = this._formCloseHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._eventDestinationChangeHandler = this._eventDestinationChangeHandler.bind(this);
    this._eventPriceChangeHandler = this._eventPriceChangeHandler.bind(this);
    this._eventOffersToggleHandler = this._eventOffersToggleHandler.bind(this);
    this._dateStartChangeHandler = this._dateStartChangeHandler.bind(this);
    this._dateEndChangeHandler = this._dateEndChangeHandler.bind(this);
    this._formDeleteHandler = this._formDeleteHandler.bind(this);

    this._getEventOffersItem();
    this._setInnerHandlers();
    this._setStartDatePicker();
    this._setEndDatePicker();
  }
  getTemplate() {
    return createEventEditTemplate(this._data, this._offersItem, this._destinations);
  }
  _formCloseHandler() {
    if (typeof this._callback.close === `function`) {
      this._callback.close();
    }
  }
  _formSubmitHandler(evt) {
    evt.preventDefault();
    if (typeof this._callback.formSubmit === `function`) {
      this._callback.formSubmit(EventEdit.parseDataToEvent(this._data));
    }
  }
  _formDeleteHandler() {
    if (typeof this._callback.formDelete === `function`) {
      this._callback.formDelete(EventEdit.parseDataToEvent(this._data));
    }
  }

  setFormCloseHandler(callback) {
    this._callback.close = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._formCloseHandler);
  }
  removeFormCloseHandler() {
    this.getElement().querySelector(`.event__rollup-btn`).removeEventListener(`click`, this._formCloseHandler);
  }
  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`.event--edit`).addEventListener(`submit`, this._formSubmitHandler);
  }
  removeFormSubmitHandler() {
    this.getElement().querySelector(`.event--edit`).removeEventListener(`submit`, this._formSubmitHandler);
  }
  setFormDeleteHandler(callback) {
    this._callback.formDelete = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteHandler);
  }
  removeFormDeleteHandler() {
    this.getElement().querySelector(`.event__reset-btn`).removeEventListener(`click`, this._formDeleteHandler);
  }

  _getEventOffersItem() {
    this._offersItem = this._offers.find((offer) => offer.type === this._data.type);
    return this._offersItem;
  }

  _setStartDatePicker() {
    if (this._dateStartPicker) {
      this._dateStartPicker.destroy();
      this._dateStartPicker = null;
    }
    this._dateStartPicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          enableTime: true,
          dateFormat: `d/m/y H:i`,
          altFormat: `d/m/y H:i`,
          defaultDate: `${this._data.date.START}`,
          onChange: this._dateStartChangeHandler,
        }
    );
  }

  _setEndDatePicker() {
    if (this._dateEndPicker) {
      this._dateEndPicker.destroy();
      this._dateEndPicker = null;
    }
    this._dateEndPicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          enableTime: true,
          dateFormat: `d/m/y H:i`,
          altFormat: `d/m/y H:i`,
          defaultDate: `${this._data.duration < 0 ? this._data.date.START : this._data.date.END}`,
          disable: [
            (date) => {
              const dateToCheck = dayjs(this._data.date.START).hour(0).minute(0).second(0).millisecond(0);
              return date < dateToCheck;
            }
          ],
          onChange: this._dateEndChangeHandler,
        }
    );
  }

  _dateStartChangeHandler([selectedDate]) {
    const setNewStartDate = () => {
      if (selectedDate > this._data.date.END) {
        this._data.date.END = dayjs(selectedDate);
      }
      this._data.date.START = dayjs(selectedDate);
      return this._data.date;
    };
    this.updateData(
        {
          date: setNewStartDate(),
          duration: getEventDuration(this._data.date.END, this._data.date.START)
        },
        true
    );
    this._setEndDatePicker();
  }

  _dateEndChangeHandler([selectedDate]) {
    const setNewEndDate = () => {
      this._data.date.END = dayjs(selectedDate);
      return this._data.date;
    };
    this.updateData(
        {
          date: setNewEndDate(),
          duration: getEventDuration(this._data.date.END, this._data.date.START)
        },
        true
    );
  }

  _checkPriceInputValidity(evt) {
    const priceInputRegExp = /^\d+$/;
    evt.target.reportValidity();
    if (evt.target.value.length === 0) {
      evt.target.setCustomValidity(`Please fill in event price!`);
    } else if (!priceInputRegExp.test(evt.target.value)) {
      evt.target.setCustomValidity(`Digits only!`);
    } else {
      evt.target.setCustomValidity(``);
    }
  }

  _eventTypeChangeHandler(evt) {
    this.updateData({
      type: evt.target.value,
      offers: this._clearOffersList(),
    }, true);
    this._getEventOffersItem();
    this.updateElement();
  }

  _eventDestinationChangeHandler(evt) {
    this._changeDestination(evt);
  }

  _eventPriceChangeHandler(evt) {
    this.updateData({price: parseInt(evt.target.value, 10)}, true);
    this._checkPriceInputValidity(evt);
  }

  _eventOffersToggleHandler(evt) {
    this.updateData({offers: this._updateOffersList(evt)}, true);
  }

  _clearOffersList() {
    this._data.offers = [];
    return this._data.offers;
  }

  _updateOffersList(evt) {
    const selectedOfferIndex = parseInt(evt.target.id.substring(evt.target.id.length - 1), 10);
    const offerToAdd = this._offersItem.offers[selectedOfferIndex];
    if (this._data.offers.some((offer) => offer.title === offerToAdd.title)) {
      const offerIndex = this._data.offers.findIndex((offer) => offer.title === offerToAdd.title);
      this._data.offers.splice(offerIndex, 1);
      return this._data.offers;
    } else {
      this._data.offers.push(offerToAdd);
      return this._data.offers;
    }
  }

  _changeDestination(evt) {
    if (!this._destinations.some((destination) => destination.NAME === evt.target.value)) {
      evt.target.setCustomValidity(`Please choose specified destination from list!`);
      evt.target.reportValidity();
    } else {
      evt.target.setCustomValidity(``);
      const getNewDestination = () => {
        const newDestination = this._destinations.find((destination) => destination.NAME === evt.target.value);
        return newDestination;
      };
      this.updateData({destination: getNewDestination()}, true);
      this._data = EventEdit.parseEventToData(this._data);
      this.updateElement();
    }
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-group`).addEventListener(`change`, this._eventTypeChangeHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._eventDestinationChangeHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._eventPriceChangeHandler);
    if (this._offersItem.offers.length !== 0) {
      this.getElement().querySelector(`.event__available-offers`).addEventListener(`change`, this._eventOffersToggleHandler);
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setStartDatePicker();
    this._setEndDatePicker();
    this.setFormCloseHandler(this._callback.close);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormDeleteHandler(this._callback.formDelete);
  }

  static parseEventToData(event) {
    return Object.assign(
        {},
        event,
        {
          eventHasInfo: event.destination.INFO.length !== 0,
          eventHasPhotos: event.destination.PHOTOS.length !== 0,
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
          isNewEvent: false,
        });
  }

  static parseDataToEvent(data) {
    data = Object.assign(
        {
          duration: getEventDuration(data.date.END, data.date.START)
        },
        data
    );
    delete data.eventHasInfo;
    delete data.eventHasPhotos;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;
    delete data.isNewEvent;

    return data;
  }

  reset() {
    this.updateData(EventEdit.parseEventToData(this._event));
  }

  removeElement() {
    super.removeElement();

    if (this._dateStartPicker || this._dateEndPicker) {
      this._dateStartPicker.destroy();
      this._dateStartPicker = null;
      this._dateEndPicker.destroy();
      this._dateEndPicker = null;
    }
  }
}
