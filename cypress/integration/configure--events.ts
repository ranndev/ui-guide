import UIGuide from '../../src/ui-guide';

describe('configure - events', () => {
  let uiguide: typeof UIGuide;

  before(() => {
    cy.visit('/').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  it('should able to set the global event listeners', () => {
    const onElementsReady = cy.stub();
    const onTargetElementQueried = cy.stub();

    uiguide.configure({
      events: {
        onElementsReady,
        onTargetElementQueried,
      },
    });

    cy.wrap(uiguide.highlight('[data-testid="target-1"]')).then(() => {
      expect(onElementsReady).to.be.called;
      expect(onTargetElementQueried).to.be.called;
      expect(onElementsReady).to.be.calledAfter(onTargetElementQueried);
    });
  });
});
