const PERCENTAGE_STEP = 3.33;
var goalList = [10,15,25,50,75,100,100,75,100,110,120,125,150,100,125,150,120,100,80,60,50,75,100,150,200,175,150,125,100,150];
var goal; //avoids scope errors in textHandler

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

function textHandler(counter, progress) {
  
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
      //set percentage for progress bar
      //last segment needs to be set to 100% as the step is technically 3.33 recurring
      var percentage = counter > 29? 100 + '%' : progress + '%';
      //animate progress bar
      $('#prog').animate({'width': percentage}, 1000);
      //iterate progress for the next round
      progress = progress + PERCENTAGE_STEP;
      //start again with new goal
      textHandler(counter, progress);
    }
  });
  }
  
}

function finish() {
  $('#howmuch').empty().append('You did it!');
}

$(document).ready(function(){
  
  var counter = 0;
  var progress = PERCENTAGE_STEP;
  
  textHandler(counter, progress);
  
  //progress bar on/off
  $( 'input[name="progbar"]:radio' ).change(function() {
    if ($('#progon').is(':checked')) {
      $('#progwrapper').removeClass('invisible');
    } else {
      $('#progwrapper').addClass('invisible');
    }
  });
  
  //display about box
  $('#about').click(function() {
    $('#overlay').show();
    $('#aboutbox').show();
  });
  
  //hide about box
  $('#close').click(function() {
    $('#overlay').hide();
    $('#aboutbox').hide();
  });
  
});