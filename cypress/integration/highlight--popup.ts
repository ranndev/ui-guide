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
      events: {
        onPopupReady: ({ element }) => {
          element.innerHTML = `
            <div uig-popup-wrapper>
              <span x-arrow></span>
              <div uig-popup-card>Click Me!</div>
            </div>`;
        },
      },
      popper: { placement: 'right' },
      target: '[data-testid="target-1"]',
    });

    cy.contains('Click Me!');
  });

  it('should be able to disable the popup', () => {
    cy.wrap(
      uiguide.highlight({
        popper: false,
        target: '[data-testid="target-2"]',
      }),
    ).then(() => {
      cy.document().then((document) => {
        expect(document.querySelector('[uig-popup]')).to.be.null;
      });
    });
  });
});
