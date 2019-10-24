describe('UIGuide', () => {
  /** @type {import('../../src/ui-guide').default} */
  let UIGuide;

  before(async () => {
    const { __LIBRARY__ } = await cy.visit('http://localhost:8080');
    UIGuide = __LIBRARY__['ui-guide'].default;
  });

  describe('highlight', () => {
    it('should return a promise', () => {
      const promise = UIGuide.highlight('h1');
      expect(promise).to.be.a('promise');
    });
  });
});
