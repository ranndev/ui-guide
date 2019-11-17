import * as _UIGuide from '../../src/ui-guide';

declare global {
  interface Window {
    __LIBRARY__: {
      'ui-guide': { default: typeof _UIGuide.default };
    };
  }
}
