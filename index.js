const express = require("express");
const app = express();
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
var cookieSession = require("cookie-session");

app.use(
  cookieSession({
    secret: "burek.",
    maxAge: 1000 * 60 * 60 * 24 * 14
  })
);

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
app.get("*", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.listen(8080, function() {
  console.log("I'm listening.");
});
