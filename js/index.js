var person_name = $("#person-name")[0];
var file_list = $("#file-list")[0];
var status_message = $("#status-message")[0];
var selected_image = $("#selected-image")[0];
var features = "?visualFeatures=Description&details=Celebrities";
file_list.addEventListener("change", function () {
    status_message.innerHTML = "Please wait while we retreive the information";
    processImage(function (file) {
        sendCelebrityRequest(file, function () {
            console.log("Info retrieved");
            sendSearchRequest();
        });
    });
});
function sendSearchRequest() {
    var name = person_name.innerHTML;
    $.ajax({
        url: "https://api.cognitive.microsoft.com/bing/v5.0/search?q=" + name + "&count=10",
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "19063d12e7394e688c93a2c346885d32");
        },
        type: "GET"
    })
        .done(function (data) {
        if (data) {
            console.log(data);
        }
        else {
            console.log("something went wrong");
        }
    })
        .fail(function (error) {
        console.log("something went horribly wrong");
    });
}
function sendCelebrityRequest(file, callback) {
    $.ajax({
        url: "https://api.projectoxford.ai/vision/v1.0/analyze" + features,
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "af21cfa294ff43529375c4ef3c6debb6");
        },
        type: "POST",
        data: file,
        processData: false
    })
        .done(function (data) {
        if (data) {
            var name = data.categories[0].detail.celebrities[0].name;
            var description = data.description.captions[0].text;
            person_name.innerHTML = name;
            console.log(name + ", " + description);
            console.log(data);
            callback();
        }
        else {
            console.log("something went wrong");
        }
    })
        .fail(function (error) {
        console.log("something went horribly wrong");
    });
}
function processImage(callback) {
    var file = file_list.files[0];
    var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file);
    }
    else {
        console.log("Invalid file");
    }
    reader.onloadend = function (e) {
        if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
            status_message.innerHTML = "Please upload an image file (jpg or png).";
        }
        else {
            callback(file);
        }
    };
}
function readUrl(input) {
    if (input.files) {
        var image_reader = new FileReader();
        image_reader.onload = function (e) {
            $("#selected-image").attr("src", e.target.result);
        };
        image_reader.readAsDataURL(input.files[0]);
    }
}
