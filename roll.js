var droll = require('droll');

/*
Dumb-as-dirt wrapper for the droll dice rolling library.

A string like 3d10+3 gets passed in, and the resulting value gets passed back.
*/

module.exports = function (req, res, next) {
  var text = req.body.text;
  var userName = req.body.user_name;

  var botPayload = {
    text : droll.roll(req.body.text).total
  };
 
  // avoid infinite loop
  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
}