// -----------------------------
//  check env variables
// -----------------------------
function checkEnvs() {
  const {
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_DIALECT,
    JWT_EXPIRE,
    JWT_SECRET,
  } = process.env;
  Object.entries({
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_DIALECT,
    JWT_EXPIRE,
    JWT_SECRET,
  }).forEach(([key, value]) => {
    if (!value) {
      console.error(`${key} should be specified`);
      process.exit(1);
    }
  });
}

export default checkEnvs;
