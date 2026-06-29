// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(): Cypress.Chainable;
    logout(): Cypress.Chainable;
    getBySel(
      selector: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>,
    ): Cypress.Chainable;
    getBySelLike(
      selector: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>,
    ): Cypress.Chainable;
  }
}

// -- This is a parent command --
Cypress.Commands.add("login", () => {
  return cy.session(
    "login",
    () => {
      const username = Cypress.env(`USERNAME`);
      const password = Cypress.env(`PASSWORD`);
      cy.visit("/");
      cy.url().then(($url) => {
        if (!$url) {
          return;
        }

        cy.get("#username").type(username);
        cy.get("#password").type(password);
        cy.get("#kc-login").click();
      });
    },
    {
      validate: () => {
        const keycloakUrl = Cypress.env(`KEYCLOAK_URL`);
        cy.url().should("not.include", keycloakUrl);
      },
    },
  );
});
