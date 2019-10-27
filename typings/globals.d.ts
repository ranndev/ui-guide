import * as _UIGuide from '../src/ui-guide';

declare global {
  const __DEV__: boolean;

  interface Window {
    __LIBRARY__: {
      'ui-guide': { default: typeof _UIGuide.default };
    };
  }
}
