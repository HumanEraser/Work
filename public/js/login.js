function checkLogin() {
    var userN = document.getElementById('username').value;
    var passW = document.getElementById('password').value;
    /*     if (userN == "admin" && passW == "admin") {
        window.location.href = "adminView.html";
    } else {

    } */
    let xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin + "/login");
    xhr.setRequestHeader("Accept", "/");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                if(xhr.responseText.toString() == "Administrator"){
                    window.location.replace("/admin");
                } else if(xhr.responseText.toString() == "Secretary"){
                    window.location.replace("/secretary");
                } else if (xhr.responseText.toString() == "Assistant"){
                    window.location.replace("/Assistant");
                }
            } else {

            }
        }
    };
    data = {
        details: {
            user: userN,
            pass: passW
        }
    };
    xhr.send(JSON.stringify(data));


}