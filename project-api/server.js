const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// __dirname points to the virtual filesystem location when bundled.
let envPath = path.join(__dirname, '.env');

// Try reading the file; if not found, fall back to the external file.
if (!fs.existsSync(envPath)) {
  envPath = path.join(process.cwd(), '.env');
}

const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const app = require('./app'); // Import the app module

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
