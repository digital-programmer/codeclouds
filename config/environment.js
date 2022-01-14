const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");

const logDirectory = path.join(__dirname, "../production_logs");
fs.existsSync(logDirectory || fs.mkdirSync(logDirectory));

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const production = {
    name: "production",
    asset_path: process.env.CODECLOUD_ASSETS_PATH,
    session_cookie_key: process.env.CODECLOUD_SESSION_SECRET_KEY,
    db: process.env.CODECLOUD_DB_URL,
    bcrypt_salt: process.env.CODECLOUD_BCRYPT_SALT,
    api_token: process.env.CODECLOUD_API_TOKEN,
    morgan: {
        mode: "combined",
        options: { stream: accessLogStream }
    }
}

module.exports = production;