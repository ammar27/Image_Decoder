var person_name = $("#person-name")[0];
var file_list : HTMLInputElement = <HTMLInputElement> $("#file-list")[0];
var status_message = $("#status-message")[0];
var selected_image = $("#selected-image")[0];
var features : String = "?visualFeatures=Description&details=Celebrities";

file_list.addEventListener("change", function () {
  status_message.innerHTML = "Please wait while we retreive the information";
  processImage(function (file) {
    sendRequest(file, function() {
      console.log("Info retrieved");
    });
  });
});

function sendRequest(file, callback) : void{
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
        //var name : String = data.categories[0].detail.celebrities[0].name;
        //var description : String = data.description.captions[0].text;
        //console.log(name + ", " + description);
        console.log(data);
      } else {
        console.log("something went wrong");
      }
    })
    .fail (function (error) {
      console.log("something went horribly wrong");
    });
}

function processImage(callback) : void {
  var file : any = file_list.files[0];
  var reader : FileReader = new FileReader();
  if (file) {
    reader.readAsDataURL(file); //used to read the contents of the file
  } else {
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
    };
    image_reader.readAsDataURL(input.files[0]);
  }
}
