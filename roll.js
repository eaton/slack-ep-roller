/*
Dumb-as-dirt wrapper for the droll dice rolling library.

A string like 3d10+3 gets passed in, and the resulting value gets passed back.
*/

var request = require('request');
var droll = require("droll");

module.exports = function (req, res, next) {
  var botPayload = {
    username: 'DiceBot',
    channel: req.body.channel_id,
    icon_emoji: ':game_die:'
  };

  if (req.body.text) {
    // parse roll type if specified
    var result = droll.roll(req.body.text)
    if (result) {
      botPayload.text = req.body.user_name + ' rolled ' + req.body.text + ': ' + result.toString();
      console.log(botPayload.text);
    } else {
      // send error message back to user if input is bad
      return res.status(200).send('<number>d<sides>');
      console.log("fail");
    }
  }

  // send dice roll
  send(botPayload, function (error, status, body) {
    if (error) {
      return next(error);
    } else if (status !== 200) {
      // inform user that our Incoming WebHook failed
      return next(new Error('Incoming WebHook: ' + status + ' ' + body));
    } else {
      return res.status(200).end();
    }
  });

}

function send (payload, callback) {
  var path = process.env.INCOMING_WEBHOOK_PATH;
  var uri = 'https://hooks.slack.com/services' + path;
 
  request({
    uri: uri,
    method: 'POST',
    body: JSON.stringify(payload)
  }, function (error, response, body) {
    if (error) {
      return callback(error);
    }
 
    callback(null, response.statusCode, body);
  });
}