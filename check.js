/*
Basic Eclipse Phase skill check.

The number passed in is the player's "target" value. Logic is as follows:

1. A d% roll is made, and compared to the target number. roll <= target == success.
2. Successes >= 30 are 'Excellent' successes (+5 damage during combat)
3. Successes >= 60 are 'Exceptional' successes (+10 damage during combat)
4. Failures <= 70 are 'Severe' failures
5. Failures <= 40 are 'Horrific' failures
6. Margin of Failure == 100-roll. Margin of Success = roll
7. Doubles (00, 11, 22...) are critical failures or successes.

*/

module.exports = function (req, res, next) {
  var userName = req.body.user_name;

  var target = parseInt(req.body.text);
  var roll = Math.floor(Math.random() * 100);  
  
  var isSuccess = (target > roll);
  var isCritical = ((roll == 0) || (roll % 11 == 0));
  var margin = isSuccess ? roll : (100 - roll);

  var resultText = 'Rolled ' + roll.toString() + '/' + target.toString() + '. ';

  if (margin >= 60) {
    resultText += (isSuccess ? 'Exceptional ' : 'Horrific ');
  } else if (margin >= 30) {
    resultText += (isSuccess ? 'Excellent ' : 'Severe ');
  }

  resultText += isCritical ? 'Critical ' : '';
  resultText += isSuccess ? 'Success!' : 'Failure!'

  if (margin >= 30) {
    resultText += ' (' + margin.toString() + (isSuccess ? ' point MoS)' : ' point MoF)');
  }

  var botPayload = {text : resultText};
 
  // avoid infinite loop
  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
}