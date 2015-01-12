/*
Simple skill-check. Wraps the eproll class, adds simple notation for Slack.
*/

var request = require('request');

module.exports = function (req, res, next) {
  var userName = req.body.user_name;
  var EPRoll = require('./eproll');

  var target = parseInt(req.body.text);
  var results = new EPRoll(target);

  var botPayload = {
    username: 'DiceBot',
    channel: req.body.channel_id,
    icon_emoji: ':game_die:'
  };

  botPayload.text = results.toString();

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