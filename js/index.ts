var person_name = $("#person-name")[0];
var file_list : HTMLInputElement = <HTMLInputElement> $("#file-list")[0];
var status_message = $("#status-message")[0];
var selected_image = $("#selected-image")[0];
var features : string = "?visualFeatures=Description&details=Celebrities";

file_list.addEventListener("change", function () {
  status_message.innerHTML = "Please wait while we find out who this is";
  status_message.style.color = "red";
  status_message.style.display = "block";
  processImage(function (file) {
    sendCelebrityRequest(file, function() {
      sendSearchRequest();
    });
  });
});

function sendSearchRequest() : void {
  var name:string = person_name.innerHTML;
  status_message.innerHTML = "Fetching details";
  $("#details").html("");

  $.ajax({
    url: "https://api.cognitive.microsoft.com/bing/v5.0/search?q=" + name + "&count=10",
    beforeSend: function(xhrObj) {
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "19063d12e7394e688c93a2c346885d32");
    },
    type: "GET"
  })
    .done(function (data) {
      if (data) {
        status_message.innerHTML = "Finished Successfully";
        status_message.style.color = "green";
        // Adding details dynamically
        for (let i in data.webPages.value) {
          var url : string = data.webPages.value[i].displayUrl;
          var substr : string = "http";
          if (url.indexOf(substr) == -1) {
            url = "http://" + url;
          }
          var text1 : string = "<div class=\"first-el\"><a href=" + url + ">" + data.webPages.value[i].name + "</a></div>";
          var text2 : string = "<div class=\"second-el\">" + data.webPages.value[i].displayUrl + "</div>";
          var text3 : string = "<div class=\"third-el\">" + data.webPages.value[i].snippet + "</div>";
          $("#details").append(text1, text2, text3);
        }

      } else {
        status_message.innerHTML = "Search results could not be obtained";
        console.log("Search results could not be obtained");
      }
    })
    .fail (function (error) {
      status_message.innerHTML = "Search results could not be obtained";
      console.log(error);
    });
}

function sendCelebrityRequest(file, callback) : void{
  $.ajax({
    url: "https://api.projectoxford.ai/vision/v1.0/analyze" + features,
    beforeSend: function(xhrObj) {
      // Headers
      xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "af21cfa294ff43529375c4ef3c6debb6");
    },
    type: "POST",
    data: file,
    processData: false
  })
    .done(function (data) {
      if (data) {
        if ((typeof(data.categories[0].detail) != "undefined") && ((typeof(data.categories[0].detail.celebrities[0]) != "undefined"))) {
          var name : string = data.categories[0].detail.celebrities[0].name;
          var description : string = data.description.captions[0].text;
          person_name.innerHTML = name;
          $("#details").html("");
          callback();
        } else {
          person_name.innerHTML = "Sorry, person not found";
          status_message.innerHTML = "We could not find who this is, please try another image";
          $("#details").html("");
        }
      } else {
        status_message.innerHTML = "We could not find who this is, please try again";
        console.log("We could not find who this is, please try again");
      }
    })
    .fail (function (error) {
      status_message.innerHTML = "Sorry, something went wrong. Please try again";
      console.log(error);
    });
}

function processImage(callback) : void {
  var file : any = file_list.files[0];
  var reader : FileReader = new FileReader();
  if (file) {
    reader.readAsDataURL(file); //used to read the contents of the file
  } else {
    status_message.innerHTML = "Invalid file";
    person_name.innerHTML = "Cannot obtain name for this file";
    console.log("Invalid file");
  }
  reader.onloadend = function (e) {
    if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
      status_message.innerHTML = "Please upload an image file (jpg or png).";
    } else {
      callback(file);
    }
  }
}

function readUrl (input): void {
  if (input.files) {
    var image_reader = new FileReader();
    image_reader.onload = function (e) {
      $("#selected-image").attr("src", e.target.result);
      person_name.innerHTML = "Fetching name";
    };
    image_reader.readAsDataURL(input.files[0]);
  }
}
