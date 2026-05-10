console.log(JSON.parse(localStorage.getItem("user")));
function validName() {
    let name = $("#fullName").val().trim();
    if (name === "") {
        $(".validReName").text("The name cannot be left blank.");
        return false;
    } else {
        if (!(/^[A-ZÀ-Ỹa-zà-ỹ']{2,}(\s[A-ZÀ-Ỹa-zà-ỹ]+)*$/).test(name)) {
            $(".validReName").text("Invalid name");
            return false;
        } else {
            $(".validReName").text("");
            return true;
        }
    }
}
function validPhone() {
    let phone = $("#phoneNumber").val().trim();
    if (phone === "") {
        $(".validRePhone").text("Please enter your phone number.");
        return false;
    } else {
        if (!(/^0\d{9}$/.test(phone))) {
            $(".validRePhone").text("Invalid phone number");
            return false;
        } else {
            $(".validRePhone").text("");
            return true;
        }
    }
}
function validAddress() {
    let p = $("#province").val();
    let d = $("#district").val();
    let w = $("#ward").val();

    if (!p || !d || !w) {
        $(".validReAddress").text("Please select the full address.");
        return false;
    }

    $(".validReAddress").text("");
    return true;
}
function validEmail() {
    let email = $("#email").val().trim();
    if (email === "") {
        $(".validReEmail").text("Please enter email");
        return false;
    } else {
        if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email)) {
            $(".validReEmail").text("Invalid email");
            return false;
        } else {
            $(".validReEmail").text("");
            return true;
        }
    }
}
function validPass() {
    let pass = $("#password").val().trim();
    if (pass.length < 8) {
        $(".validPass").text("Password must be at least 8 characters long.");
        return false;
    } else {
        $(".validPass").text("");
        return true;
    }
}
function validRePass() {
    let rePass = $("#rePass").val().trim();
    let pass = $("#password").val().trim();
    if (rePass != pass) {
        $(".validRePass").text("Passwords do not match");
        return false;
    } else {
        $(".validRePass").text("");
        return true;
    }
}
function register() {
    let name = $("#fullName").val().trim();
    let phone = $("#phoneNumber").val().trim();
    let email = $("#email").val().trim();
    let pass = $("#password").val().trim();

    let user = JSON.parse(localStorage.getItem("user")) || [];
    let exist = user.find(u => u.email === email);
    if (exist) {
        alert("Email already exists.");
        return;
    }
    let newUser = {
        name,
        phone,
        ward: {
            code: $("#ward").val(),
            name: $("#ward option:selected").text()
        },
        district: {
            code: $("#district").val(),
            name: $("#district option:selected").text()
        },
        province: {
            code: $("#province").val(),
            name: $("#province option:selected").text()
        },
        email,
        pass
    }
    user.push(newUser);
    localStorage.setItem("user", JSON.stringify(user));
    return true;
}
$(function () {
    $("#fullName").blur(function (e) {
        validName();
    });
    $("#phoneNumber").blur(function (e) {
        e.preventDefault();
        validPhone();
    });

    $.get("https://provinces.open-api.vn/api/p/", function (data) {
        data.forEach(p => {
            $("#province").append(`<option value="${p.code}">${p.name}</option>`);
        });
    });

    $("#province").change(function () {
        let provinceCode = $(this).val();

        $("#district").html('<option value="">Select District/County</option>');
        $("#ward").html('<option value="">Select Commune/Ward</option>');

        if (provinceCode) {
            $.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`, function (data) {
                data.districts.forEach(d => {
                    $("#district").append(`<option value="${d.code}">${d.name}</option>`);
                });
            });
        }
    });

    $("#district").change(function () {
        let districtCode = $(this).val();

        $("#ward").html('<option value="">Select Commune/Ward</option>');

        if (districtCode) {
            $.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`, function (data) {
                data.wards.forEach(w => {
                    $("#ward").append(`<option value="${w.code}">${w.name}</option>`);
                });
            });
        }
    });
    $("#email").blur(function (e) {
        e.preventDefault();
        validEmail();
    });
    $("#password").blur(function (e) {
        e.preventDefault();
        validPass();
    });
    $("#rePass").blur(function (e) {
        e.preventDefault();
        validRePass();
    });

    $("#submit").click(function (e) {
        e.preventDefault();
        let btn = $(this);
        if (validName() && validPhone() && validAddress() && validEmail() && validPass() && validRePass()) {
            if (btn.attr("disabled")) return;
            btn.attr("disabled", true);
            btn.text("Loading...");
            setTimeout(function () {
                if (register()) {
                    alert("Registered successfully");
                    window.location.href = "../login.html";
                } else {
                    btn.attr("disabled", false);
                    btn.text("Create an account");
                }
            }, 1500)
        }
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
});