function checkLogin(){
    var userN = document.getElementById('username').value;
    var passW = document.getElementById('password').value;
    console.log(userN);
    console.log(passW);
    if(userN == "admin" && passW == "admin"){
        window.location.href = "adminView.html";
    }else{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Wrong Username and/or Password",
          });
    }

}