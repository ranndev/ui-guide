import UIGuide from '../../src/ui-guide';

describe('highlight - Positioned Element', () => {
  let uiguide: typeof UIGuide;

  before(() => {
    cy.visit('/highlight--positioned-element.html').then((contentWindow) => {
      uiguide = contentWindow.__LIBRARY__['ui-guide'].default;
    });
  });

  it('should not add a "uig-markers-non-positioned" attribute to target element when it has a "position: relative" style', () => {
    const promise = uiguide.highlight('[data-testid="target-1"]');

    cy.get('[uig-highlight-backdrop][uig-show]')
      .then(() => promise)
      .then(({ element }) => {
        expect(element).not.to.have.attr('uig-non-positioned');
      });
  });

  it('should not add a "uig-markers-non-positioned" attribute to target element when it has a "position: absolute" style', () => {
    const promise = uiguide.highlight('[data-testid="target-2"]');

    cy.get('[uig-highlight-backdrop][uig-show]')
      .then(() => promise)
      .then(({ element }) => {
        expect(element).not.to.have.attr('uig-non-positioned');
      });
  });

  it('should not add a "uig-markers-non-positioned" attribute to target element when it has a "position: fixed" style', () => {
    const promise = uiguide.highlight('[data-testid="target-3"]');

    cy.get('[uig-highlight-backdrop][uig-show]')
      .then(() => promise)
      .then(({ element }) => {
        expect(element).not.to.have.attr('uig-non-positioned');
      });
  });

  it('should not add a "uig-markers-non-positioned" attribute to target element when it has a "position: sticky" style', () => {
    const promise = uiguide.highlight('[data-testid="target-4"]');

    cy.get('[uig-highlight-backdrop][uig-show]')
      .then(() => promise)
      .then(({ element }) => {
        expect(element).not.to.have.attr('uig-non-positioned');
      });
  });
});
