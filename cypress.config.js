const { defineConfig } = require('cypress');
const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Maif Cypress Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
 
  video: true, // Enable video recording
  videoCompression: 32, // Set video compression (default: 32)
  
  env: {
    apiConfig: {
      url: 'http://localhost:8080/oauth/token',
      auth: {
        username: 'maif-web',
        password: 'web123'
      },
      body: {
        username: 'luna.moon@maif.com',
        password: '123',
        grant_type: 'password'
      }
    }
  },

  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/integration/**/*.spec.js',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      on('before:run', async (details) => {
        console.log('override before:run');
        await beforeRunHook(details);
      });

      on('after:run', async () => {
        console.log('override after:run');
        await afterRunHook();
      });
    },
    
  },

});
