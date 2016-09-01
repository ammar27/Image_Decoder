var person_name = $("#person-name")[0];
var file_list = $("#file-list")[0];
var selected_image = $("#selected_image")[0];
var status_message = $("#status_message")[0];
file_list.addEventListener("change", function () {
    processImage(function (file) {
        sendRequest(file, function () {
            console.log("Info retrieved");
        });
    });
});
function sendRequest(file, callback) {
    $.ajax({
        url: "https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Description&details=Celebrities",
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
            console.log(data.categories[0].detail.celebrities[0].name);
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
function processImage(callback) {
    var file = file_list.files[0];
    var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file);
    }
    else {
        console.log("Invalid file");
    }
    reader.onloadend = function () {
        if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
            status_message.innerHTML = "Please upload an image file (jpg or png).";
        }
        else {
            callback(file);
        }
    };
}
