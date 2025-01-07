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
                window.location.replace("/admin");
                console.log("asdfadsf");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Wrong Username and/or Password",
                });
            }
        }
    };
    data = {
        details: {
            user: userN,
            pass: passW
        }
    };

    console.log(data)
    xhr.send(JSON.stringify(data));


}