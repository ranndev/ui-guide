import UIGuide from '../../src/ui-guide';

describe('highlight - Events', () => {
  let uiguide: typeof UIGuide;

  before(() => {
    cy.visit('/').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  it('should invoke the event listeners', () => {
    const defaultOnHighlightReady = cy.stub();
    const defaultOnPopupReady = cy.stub();
    const defaultOnTargetFound = cy.stub();
    const onHighlightReady = cy.stub();
    const onPopupReady = cy.stub();
    const onHighlightUpdate = cy.stub();
    const onPopupUpdate = cy.stub();
    const onTargetFound = cy.stub();

    uiguide.configure({
      events: {
        onHighlightReady: defaultOnHighlightReady,
        onPopupReady: defaultOnPopupReady,
        onTargetFound: defaultOnTargetFound,
      },
    });

    uiguide.highlight({
      events: {
        onHighlightReady,
        onHighlightUpdate,
        onPopupReady,
        onPopupUpdate,
        onTargetFound,
      },
      target: '[data-testid="target-1"]',
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
        expect(onHighlightReady).to.be.called;
        expect(defaultOnPopupReady).to.be.called;
        expect(onHighlightUpdate).to.be.called;
        expect(onPopupReady).to.be.called;
        expect(defaultOnPopupReady).to.be.called;
        expect(onPopupUpdate).to.be.called;
        expect(onTargetFound).to.be.called;
        expect(defaultOnTargetFound).to.be.called;

        expect(onTargetFound).to.be.calledBefore(onHighlightReady);

        expect(defaultOnTargetFound).to.be.calledImmediatelyAfter(
          onTargetFound,
        );

        expect(onHighlightReady).to.be.calledAfter(defaultOnTargetFound);

        expect(defaultOnHighlightReady).to.be.calledImmediatelyAfter(
          onHighlightReady,
        );

        expect(onHighlightUpdate).to.be.calledAfter(defaultOnHighlightReady);

        expect(onPopupReady).to.be.calledAfter(defaultOnTargetFound);

        expect(defaultOnPopupReady).to.be.calledImmediatelyAfter(onPopupReady);

        expect(onPopupUpdate).to.be.calledAfter(defaultOnPopupReady);
      });
  });
});
