const draft = ``;
const HeadingTitle = {
  LIST: `Trip events`,
  MENU: `Switch trip view`,
  FILTER: `Filter events`,
};

const getRadomNum = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getEmptyDataClassName = (data) => data.length === 0 ? `visually-hidden` : ``;

const getUpdatedList = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);
  if (index === -1) {
    return items;
  }
  return [...items.slice(0, index), update, ...items.slice(index + 1)];
};

export {
  draft,
  getRadomNum,
  HeadingTitle,
  getEmptyDataClassName,
  getUpdatedList,
};
