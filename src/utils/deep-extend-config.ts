export default function deepExtendConfig(target: any, source: any) {
  for (const key in source) {
    if (target.hasOwnProperty(key)) {
      if (typeof source[key] === 'object') {
        deepExtendConfig(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
}
