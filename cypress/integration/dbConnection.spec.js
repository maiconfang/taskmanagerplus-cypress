


describe('Database Connection', () => {
    it('should successfully connect to the database and perform a query', () => {
      cy.queryDb('SELECT 1').then((result) => {
        expect(result).to.exist;
        expect(result).to.have.length(1);
      });
    });
  });
  