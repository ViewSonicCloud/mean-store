var User = require(ROOT_FOLDER + "/models/users");
var bcrypt = require("bcrypt");
var common = require(ROOT_FOLDER + "/helpers/common");
exports.Auth = function (req, res, next) {
    User.loginAsAdmin(req.body, function (err, user) {
        if (!err) {
            user.updateToken(function (err, result) {
                if (err) return next(err);
                user.token = result;
                return res._response(user);
            });
        }
        else {
            return next(err);
        }
    });
}
exports.sampleInsert = function (req, res, next) {
    var rand = Math.random();
    var user = new User({
        name: 'admin',
        email: "cloud.admin@viewsonic.com",
        roles: ["admin", "user","seller"],
        password: common.getHash('123456'),
        social_logins: {
            fb_id: rand,
            google_id: rand
        },
    })
        .save(function (data) {
            console.log("asdhjsda:" + data);
            res.json({user: user});
        });
}

