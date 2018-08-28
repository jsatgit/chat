const { OAuth2Client } = require("google-auth-library");

const CLIENT_ID =
    "320665311927-28nv44ac7jfmbf3g4sejkt616c6gtqms.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

function verify(token) {
    return client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
}

module.exports = { verify };
