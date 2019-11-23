import UIGuide from '../../src/ui-guide';

describe('highlight - Popup', () => {
  let uiguide: typeof UIGuide;

  before(() => {
    cy.visit('/').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  it('should resolve the highlighted element and unhighlight function', () => {
    uiguide.highlight({
      element: '[data-testid="target-1"]',
      events: {
        onElementsReady: (elements) => {
          if (!elements.popup) return;

          elements.popup.innerHTML = `
            <span x-arrow></span>
            <div uig-popup-card>Click Me!</div>
          `;
        },
      },
    });

    cy.contains('Click Me!');
  });
});
