import UIGuide from '../../src/ui-guide';

describe('configure - events', () => {
  let uiguide: typeof UIGuide;

  before(() => {
    cy.visit('/').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  it('should able to set the global event listeners', () => {
    const onHighlightReady = cy.stub();
    const onPopupReady = cy.stub();
    const onTargetFound = cy.stub();

    uiguide.configure({
      events: {
        onHighlightReady,
        onPopupReady,
        onTargetFound,
      },
    });

    cy.wrap(uiguide.highlight('[data-testid="target-1"]')).then(() => {
      expect(onTargetFound).to.be.called;
      expect(onHighlightReady).to.be.called;
      expect(onPopupReady).to.be.called;
    });
  });
});
