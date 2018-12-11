const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const compression = require("compression");
const bodyParser = require("body-parser");
const csurf = require("csurf");
const s3 = require("./s3.js");
const config = require("./config.json");

const db = require("./database/db");
const bc = require("./database/bcrypt");

//_________UPLOAD IMG TO SERVER_____________
var multer = require("multer"); // request  that have a fileallegato
var uidSafe = require("uid-safe"); // generate a uniq ID rinommina tutti i file per non fare coincidere i nomi
var path = require("path"); // legge url e lo divide in parti
//file upload
var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152 //2MB it's my limits
    }
});

//______________END____________

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(compression());

app.use(express.static("./public"));

//____________COOKIE______________
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

// ___________SECURITY__________

app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
// ____________BUNDLE_____________

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
//______________REGISTRATION______________

app.post("/registration", (req, res) => {
    const { first, last, email, password } = req.body;

    bc.hashPassword(password)
        .then(hashedPass => {
            db.createUser(first, last, email, hashedPass)
                .then(id => {
                    req.session.userId = id;

                    res.json({ success: true });
                })
                .catch(err => {
                    console.log("err in create user: ", err);
                    res.json({ success: false });
                });
        })
        .catch(err => {
            console.log("err in hash password: ", err);
            res.json({ success: false });
        });
});

//_____________LOGIN_________________
app.post("/login", (req, res) => {
    console.log("mia!!");
    return db
        .userEmail(req.body.email)
        .then(function(user) {
            if (!user) {
                console.log(user);
                res.json({ success: false });
            } else {
                return bc
                    .compare(req.body.password, user.password) //paragona la pass che l user ha appena passato con la pass precedentemente passata
                    .then(function(theyMatch) {
                        if (theyMatch) {
                            req.session.userId = user.id;

                            res.json({ success: true });
                        }
                    });
            }
        })

        .catch(err => {
            console.log("console.error: ", err);
            res.json({ success: false });
        });
});
//____________LOGOUT_____________
app.get("/logout", (req, res) => {
    req.session = null; //cancella i cookie completamente tutto cio che ho in sessionsi è cancellato
    res.redirect("/welcome");
});

//_____________PROFILE____________
//request to the server from componentDidMount
app.get("/user", (req, res) => {
    db.userProfile(req.session.userId).then(row => {
        console.log(row.first, row);
        res.json({
            userId: req.session.userId,
            first: row.first,
            last: row.last,
            bio: row.bio,
            imgUrl: row.imgurl || "/lume.jpg" //scegli una foto
        });
    });
});

//__________OTHER _____________PROFILE____________
app.get("/user/:id/profile", (req, res) => {
    db.userProfile(req.params.id).then(row => {
        console.log(row.first, row);
        res.json({
            userId: req.params.id,
            first: row.first,
            last: row.last,
            bio: row.bio,
            imgUrl: row.imgurl || "/lume.jpg" //
        });
    });
});

//___________FIRENDSHIP_____________________
app.get("/friends/status/:id", (req, res) => {
    db.friendStatus(req.params.id, req.session.userId)
        .then(row => {
            res.json({
                success: true,
                results: row
            });
        })
        .catch(err => {
            res.json({ success: false });
        });
});
app.post("/send/friendRequest", (req, res) => {
    db.friendRequest(req.body.id, req.session.userId)
        .then(row => {
            res.json({
                success: true,
                results: row
            });
        })
        .catch(err => {
            console.log("error sending friend rewquest", err);
            res.json({ success: false });
        });
});
app.post("/delete/friendRequest", (req, res) => {
    db.deleteFriend(req.body.id, req.session.userId)
        .then(row => {
            res.json({
                success: true,
                results: {
                    accepted: null,
                    id: null,
                    receiver_id: null,
                    sender_id: null
                }
            });
        })
        .catch(err => {
            console.log("error deleting friend request", err);
            res.json({ success: false });
        });
});
app.post("/accept/friendRequest", (req, res) => {
    db.acceptFriend(req.body.id, req.session.userId)
        .then(row => {
            res.json({
                success: true,
                results: row
            });
        })
        .catch(err => {
            console.log("error accepting friend rewquest", err);
            res.json({ success: false });
        });
});
app.get("/wannabes/friends", (req, res) => {
    db.listFriend(req.session.userId).then(rows => res.json(rows));
});

//___________  UPLOAD IMG AMAZON , UPDATE DB ________________
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    if (req.file) {
        var amazonUrl = config.s3Url;
        var fullUrl = amazonUrl + req.file.filename;
        console.log(fullUrl);
        return db
            .upImg(fullUrl, req.session.userId)
            .then(rows => {
                console.log(rows);
                res.json({
                    success: true,
                    results: rows[0]
                });
            })
            .catch(err => {
                console.log("error in upImg: ", err);
                res.json({ success: false });
            });
    }
});
//______________BIOGRAPHY_________________
app.post("/history/bio", (req, res) => {
    const { bio } = req.body;
    db.upBio(req.session.userId, bio)
        .then(results => {
            res.json({ success: true });
        })
        .catch(err => {
            console.log("Error in POST : ", err);
        });
});

//___________NEVER TOUCH THIS CODE!!!!_____________
app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
// sostituisco app.listen con server.listen
server.listen(8080, function() {
    console.log("I'm listening.");
});

//socket server code
io.on("connection", socket => {
    console.log(`user with socket id${socket.id} just connected`);
    let userId = socket.request.session.userId;
    let socketId = socket.id;
    console.log("socket session info:", userId);
    //2 arguments first is a name and must be a string
    //second is any data that i want to send in my "message" using this method emit
    socket.emit("catnip", "bellissimo");
});
