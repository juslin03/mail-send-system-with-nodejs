require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const nodemailer = require("nodemailer");
const flashMiddleware = require("./middlewares/flash");

let csrfProtection = csrf({ cookie: true });
const app = express();

// Moteur de templating
app.set("view engine", "ejs");

// middlewares
app.use("/assets", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  session({
    secret: "Mister Juslin",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(flashMiddleware);

app.get("/", csrfProtection, (req, res) => {
  // console.log(req.isAuthenticated())
  res.render("index", {
    title: "Systeme d'envoie de mail",
    csrfToken: req.csrfToken(),
  });
  //   main().catch(console.error);
});

app.post("/send", csrfProtection, (req, res) => {
  const mail = req.body.email;
  const message = req.body.message;
  const object = req.body.object;
  if (
    (mail === "" || mail === undefined || !mail) &&
    (message === "" || message === undefined || message === "") &&
    (object === "" || object === undefined || object === "")
  ) {
    res.status(404);
    req.flash(
      "error",
      "Vous devez remplir tous les champs avant d'envoyer le message"
    );
    res.redirect("/");
  } else {
    const main = async (request, response, next) => {
      // create transporter
      let transporter = nodemailer.createTransport({
        service: "gmail",
        port: process.env.PORT,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
      });

      //our mails infos
      var mailOptions = {
        from: process.env.EMAIL,
        to: mail,
        subject: object,
        html: message,
      };

      await transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log(err);
      });
    };

    try {
      main();
      req.flash("success", "Félicitation, Votre message a bien été envoyé !");
      res.redirect("back");
    } catch (error) {
      console.error(error);
    }
  }
});

app.listen(process.env.APP_PORT, () => {
  console.log(
    `Server started on http://${process.env.APP_HOST}:${process.env.APP_PORT}`
  );
});
