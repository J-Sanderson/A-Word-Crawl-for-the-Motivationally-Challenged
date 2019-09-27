const PERCENTAGE_STEP = 3.33;
var goalList = [
  10,
  15,
  25,
  50,
  75,
  100,
  100,
  75,
  100,
  110,
  120,
  125,
  150,
  100,
  125,
  150,
  120,
  100,
  80,
  60,
  50,
  75,
  100,
  150,
  200,
  175,
  150,
  125,
  100,
  150
];
var counter, goal, storeWords;

function isStored() {
  return (
    localStorage.hasOwnProperty("_currentText") &&
    localStorage.hasOwnProperty("_writtenText") &&
    localStorage.hasOwnProperty("_counter")
  );
}

function getWordCount(input) {
  //whitespace management (from writtenkitten.co)
  input = input.replace(/^\s*|\s*$/g, ""); //leading/trailing whitespace
  input = input.replace(/\s+/g, " "); //multiple consecutive spaces
  input = input.replace(/\n/g, " "); //new lines

  var words = input.split(" ");
  if (words[0] === "") {
    //set to 0 if all text deleted
    return 0;
  } else {
    //count words in array
    return words.length;
  }
}

function moveToBottom(text) {
  text = text.replace(/\n/g, "<br>");
  //TODO add line break? make optional?
  $("#done").append(" " + text);
}

function textHandler() {
  //have you reached the end of the goal list?
  if (counter >= goalList.length) {
    finish();
    return;
  } else {
    goal = goalList[counter];
    $("#howmuch")
      .empty()
      .append("Write " + goal + " words");

    //live word counter
    $("textarea").keyup(function() {
      var input = $("textarea").val();
      var wc = getWordCount(input);
      if (storeWords) {
        localStorage.setItem("_currentText", input);
      }
      //update counter
      $("#counter")
        .empty()
        .append(wc);
      //make button active if goal met
      if (wc >= goal) {
        $("#donebut")
          .removeClass("inactivebut")
          .addClass("activebut");
      }
    });

    //move text when user clicks done
    $("#donebut").click(function() {
      var wc = parseInt($("#counter").text());
      if (wc >= goal) {
        moveToBottom($("textarea").val());
        //iterate counter
        counter++;
        if (storeWords) {
          localStorage.setItem("_counter", counter);
          localStorage.setItem("_writtenText", $("#done").html());
          localStorage.setItem("_currentText", "");
        }
        $("textarea").val("");
        $("#counter")
          .empty()
          .append(0);
        //deactivate button
        $("#donebut")
          .removeClass("activebut")
          .addClass("inactivebut");
        //set percentage for progress bar
        //set last segment to 100% as the step is technically 3.33 recurring
        var percentage =
          counter > 29 ? 100 + "%" : PERCENTAGE_STEP * counter + "%";
        //animate progress bar
        $("#prog").animate({ width: percentage }, 1000);
        //start again with new goal
        textHandler();
      }
    });
  }
}

function finish() {
  $("#howmuch")
    .empty()
    .append("You did it!");
}

$(document).ready(function() {
  counter = 0;
  storeWords = false;

  //restore existing words
  if (isStored()) {
    if (
      confirm(
        "Your browser's local storage contains existing text you typed in on a previous visit to this page. If you would like to restore this text, click OK. Otherwise, click Cancel to delete this text and turn off local storage for this page."
      )
    ) {
      storeWords = true;
      moveToBottom(localStorage._writtenText);
      $("textarea").val(localStorage._currentText);
      counter = parseInt(localStorage._counter);
      //animate progress bar
      var percentage =
        counter > 29 ? 100 + "%" : PERCENTAGE_STEP * counter + "%";
      $("#prog").animate({ width: percentage }, 1000);
      $("#counter")
        .empty()
        .append(getWordCount(localStorage._currentText));
      $("#storeon").prop("checked", true);
    } else {
      storeWords = false;
      localStorage.removeItem("_currentText");
      localStorage.removeItem("_writtenText");
      localStorage.removeItem("_counter");
    }
  }

  textHandler();

  //progress bar on/off
  $('input[name="progbar"]:radio').change(function() {
    if ($("#progon").is(":checked")) {
      $("#progwrapper").removeClass("invisible");
    } else {
      $("#progwrapper").addClass("invisible");
    }
  });

  //storage on/off
  $('input[name="storage"]:radio').change(function() {
    if ($("#storeon").is(":checked") && !storeWords) {
      $("#overlay").show();
      $("#storagebox").show();
    } else {
      if (storeWords) {
        if (
          confirm(
            "This will remove any words stored by your browser. If you leave this page without copy-pasting them somewhere safe, you will not be able to get them back! Do you want to proceed?"
          )
        ) {
          storeWords = false;
          localStorage.removeItem("_currentText");
          localStorage.removeItem("_writtenText");
          localStorage.removeItem("_counter");
        }
      }
    }
  });

  //accept storage
  $("#storeok").click(function() {
    $("#overlay").hide();
    $("#storagebox").hide();
    storeWords = true;
    localStorage.setItem("_currentText", "");
    localStorage.setItem("_writtenText", $("#done").html());
    localStorage.setItem("_counter", counter);
  });

  //cancel storage
  $("#storecancel").click(function() {
    $("#overlay").hide();
    $("#storagebox").hide();
    storeWords = false;
    //set off to checked
    $("#storeon").prop("checked", false);
    $("#storeoff").prop("checked", true);
    //delete local storage object
    localStorage.removeItem("_currentText");
    localStorage.removeItem("_writtenText");
    localStorage.removeItem("_counter");
  });

  //display about box
  $("#about").click(function() {
    $("#overlay").show();
    $("#aboutbox").show();
  });

  //hide about box
  $("#close").click(function() {
    $("#overlay").hide();
    $("#aboutbox").hide();
  });
});
