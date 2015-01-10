/*
Glossary lookup for Eclipse Phase rules and stats.

Not yet implemented.
*/

module.exports = function (req, res, next) {
  var text = req.body.text;
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