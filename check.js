/*
Simple skill-check. Wraps the eproll class, adds simple notation for Slack.
*/

var request = require('request');

module.exports = function (req, res, next) {
  var userName = req.body.user_name;
  var EPRoll = require('./eproll');

  if (req.body.text) {
    var botPayload = {
      text: '',
      username: 'DiceBot',
      channel: req.body.channel_id,
      icon_emoji: ':game_die:'
    };

    var pieces = req.body.text.match(/^([1-9]\d*)?\s*(.+)?$/i);
    if (pieces) {
      var target  = (pieces[1] - 0) || 0;
      var comments = (pieces[2]);
  
      var results = new EPRoll(target);
      botPayload.text = req.body.user_name + ' requests a skill check';
      if (comments) { botPayload.text += ' (' + comments + ')'; }
      botPayload.text += ':\n' + results.toString();
    } else {
      // send error message back to user if input is bad
      return res.status(200).send('<target number> <comments>');
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
  else {
      return res.status(200).send('<target number> <comments>');
  }
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