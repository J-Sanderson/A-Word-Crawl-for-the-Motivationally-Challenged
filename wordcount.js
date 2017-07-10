var goalList = [10,15,25,50,75,100,100,75,100,110,120,125,150,100,125,150,120,100,80,60,50,75,100,150,200,175,150,125,100,150];
//declare the goal variable here to avoid scope errors in textHandler
var goal;

function getWordCount(input) {
  //whitespace management (from writtenkitten.co)
  input = input.replace(/^\s*|\s*$/g, ''); //leading/trailing whitespace
  input = input.replace(/\s+/g, ' '); //multiple consecutive spaces
  input = input.replace(/\n/g, ' '); //new lines

  var words = input.split(' ');
  if (words[0] === '') {
    //set to 0 if all text deleted
    return 0;
  } else {
    //count words in array
    return words.length;
  }
}

function textHandler(counter) {
  
  //have you reached the end of the goal list?
  if (counter >= goalList.length) {
    finish();
    return;
  } else {
  
  goal = goalList[counter];
  $('#howmuch').empty().append('Write ' + goal + ' words');
  
//live word counter
  $('textarea').keyup(function() {
    var input = $('textarea').val();
    var wc = getWordCount(input);
    //update counter
    $('#counter').empty();
    $('#counter').append(wc);
    //make button active if goal met
    if (wc >= goal) {
      $('#donebut').removeClass('inactivebut').addClass('activebut');
    }
    });
  
    
    //move text when user clicks done
  $('#donebut').click(function() {
    var wc = parseInt($('#counter').text());
    if (wc >= goal) {
      var toMove = $('textarea').val();
      //convert newlines to break tags
      toMove = toMove.replace(/\n/g, '<br>');
      //move everything and clear it
      $('#done').append(' ' + toMove);
      $('textarea').val('');
      $('#counter').empty().append(0);
      //deactivate button
      $('#donebut').removeClass('activebut').addClass('inactivebut');
      //iterate counter
      counter++;
      //start again with new goal
      textHandler(counter);
    }
  });
  }
  
}

function finish() {
  $('#howmuch').empty().append('You did it!');
}

$(document).ready(function(){
  
  var counter = 0;
  
  textHandler(counter);
  
});