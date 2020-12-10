/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.assign(Object.create(proto), JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CSSBuilder {
  constructor() {
    this.result = '';
    this.order = [];
  }

  element(value) {
    this.result += value;
    this.checkValidation(0);
    return this;
  }

  id(value) {
    this.result += `#${value}`;
    this.checkValidation(1);
    return this;
  }

  class(value) {
    this.result += `.${value}`;
    this.checkValidation(2);
    return this;
  }

  attr(value) {
    this.result += `[${value}]`;
    this.checkValidation(3);
    return this;
  }

  pseudoClass(value) {
    this.result += `:${value}`;
    this.checkValidation(4);
    return this;
  }

  pseudoElement(value) {
    this.result += `::${value}`;
    this.checkValidation(5);
    return this;
  }

  combine(firstSelector, combinator, secondSelector) {
    this.result = `${firstSelector.stringify()} ${combinator} ${secondSelector.result}`;
    return this;
  }

  stringify() {
    return this.result;
  }

  checkCount(value) {
    if (this.order.filter((el) => el === value).length > 1
        && (value === 0 || value === 1 || value === 5)) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
  }

  checkOrder() {
    if (this.order.toString() !== this.order.sort().toString()) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  }

  checkValidation(value) {
    this.order.push(value);
    this.checkCount(value);
    this.checkOrder();
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new CSSBuilder().element(value);
  },

  id(value) {
    return new CSSBuilder().id(value);
  },

  class(value) {
    return new CSSBuilder().class(value);
  },

  attr(value) {
    return new CSSBuilder().attr(value);
  },

  pseudoClass(value) {
    return new CSSBuilder().pseudoClass(value);
  },

  pseudoElement(value) {
    return new CSSBuilder().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new CSSBuilder().combine(selector1, combinator, selector2);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
