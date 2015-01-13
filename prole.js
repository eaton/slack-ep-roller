/*
Basic Eclipse Phase skill check class.
*/

var Prole = function (target) {
  this.target = target ? target : 0;
  this.rolled = Math.floor(Math.random() * 100);
  this.success = this.rolled <= this.target;
  this.critical = (this.rolled % 11 == 0) || (this.rolled == 0);
  this.margin = this.success ? this.rolled : (100 - this.rolled);
};


/*
 Pretty dumb, but it allows sorting comparison of two roll objects to determine
 the winner of an opposed check. 
*/
Prole.prototype.valueOf = function() {
  var valString = (this.success ? '' : '-') + (this.critical ? '1' : '') + this.rolled.toString;
  return parseInt(valString);
}

/*
 Zero pads the rolls to make criticals (doubles) more obvious.
*/
Prole.prototype.toString = function() {
  return (this.rolled < 10) ? ("0" + this.rolled) : this.rolled;
}


/*
1. This sucks a lot and should change.
2. Successes >= 30 are 'Excellent' successes (+5 damage during combat)
3. Successes >= 60 are 'Exceptional' successes (+10 damage during combat)
4. Failures <= 70 are 'Severe' failures
5. Failures <= 40 are 'Horrific' failures
6. Margin of Failure == 100-roll. Margin of Success = roll
7. Doubles (00, 11, 22...) are critical failures or successes.
*/
Prole.prototype.prettyPrint = function() {
  var ret = this.rolled.toString() + ', targeting ' + this.target.toString() + '. ';

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

module.exports = Prole;