const { OAuth2Client } = require("google-auth-library");
const config = require('config');

const webClientId = config.get('google.webClientId');
const mobileClientId = config.get('google.mobileClientId');

const webClient = new OAuth2Client(webClientId);
const mobileClient = new OAuth2Client(mobileClientId);

function verify(token, platform="web") {
    if (platform === "mobile") {
        return mobileClient.verifyIdToken({
            idToken: token,
            audience: mobileClientId 
        });
    }

    return webClient.verifyIdToken({
        idToken: token,
        audience: webClientId 
    });
}

module.exports = { verify };
