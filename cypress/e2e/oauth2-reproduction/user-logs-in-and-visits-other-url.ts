import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

Given("user is logged in", () => {
  cy.login();
});
When("the user visits another page", () => {
  // Simulate an unexpected cross-origin navigation that occurs in CI when the oauth2-proxy
  // session expires during a cy.visit(). After the page loads, we navigate directly to
  // Keycloak (a different origin) as the browser would do when the oauth2-proxy session
  // expires. This unexpected cross-origin navigation triggers a Cypress spec reload,
  // reproducing the preprocessor bug described in issue #1161.
  cy.visit("/posts/3");
  cy.window().then((win) => {
    win.location.href = Cypress.env("KEYCLOAK_URL") + "/realms/my-app/account/";
  });
  cy.visit("/posts/1");
});
Then("the page is displayed", () => {
  cy.url().should("include", "/posts/1");
  cy.get("h4").should(
    "contain.text",
    "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  );
});
