/*
Opposed die skill checks for Eclipse Phase.

Two checks are rolled, as per check.js. Then they're compared to each other. If both
checks succeed, the lowest roll wins. If neither succeed, nothing happens.
*/

module.exports = function (req, res, next) {
  var userName = req.body.user_name;

  var botPayload = {
    text : "Not yet implemented."
  };
 
  // avoid infinite loop
  if (userName !== 'slackbot') {
    return res.status(501).json(botPayload);
  } else {
    return res.status(501).end();  
  }
}