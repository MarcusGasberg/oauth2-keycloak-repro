import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { defineConfig } from "cypress";

async function setupNodeEvents(on, config) {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    }),
  );

  on("task", {
    log(message) {
      console.log(`CYPRESS LOG: ${new Date().toISOString()} - ${message}`);
      return null;
    },
  });

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

export default defineConfig({
  e2e: {
    testIsolation: true,
    specPattern: [
      "cypress/**/*.feature",
      "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    ],
    setupNodeEvents,
    baseUrl: "http://host.docker.internal:14180",
    video: false,
    chromeWebSecurity: false,
    experimentalOriginDependencies: false,
  },
  retries: {
    runMode: 2,
  },
  env: {
    KEYCLOAK_URL: "http://host.docker.internal:18080",
    USERNAME: "test",
    PASSWORD: "password",
  },
});
