console.clear(),
  (self => {
    const BaseEvent = self && self.UIEvent;

    if (
      !self ||
      !BaseEvent ||
      typeof BaseEvent !== 'function' ||
      typeof BaseEvent.prototype !== 'object'
    )
      return;

    const objects = new WeakMap();
    const primitives = new Map();
    function Property(value, type) {
      if (type) {
        const map = (type !== 'object' && type !== 'function' && primitives) || objects;
        let property = map.get(value);
        if (!property) {
          property = Object.freeze(
            Object.create(Property[type], {
              type: {value: type, enumerable: false},
              [type]: {value, enumerable: false},
            }),
          );
          map.set(value, property);
        }
        return property;
      }
      return Unknown;
    }

    Property.prototype = class {
      get [Symbol.toStringTag]() {
        return `${this.type}`;
      }

      toJSON() {
        const {type, [type]: value} = this;
        return (
          (!type && this) ||
          (type === 'symbol' && `Symbol(${(value && value.description) || ''})`) ||
          (type === 'function' && `${value}`) ||
          (type === 'object' && {
            [`(${(value.constructor || Object).name})`]: Properties(value),
          }) ||
          value
        );
      }
    }.prototype;

    const Unknown = Object.freeze(
      Object.create((Property.unknown = class Unknown extends Property {}.prototype), {
        type: {value: undefined, enumerable: false},
      }),
    );

    const Null = Object.freeze(
      Object.create((Property.null = class Null extends Property {}.prototype), {
        type: {value: 'null', enumerable: false},
        ['null']: {value: null, enumerable: false},
      }),
    );

    const Undefined = Object.freeze(
      Object.create((Property.undefined = class Undefined extends Property {}.prototype), {
        type: {value: 'undefined', enumerable: false},
        ['undefined']: {value: undefined, enumerable: false},
      }),
    );

    Property.string = class String extends Property {}.prototype;
    Property.number = class Number extends Property {}.prototype;
    Property.boolean = class Boolean extends Property {}.prototype;
    Property.bigint = class BigInt extends Property {}.prototype;
    Property.symbol = class Symbol extends Property {}.prototype;
    Property.function = class Function extends Property {}.prototype;
    Property.object = class Object extends Property {}.prototype;

    const Properties = prototype => {
      const properties = Object.create(null);
      for (const [name, descriptor] of Object.entries(
        Object.getOwnPropertyDescriptors(prototype),
      )) {
        if (
          name === 'constructor' &&
          typeof descriptor.value === 'function' &&
          descriptor.value.prototype
        )
          continue;
        let value, type;
        if ('values' in descriptor) {
          type = typeof (value = descriptor.value);
        } else {
          try {
            type = typeof (value = prototype[name]);
          } catch (exception) {
            type = value = undefined;
          }
        }
        properties[name] =
          (!type && Unknown) ||
          (value === null && Null) ||
          (value === undefined && Undefined) ||
          Property(value, type);
      }
      return properties;
    };

    const Edge = Class => {
      const properties = Properties(Class.prototype);
      return Object.create(null, {
        '(properties)': {
          value: properties,
          enumerable: true,
        },
      });
    };

    const base = Edge(BaseEvent);
    const graph = {[BaseEvent.name]: base};
    const classes = {};
    const events = {'(graph)': graph, '(classes)': classes};
    const trees = new Map();
    const ids = new Map();
    const keys = new Set();

    for (const name of Object.getOwnPropertyNames(self)) {
      const value = self[name];
      const constructor = typeof value === 'function' && value.prototype && value;
      let prototype = constructor && constructor.prototype;
      const Event = prototype && prototype instanceof BaseEvent && value;

      if (!Event || Event === BaseEvent) continue;

      classes[name] = Event;

      if (trees.has(Event)) {
        trees.get(Event).names.push(name);
        continue;
      } else {
        const tree = [Event];
        tree.names = [name];
        tree.constructor = constructor;
        tree.prototype = prototype;
        while (prototype && (prototype = Object.getPrototypeOf(prototype)) !== BaseEvent.prototype)
          tree.push(prototype.constructor);
        trees.set(Event, tree);
        let id = name;
        let index = 0;
        while (keys.has(id)) id = `${name}(${++index})`;
        keys.add(id);
        ids.set(Event, id);
        tree.id = id;
      }
    }

    for (const [Event, tree] of trees.entries()) {
      let edge = base;
      for (const Super of [...tree].reverse()) {
        const id = ids.get(Super);
        edge = edge[id] || (edge[id] = Edge(Super));
      }
    }

    try {
      copy(events);
    } catch (exception) {}

    return events;
  })(typeof self === 'object' && self && self.self === self && self);
