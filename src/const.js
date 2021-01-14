const CANVAS_BAR_HEIGHT = 55;

const eventTypes = [
  `check-in`,
  `sightseeing`,
  `restaurant`,
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`,
];

const destinationsOffline = [
  `Chamonix`,
  `Geneva`,
  `Amsterdam`,
  `Helsinki`,
  `Oslo`,
  `Kopenhagen`,
  `Den Haag`,
  `Rotterdam`,
  `Saint Petersburg`,
  `Moscow`,
  `Sochi`,
  `Tokio`,
  `Kioto`,
  `Nagasaki`,
  `Hiroshima`,
  `Berlin`,
  `Munich`,
  `Frankfurt`,
  `Vien`,
  `Rome`,
  `Naples`,
  `Venice`,
  `Milan`,
  `Monaco`,
  `Paris`,
  `Barcelona`,
  `Valencia`,
  `Madrid`,
];

const INFO_SENTENCE_MAX_NUM = 5;
const OFFERS_MAX_NUM = 5;
const PHOTOS_MAX_NUM = 4;
const OFFER_PRICE = {
  MIN: 10,
  MAX: 100,
};
const EVENT_PRICE = {
  MIN: 10,
  MAX: 500,
};

const UserAction = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`
};

const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`,
};

const Mode = {
  DEFAULT: `default`,
  EDITING: `editing`,
};

const SortType = {
  OFFER: `offers`,
  PRICE: `price`,
  TIME: `duration`,
  EVENT: `event`,
  DAY: `date`,
};

const FilterType = {
  PAST: `Past`,
  FUTURE: `Future`,
  EVERYTHING: `Everything`,
};

const MenuItem = {
  STATS: `Stats`,
  TABLE: `Table`,
};

const StatsParameter = {
  PRICE: `price`,
  DURATION: `duration`,
};

const ENDPOINT = `https://13.ecmascript.pages.academy/big-trip`;
const AUTHORIZATION = `Basic tum3498sdl64df0qx`;

const RequestMethod = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`,
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

const RequestAddress = {
  POINTS: `points`,
  DESTINATIONS: `destinations`,
  OFFERS: `offers`,
};

export {
  INFO_SENTENCE_MAX_NUM,
  OFFERS_MAX_NUM,
  PHOTOS_MAX_NUM,
  OFFER_PRICE,
  EVENT_PRICE,
  UserAction,
  UpdateType,
  Mode,
  SortType,
  FilterType,
  MenuItem,
  CANVAS_BAR_HEIGHT,
  StatsParameter,
  ENDPOINT,
  AUTHORIZATION,
  RequestMethod,
  SuccessHTTPStatusRange,
  RequestAddress,
  eventTypes,
  destinationsOffline
};
