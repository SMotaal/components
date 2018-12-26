
**This works as of 2018-12-01**:

```js
((element = $0) => {
  const scope = {};
  // const root = scope.root = element.getRootNode();
  const attributes = element.attributes;
  let cl = 1;
  const _class = (scope['[class]'] = {value: element.className || (element.className = `cl${cl++}`)});
  _class.instances = [
    ...new Set(
      (_class.values = [
        (attributes.class.x = attributes.class),
        attributes.class.x,
        (element.setAttribute('class', `${element.getAttribute('class') || ''} cl${cl++}`), attributes.class),
        attributes.class.x,
      ]),
    ),
  ];

  return scope;
})();
```
