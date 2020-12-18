import Abstract from './absract.js';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);
    this.restoreHandlers();
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }
    this._data = Object.assign({}, this._data, update);
    if (justDataUpdating) {
      return;
    }
    this.updateElement();
  }
}