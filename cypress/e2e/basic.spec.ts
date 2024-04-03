context('Basic', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('basic nav', () => {
    cy.url()
      .should('eq', 'http://localhost:3333/')

    cy.contains('[Home Layout]')
      .should('exist')

    cy.contains('[Default Layout]')
      .should('exist')

    cy.get('[btn]')
      .click()
      .url()
      .should('eq', 'http://localhost:3333/')
  })
})
