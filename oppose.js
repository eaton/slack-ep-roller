/*
Opposed die skill checks for Eclipse Phase.

Two checks are rolled, as per check.js. Then they're compared to each other. If both
checks succeed, the highest roll (or a critical) wins. If neither succeed, nothing
happens.
*/

var request = require('request');

module.exports = function (req, res, next) {
  var userName = req.body.user_name;
  var Prole = require('./prole');

  if (req.body.text) {
    var botPayload = {
      text: '',
      username: 'DiceBot',
      channel: req.body.channel_id,
      icon_emoji: ':game_die:'
    };

    var pieces = req.body.text.match(/^([1-9]\d*)\s+([1-9]\d*)\s*(.+)?$/i);
    if (pieces) {
      var att  = (pieces[1] - 0) || 0;
      var opp  = (pieces[2] - 0) || 0;
      var comments = (pieces[3]);
  
      var aResult = new Prole(att);
      var oResult = new Prole(opp);

      botPayload.text = req.body.user_name + ' requests an opposed check';
      if (comments) botPayload.text += ' (' + comments + ')';
      botPayload.text += ':\n';

      botPayload.text += 'Attacker rolled ' + aResult.prettyPrint() + '\n';
      botPayload.text += 'Defender rolled ' + oResult.prettyPrint() + '\n';
      
      if (aResult == oResult) {
        botPayload.text += 'Neither succeeds!';
      }
      else if (aResult > oResult) {
          botPayload.text += 'Attacker succeeds!';
      }
      else if (oResult > aResult) {
        botPayload.text += 'Defender succeeds!';
      }
    } else {
      // send error message back to user if input is bad
      return res.status(200).send('<attack check> <target check> <comments>');
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
      return res.status(200).send('<attack check> <target check> <comments>');
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