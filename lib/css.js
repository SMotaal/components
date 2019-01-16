import {raw} from './templates.js';

export const css = (options => {
  options = {...options};
  const prefixed = [...options.prefixed];
  const prefixes = {'[default]': undefined, ...options.prefixes};
  const defaultPrefix = (prefixes['[default]'] = Object.freeze(
    prefixes['[default]'] || ['-webkit', '-moz'],
  ));
  for (const prefix of prefixed) {
    prefixes[prefix] || (prefixes[prefix] = prefixes['[default]']);
  }
  Object.freeze(prefixes);

  // console.log({options, prefixed, prefixes});

  const NOTHING = raw`-\/\*\*\/-`;
  const COMMENT = raw`\/\*[^]*?\*\/`;
  // const SEGMENT = raw`\s*\b({{property}})\b\s*:\s*[^]+?;`
  const SEGMENT = raw`\s*\b({{property}})\b\s*:\s*([^]+?)\s*;`
    .replace('{{property}}', prefixed.join('|') || NOTHING)
    .replace(/{{.*?}}/g, NOTHING);
  const IGNORED = raw`.*?`;
  const CSS = raw`${COMMENT}|(${SEGMENT})|${IGNORED}`;
  const matcher = new RegExp(CSS, 'g');
  // /\/\*[^]*?\*\/|(\s*\b({{property}})\b\s*:\s*[^]+?;)|.*?/.source
  // .replace('{{property}}', prefixed.join('|') || NOTHING)
  // .replace(/{{.*?}}/g, NOTHING),
  // 'g',
  // );
  // const replacer = (match, segment, property, ...rest) => {
  const replacer = (
    match,
    segment,
    property,
    value,
    // ...rest
  ) => {
    let head, tail, segments, lhs, rhs;
    if (segment) {
      // console.log({match, segment, property, rest});
      if (property) {
        segment = segment.trim();
        [head, tail] = match.split(segment);
        // segments = [segment];
        const valuePrefixes = prefixes[`${property}:${value}`];
        const propertyPrefixes = prefixes[property];
        if (valuePrefixes && valuePrefixes.length) {
          segments = [];
          [lhs, rhs] = segment.split(/\s*:\s*/);
          for (const prefix of valuePrefixes) {
            segments.push(
              `${head}${(propertyPrefixes.includes(prefix) && `${prefix}-`) ||
                ''}${lhs}: ${prefix}-${rhs}${tail}`,
            );
          }
          segments.push(match);
        } else if (propertyPrefixes && propertyPrefixes.length) {
          segments = [match];
          for (const prefix of propertyPrefixes) {
            segments.push(`${head}${prefix}-${segment}${tail}`);
          }
        } else {
          return match;
        }
        console.log(
          '%o: %o',
          property,
          value,
          {property: propertyPrefixes, value: valuePrefixes},
          ...segments,
        );
        // return `${head}${segments.join(' ')}${tail}`;
        return segments.join('');
      }
    }
    return match;
  };

  const RAW_INDENT = /(?:\\t|[\t ]+)*$/;
  const RAW_TABS = /\\t/g;
  const TAB = '\t';
  const STRING_INDENT = /^\n?([\t ]*)/;

  /** @type {(rawString: string, value: string) => string} */
  const reindent = (rawString, value) => {
    const [, stringIndent] = (value && STRING_INDENT.exec(value)) || '';
    if (stringIndent) {
      const matcher =
        reindent[stringIndent] ||
        (reindent[stringIndent] = new RegExp(raw`^${stringIndent}`, 'mg'));
      const [rawIndent] = RAW_INDENT.exec(rawString);
      const replacer = rawIndent.replace(RAW_TABS, TAB);
      const newValue = value.replace(matcher, replacer);
      // console.log('%o', {
      //   string: {rawString, rawIndent, matcher},
      //   value: {value, stringIndent, replacer, newValue},
      // });
      return newValue;
    }
    return value;
  };

  /** @type {TaggedTemplate<string>} */
  const css = (strings, ...values) => {
    const rawStrings = strings.raw;
    for (let i = 0, n = rawStrings.length; n--; i++) {
      const rawString = rawStrings[i];
      const value = values[i];
      if (value && typeof value === 'string') {
        values[i] = reindent(rawString, value);
      }
    }
    const source = Reflect.apply(raw, null, [strings, ...values]);
    // const source = Reflect.apply(raw, null, args);
    const style = source.replace(matcher, replacer);
    // console.log({style});
    return style;
  };

  Object.defineProperty(css, 'prefixes', {value: Object.freeze(prefixes)});
  return css;
})({
  prefixes: {'backdrop-filter': ['-webkit'], position: [], 'position:sticky': ['-webkit']},
  prefixed: ['user-select', 'backdrop-filter', 'position'],
});
