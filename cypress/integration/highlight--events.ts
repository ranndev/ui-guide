import UIGuide from '../../src/ui-guide';

describe('highlight - Events', () => {
  let uiguide: typeof UIGuide;

  before(() => {
    cy.visit('/').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  it('should invoke the event listeners', () => {
    const defaultOnElementsReady = cy.stub();
    const defaultOnTargetElementQueried = cy.stub();
    const onElementsReady = cy.stub();
    const onElementsUpdate = cy.stub();
    const onTargetElementQueried = cy.stub();

    uiguide.configure({
      events: {
        onElementsReady: defaultOnElementsReady,
        onTargetElementQueried: defaultOnTargetElementQueried,
      },
    });

    uiguide.highlight({
      element: '[data-testid="target-1"]',
      events: {
        onElementsReady,
        onElementsUpdate,
        onTargetElementQueried,
      },
    });

    cy.get('[uig-elements-backdrop][uig-markers-show]')
      .wrap(
        new Promise((resolve) => {
          const interval = setInterval(() => {
            if (onElementsUpdate.called) {
              clearInterval(interval);
              resolve(interval);
            }
          });
        }),
      )
      .then(() => {
        expect(onElementsReady).to.be.called;
        expect(onElementsUpdate).to.be.called;
        expect(onTargetElementQueried).to.be.called;
        expect(defaultOnElementsReady).to.be.called;
        expect(defaultOnTargetElementQueried).to.be.called;

        expect(onTargetElementQueried).to.be.calledBefore(onElementsReady);
        expect(defaultOnTargetElementQueried).to.be.calledImmediatelyAfter(
          onTargetElementQueried,
        );

        expect(onElementsReady).to.be.calledAfter(defaultOnTargetElementQueried);
        expect(defaultOnElementsReady).to.be.calledImmediatelyAfter(onElementsReady);

        expect(onElementsUpdate).to.be.calledAfter(defaultOnElementsReady);
      });
  });
});
