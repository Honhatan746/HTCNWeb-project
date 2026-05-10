function login() {
    let email = $("#email").val().trim();
    let password = $("#password").val().trim();

    let users = JSON.parse(localStorage.getItem("user"));
    console.log(users);
    let user = users.find(u => u.email === email && u.pass === password);
    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        return true;
    } else {
        return false;
    }
}
$(function () {
    $("#signIn").click(function (e) {
        e.preventDefault();
        let btn = $(this);
        if (btn.attr("disabled")) return;
        btn.attr("disabled", true);
        btn.text("Loading...");
        setTimeout(() => {
            if (login()) {
                alert("Log in successfully!");
                window.location.href = "../home.html";
            } else {
                alert("The account does not exist.")
                btn.attr("disabled", false);
                btn.text("Login");
            }
        }, 1500);
    });

    $(".toggle-password").click(function () {
        let targetId = $(this).attr("data-target");
        let passwordInput = $("#" + targetId);

        if (passwordInput.attr("type") === "password") {
            passwordInput.attr("type", "text");
            $(this).removeClass("ti-lock").addClass("ti-unlock");
        } else {
            passwordInput.attr("type", "password");
            $(this).removeClass("ti-unlock").addClass("ti-lock");
        }
    });
})
