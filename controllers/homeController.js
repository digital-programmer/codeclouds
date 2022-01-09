const City = require('../models/city');

module.exports.home = async function (req, res) {
    if (!req.isAuthenticated()) {
        return res.redirect("/users/sign-in");
    }

    // if user is admin, redirect to admin page
    if (req.user.role === "admin") {
        try {
            const city = await City.findOne({ user: req.user._id });
            let placeName = "";
            if (city) {
                placeName = city["city"];
                return res.render("admin_page", {
                    title: "Admin Page",
                    place: placeName
                })
            }
            return res.render("admin_page", {
                title: "Admin Page",
                place: "",
            })
        } catch (err) {
            req.flash('error', "Error in finding city name");
            return res.render("admin_page", {
                title: "Admin Page",
                place: "",
            })
        }

        // else redirect to user page
    } else {
        return res.render("user_page", {
            title: "User Page",
        });
    }

};