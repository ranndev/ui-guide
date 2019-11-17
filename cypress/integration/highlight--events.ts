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
    const defaultOnTargetFound = cy.stub();
    const onElementsReady = cy.stub();
    const onHighlightUpdate = cy.stub();
    const onTargetFound = cy.stub();

    uiguide.configure({
      events: {
        onElementsReady: defaultOnElementsReady,
        onTargetFound: defaultOnTargetFound,
      },
    });

    uiguide.highlight({
      element: '[data-testid="target-1"]',
      events: {
        onElementsReady,
        onHighlightUpdate,
        onTargetFound,
      },
    });

    cy.get('[uig-highlight-backdrop][uig-show]')
      .wrap(
        new Promise((resolve) => {
          const interval = setInterval(() => {
            if (onHighlightUpdate.called) {
              clearInterval(interval);
              resolve(interval);
            }
          });
        }),
      )
      .then(() => {
        expect(onElementsReady).to.be.called;
        expect(onHighlightUpdate).to.be.called;
        expect(onTargetFound).to.be.called;
        expect(defaultOnElementsReady).to.be.called;
        expect(defaultOnTargetFound).to.be.called;

        expect(onTargetFound).to.be.calledBefore(onElementsReady);
        expect(defaultOnTargetFound).to.be.calledImmediatelyAfter(
          onTargetFound,
        );

        expect(onElementsReady).to.be.calledAfter(defaultOnTargetFound);
        expect(defaultOnElementsReady).to.be.calledImmediatelyAfter(
          onElementsReady,
        );

        expect(onHighlightUpdate).to.be.calledAfter(defaultOnElementsReady);
      });
  });
});
