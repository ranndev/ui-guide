describe('Basic Highlight', () => {
  /** @type {import('../../src/ui-guide').default} */
  let UIGuide;

  before(async () => {
    const { __LIBRARY__ } = await cy.visit('http://localhost:8080');
    UIGuide = __LIBRARY__['ui-guide'].default;
  });

  it('should return a promise', () => {
    const promise = UIGuide.highlight('[data-uig-id="hello"]');
    expect(promise).to.be.a('promise');
    return promise;
  });

  it('should resolve the highlighted element', async () => {
    const { element } = await UIGuide.highlight('[data-uig-id="welcome"]');
    cy.wrap(element).should('have.attr', 'data-uig-id', 'welcome');
  });

  it('should set all the required attributes', async () => {
    await UIGuide.highlight('[data-uig-id="lets-do"]');

    cy.get('body').should('have.attr', 'uig-markers-highlighting');

    cy.get('[uig-elements-target]').as('target');
    cy.get('@target').should('have.attr', 'uig-markers-non-positioned');
    cy.get('@target').should('have.attr', 'uig-markers-clickable');

    cy.get('[uig-elements-box]').as('box');
    cy.get('@box')
      .should('have.css', 'width')
      .and('match', /^[0-9.]+px$/);
    cy.get('@box')
      .should('have.css', 'height')
      .and('match', /^[0-9.]+px$/);
    cy.get('@box')
      .should('have.css', 'top')
      .and('match', /^[0-9.]+px$/);
    cy.get('@box')
      .should('have.css', 'left')
      .and('match', /^[0-9.]+px$/);

    cy.get('[uig-elements-backdrop]').should('have.attr', 'uig-markers-show');
  });
});
