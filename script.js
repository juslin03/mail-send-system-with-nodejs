var nodemailer = require("nodemailer");
var xoauth2 = require("xoauth2");

module.exports = function (app, route) {
  return function (req, res, next) {
    console.log(req.body);
    var data = req.body;
    // login
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        xoauth2: xoauth2.createXOAuth2Generator({
          user: "komenan.komenan@uvci.edu.ci",
          clientId:
            "350009158084-g5coupt04jilm5vasktr0vboh6glc9jp.apps.googleusercontent.com",
          clientSecret: "gE2gw8KZzhEnZD3VNOCD59e9",
          refreshToken:
            "1//04O1XHv-F6N6wCgYIARAAGAQSNwF-L9IrY28eXYUn4ep-5_dlEL__sTS-EoKzwSk5jF2GMPvhAzsaWcuoQvjSCHRNH7l0XyTW6Tw",
        }),
      },
    });
    var message = {
      from: "komenan.komenan@uvci.edu.ci", // sender address
      to: "komenan.komenan0@gmail.com", // list of receivers
      subject: data.objet, // Subject line
      text: data.contenu, // plaintext body
      html:
        "<b>Contact Nom</b>: " +
        data.nom +
        "<br/><b>Contact Email</b>: " +
        data.email +
        "<br/><b>Contact Sujet</b>: " +
        data.objet +
        "<br/><br/>" +
        data.contenu, // html body
    };
    if (
      typeof data.objet !== "undefined" &&
      typeof data.objet !== "undefined" &&
      typeof data.nom !== "undefined" &&
      typeof data.contenu !== "undefined"
    ) {
      // send mail with defined transport object
      transporter.sendMail(message, function (error, info) {
        if (error) {
          console.log(error);
          res.status(400);
          res.json(data);
          next();
        } else {
          res.json(data);
          next();
        }
      });
    } else {
      res.status(400);
      res.json(data);
      next();
    }
  };
};
