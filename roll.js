/*
Dumb-as-dirt wrapper for the droll dice rolling library.

A string like 3d10+3 gets passed in, and the resulting value gets passed back.
*/

var request = require('request');
var droll = require("droll");

module.exports = function (req, res, next) {
  if (req.body.text) {
    var botPayload = {
      text: '',
      username: 'DiceBot',
      channel: req.body.channel_id,
      icon_emoji: ':game_die:'
    };

    var pieces = req.body.text.match(/^([1-9]\d*)?d([1-9]\d*)([+-]\d+)?\s*(.+)?$/i);
    if (pieces) {
      var numDice  = (pieces[1] - 0) || 1;
      var numSides = (pieces[2] - 0) || 10;
      var comments = (pieces[4]);

      // Currently ignoring modifier because bodyParser kills plus signs. Because WTF URLEncoding.

      var formula = numDice.toString() + 'd' + numSides.toString();
      var result = droll.roll(formula)

      botPayload.text = req.body.user_name + ' rolled ' + formula.toString();
      if (comments) {
        botPayload.text += ' (' + comments + ')';
      }
      botPayload.text += ': ' + result.toString();
    } else {
      // send error message back to user if input is bad
      return res.status(200).send('<number>d<sides>');
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