export const Toggle = (matcher => value =>
  ((value !== null && value !== undefined && typeof value !== 'symbol') || undefined) &&
  (value === true ||
    value == true ||
    (value !== false &&
      value != false &&
      (value = matcher.exec(value) || undefined) &&
      !value[2])))(/\b(?:(true|on|yes)|(false|off|no))\b/i);
