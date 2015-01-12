/*
Basic Eclipse Phase skill check class.

The number passed into the constructor is the target value for the roll--usually a
player's skill plus any difficulty adjustments. Logic is as follows:

1. A d% roll is made, and compared to the target number. roll <= target == success.
2. Successes >= 30 are 'Excellent' successes (+5 damage during combat)
3. Successes >= 60 are 'Exceptional' successes (+10 damage during combat)
4. Failures <= 70 are 'Severe' failures
5. Failures <= 40 are 'Horrific' failures
6. Margin of Failure == 100-roll. Margin of Success = roll
7. Doubles (00, 11, 22...) are critical failures or successes.

*/


var EPRoll = function (target) {
  this.target = target;
  this.roll = Math.floor(Math.random() * 100);

  this.success = (this.target > this.roll);
  this.critical = ((this.roll == 0) || (this.roll % 11 == 0));
  this.margin = this.success ? this.roll : (100 - this.roll);
};

EPRoll.prototype.toString = function() {
  var ret = 'Rolled ' + this.roll.toString() + '/' + this.target.toString() + '. ';

  if (this.margin >= 60) {
    ret += (this.success ? 'Exceptional ' : 'Horrific ');
  } else if (this.margin >= 30) {
    ret += (this.success ? 'Excellent ' : 'Severe ');
  }

  ret += this.critical ? 'Critical ' : '';
  ret += this.success ? 'Success!' : 'Failure!'

  if (this.margin >= 30) {
    ret += ' (' + this.margin.toString() + (this.success ? ' point MoS)' : ' point MoF)');
  }
  
  return ret;
};

module.exports = EPRoll;