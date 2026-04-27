
function validName() {
    let name = $("#fullName").val().trim();
    if (name === "") {
        $(".validReName").text("Tên không được để trống");
        return false;
    } else {
        if (!(/^[A-ZÀ-Ỹa-zà-ỹ']{2,}(\s[A-ZÀ-Ỹa-zà-ỹ]+)*$/).test(name)) {
            $(".validReName").text("Tên không hợp lệ");
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
        $(".validRePhone").text("Vui lòng nhập số điện thoại");
        return false;
    } else {
        if (!(/^0\d{9}$/.test(phone))) {
            $(".validRePhone").text("Số điện thoại không hợp lệ");
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
        $(".validReAddress").text("Vui lòng chọn đầy đủ địa chỉ");
        return false;
    }

    $(".validReAddress").text("");
    return true;
}
function validEmail() {
    let email = $("#email").val().trim();
    if (email === "") {
        $(".validReEmail").text("Vui lòng nhập email");
        return false;
    } else {
        if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email)) {
            $(".validReEmail").text("Email không hợp lệ");
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
        $(".validPass").text("Mật khẩu ít nhất 8 ký tự");
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
        $(".validRePass").text("Mật khẩu hông khớp");
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
        alert("Email đã tồn tại rồi");
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

        $("#district").html('<option value="">Chọn Quận/Huyện</option>');
        $("#ward").html('<option value="">Chọn Xã/Phường</option>');

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

        $("#ward").html('<option value="">Chọn Xã/Phường</option>');

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
            btn.text("Đang xử lý...");
            setTimeout(function () {
                if (register()) {
                    alert("Đăng ký thành công");
                    window.location.href = "../login.html";
                } else {
                    btn.attr("disabled", false);
                    btn.text("Tạo tài khoản");
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