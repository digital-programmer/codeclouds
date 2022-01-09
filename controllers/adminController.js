const request = require("request");
const City = require('../models/city');
const env = require("../config/environment");

module.exports.updatePlace = function (req, res) {
    if (!req.isAuthenticated()) {
        return res.redirect("/users/sign-in");
    }

    const place = req.body.city;
    // if user is admin
    if (req.user.role === 'admin') {
        if (req.xhr) {
            const API_URL = `http://www.mapquestapi.com/geocoding/v1/address?key=${env.api_token}&location=${place}&maxResults=1`;
            // call geolocation API
            request(API_URL, async function (error, response, body) {
                if (error) {
                    returnErrorFromAPICall(res, error);
                }
                const answer = JSON.parse(body);
                // if answer from api is valid
                if (answer.results) {
                    const locationObj = answer.results[0].locations;
                    if (locationObj.length > 0) {
                        // get the latitude and longitude
                        const { lat, lng } = locationObj[0].displayLatLng;
                        try {
                            // find if a city already exists for admin
                            const city = await City.findOne({ user: req.user._id });
                            // if exists, replace with new city details
                            if (city) {
                                city['city'] = locationObj[0]['adminArea5'];
                                city['lat'] = lat;
                                city['lng'] = lng;
                                city.save();
                            }
                            // if does not exist, create a new city with lat and lng
                            else {
                                let newCity = await City.create({ city: place, lat: lat, lng: lng, user: req.user._id });
                            }
                            // return city data as JSON
                            return res.status(200).json({
                                data: {
                                    name: locationObj[0]['adminArea5'],
                                    lat: lat,
                                    lng: lng,
                                }
                            });

                        } catch (err) {
                            // return error
                            returnErrorFromAPICall(res, err)
                        }
                    } else {
                        // return error
                        returnErrorFromAPICall(res, err)
                    }
                } else {
                    // return error
                    returnErrorFromAPICall(res, err)
                }
            });
        } else {
            // if req is not xhr, return
            return res.status(404).json({
                data: {},
                error: "Acccepting only XHR request"
            });
        }
    }
    // if not admin, logout and redirect to sign in page
    else {
        req.logout();
        req.flash('error', "Unauthorized access");
        return res.redirect("/users/sign-in");
    }
}


// error handler for api calls
function returnErrorFromAPICall(res, err) {
    console.log(err);
    return res.status(404).json({
        data: {},
        error: err.toString()
    });
}