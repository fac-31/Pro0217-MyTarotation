describe('Random Fortune Route', () => {
  it('Visits the Random Page', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#random-btn').click()
    cy.url().should('include','/random')
  })
})