const axios = require("axios")
const config = require ('../config')
module.exports = {
    fbVerify(req, res, next) {
        axios.get(
            `https://graph.facebook.com/oauth/access_token?client_id=${config.fb_client_id}&client_secret=${config.fb_client_secret}&grant_type=client_credentials`
        ).then((response) => {
            console.log('Token server ottenuto');
            next();
        }).catch((err) => {res.send(err)});
    }   
}