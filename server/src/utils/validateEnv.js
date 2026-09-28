/**
 * Validates that required environment variables are set.
 * Throws an error on startup if any are missing.
 */
const REQUIRED_ENV_VARS = ['MONGODB_URI', 'CLIENT_URL'];

function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please copy server/.env.example to server/.env and fill in the values.'
    );
  }
}

module.exports = validateEnv;
