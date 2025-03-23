describe('New Fortune Route with Starsign', () => {
  it('Goes to the New Fortune Form Page, Submits New Fortune Form using starsign, Goes to the Fortune Page', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#new-btn').click()
    cy.url().should('include','/new')
    cy.get('#change-sign-input-type').click()
    cy.get('#name').type('Tester')
    cy.get('#starsign').select('Aquarius')
    cy.get('#mood').type('happy')
    cy.get('#interests').type('I like bowling, skiing and climbing. I recently watch Life of Pi and listened to Taylor Swift\'s new album')
    cy.get('#interests').type('I like bowling, skiing and climbing. I recently watch Life of Pi and listened to Taylor Swift\'s new album')
    cy.get('#submit-form').click()
    cy.url().should('include','/new')
    cy.get('#card-grid')
  })
})

describe('New Fortune Route with Sate of Birth', () => {
  it('Goes to the New Fortune Form Page, Submits New Fortune Form using DoB, Goes to the Fortune Page', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#new-btn').click()
    cy.url().should('include','/new')
    cy.get('#name').type('Tester')
    cy.get('#dob').type('1990-01-01')
    cy.get('#mood').type('happy')
    cy.get('#interests').type('I like bowling, skiing and climbing. I recently watch Life of Pi and listened to Taylor Swift\'s new album')
    cy.get('#interests').type('I like bowling, skiing and climbing. I recently watch Life of Pi and listened to Taylor Swift\'s new album')
    cy.get('#submit-form').click()
    cy.url().should('include','/new')
    cy.get('#card-grid')
  })
})

describe('Mood Select Fortune Route', () => {
  it('Goes to the Mood Select Page, Submits Mood Select Form, Goes to the Fortune Page', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#mood-btn').click()
    cy.url().should('include','/mood')
    cy.get('#mood').type('happy')
    cy.get('#submit-form').click()
    cy.url().should('include','/mood?mood=')
    cy.get('#card-grid')
  })
})

describe('Random Fortune Route', () => {
  it('Goes to the Random Page', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#random-btn').click()
    cy.url().should('include','/random')
    cy.get('#card-grid')
  })
})

describe('Popular Mood Fortune Route', () => {
  it('Goes to the Common Mood Page', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#common-mood').click()
    cy.url().should('include','/mood/')
    cy.get('#card-grid')
  })
})