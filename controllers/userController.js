const request = require("request");
const City = require('../models/city');

module.exports.findPlace = function (req, res) {
    if (!req.isAuthenticated()) {
        return res.redirect("/users/sign-in");
    }

    const place = req.body.city;
    // if it is a user
    if (req.user.role === 'user') {
        if (req.xhr) {
            const API_URL = `http://www.mapquestapi.com/geocoding/v1/address?key=${process.env.API_TOKEN}&location=${place}&maxResults=1`;
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
                        const { lat, lng } = locationObj[0].displayLatLng;
                        try {
                            // check  if city is set by admin
                            const cities = await City.find({});
                            if (cities) {
                                // if set, find the distance between input city and admin city
                                const resultCity = cities.map((my_city) => {
                                    return {
                                        "city": my_city.city,
                                        "lat": my_city.lat,
                                        "lng": my_city.lng,
                                        "distance": getDistanceFromLatLonInKm(my_city.lat, my_city.lng, lat, lng),
                                    }
                                })

                                return res.status(200).json({
                                    data: resultCity
                                })

                            } else {
                                // return city not set
                                return res.status(404).json({
                                    data: [],
                                    error: "City not set by Admin"
                                });
                            }
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
            return res.status(404).json({
                data: [],
                error: "Acccepting only XHR request"
            });
        }
    }
    // if not user, logout and redirect to sign in page
    else {
        req.logout();
        req.flash('error', "Unauthorized access");
        return res.redirect("/users/sign-in");
    }
}

// error hanlder for api call
function returnErrorFromAPICall(res, err) {
    console.log(err);
    return res.status(404).json({
        data: {},
        error: err.toString()
    });
}

// get distance between two points
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return Math.round(d); // return the rounded distance
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}