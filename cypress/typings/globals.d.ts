import * as _UIGuide from '../../src/ui-guide';

declare global {
  // tslint:disable-next-line: interface-name
  interface Window {
    __LIBRARY__: {
      'ui-guide': { default: typeof _UIGuide.default };
    };
  }
}
