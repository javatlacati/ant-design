export function spyElementPrototypes(Element: any, properties: any) {
  const propNames = Object.keys(properties);
  const originDescriptors: any = {};

  propNames.forEach(propName => {
    const originDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, propName)!;
    originDescriptors[propName] = originDescriptor;

    const spyProp = properties[propName];

    if (typeof spyProp === 'function') {
      // If is a function
      Element.prototype[propName] = function spyFunc(...args: any) {
        return spyProp.call(this, originDescriptor, ...args);
      };
    } else {
      // Otherwise tread as a property
      Object.defineProperty(Element.prototype, propName, {
        ...spyProp,
        set(value) {
          if (spyProp.set) {
            return spyProp.set.call(this, originDescriptor, value);
          }
          // @ts-ignore
          return originDescriptor.set(value);
        },
        get() {
          if (spyProp.get) {
            return spyProp.get.call(this, originDescriptor);
          }
          // @ts-ignore
          return originDescriptor.get();
        },
      });
    }
  });

  return {
    mockRestore() {
      propNames.forEach((propName: string) => {
        const originDescriptor = originDescriptors[propName];
        if (typeof originDescriptor === 'function') {
          Element.prototype[propName] = originDescriptor;
        } else {
          Object.defineProperty(Element.prototype, propName, originDescriptor);
        }
      });
    },
  };
}

export function spyElementPrototype(Element: any, propName: string, property: any) {
  return spyElementPrototypes(Element, {
    [propName]: property,
  });
}
