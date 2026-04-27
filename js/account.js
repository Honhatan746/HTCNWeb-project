let user = JSON.parse(localStorage.getItem("currentUser"));
if (!user) {
    if (confirm("Vui lòng đăng nhập?")) {
        window.location.href = "../login.html";
    } else {
        window.location.href = "../home.html";
    }
}
function renderUser() {
    let address = user.ward.name + "/" + user.district.name + "/" + user.province.name;
    document.getElementById("fullNameAccount").innerHTML = user.name;
    document.getElementById("emailAccount").innerHTML = `<i class="ti-email"></i> ${user.email}`;
    document.getElementById("addressAccount").innerHTML = address.trim() !== "" ? `<i class="ti-map-alt"></i> ${address}` : "";
    document.getElementById("telAccount").innerHTML = user.phone ? `<i class="ti-mobile"></i> ${user.phone}` : "";

    document.querySelector("input[name='fullName']").value = user.name;
    document.querySelector("input[name='phone']").value = user.phone || "";
    document.querySelector("textarea[name='address']").value = address || "";
    document.querySelector("input[type='email']").value = user.email;

    renderAddress();

}
async function renderAddress() {
    const provinceSelect = document.getElementById("province");
    const districtSelect = document.getElementById("district");
    const wardSelect = document.getElementById("ward");

    let provinces = await fetch("https://provinces.open-api.vn/api/p/")
        .then(res => res.json());

    provinceSelect.innerHTML = '<option value="">Chọn Tỉnh</option>';
    provinces.forEach(p => {
        let option = document.createElement("option");
        option.value = p.code;
        option.textContent = p.name;
        provinceSelect.appendChild(option);
    });

    provinceSelect.value = user.province.code;

    let districts = await fetch(`https://provinces.open-api.vn/api/p/${user.province.code}?depth=2`)
        .then(res => res.json());

    districtSelect.innerHTML = '<option value="">Chọn Huyện</option>';

    districts.districts.forEach(d => {
        let option = document.createElement("option");
        option.value = d.code;
        option.textContent = d.name;
        districtSelect.appendChild(option);
    });

    districtSelect.value = user.district.code;
    let wards = await fetch(`https://provinces.open-api.vn/api/d/${user.district.code}?depth=2`)
        .then(res => res.json());

    wardSelect.innerHTML = '<option value="">Chọn Xã</option>';

    wards.wards.forEach(w => {
        let option = document.createElement("option");
        option.value = w.code;
        option.textContent = w.name;
        wardSelect.appendChild(option);
    });

    wardSelect.value = user.ward.code;
}

function handleUpdateProfile() {
    const form = document.getElementById("profileForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const fullName = form.fullName.value.trim();
        const phone = form.phone.value.trim();
        let provinceSelect = document.getElementById("province");
        let districtSelect = document.getElementById("district");
        let wardSelect = document.getElementById("ward");

        // Validate
        if (!(/^[A-ZÀ-Ỹa-zà-ỹ']{2,}(\s[A-ZÀ-Ỹa-zà-ỹ]+)*$/).test(fullName)) {
            document.querySelector(".validReName").textContent = "Tên không hợp lệ";
            return;
        } else {
            document.querySelector(".validReName").textContent = "";
        }

        if (phone && !/^0\d{9}$/.test(phone)) {
            document.querySelector(".validRePhone").textContent = "Số điện thoại không hợp lệ";
            return;
        } else {
            document.querySelector(".validRePhone").textContent = "";
        }
        if (!document.getElementById("province").value || !document.getElementById("district").value || !document.getElementById("ward").value) {
            document.querySelector(".validAddress").textContent = "Vui lòng chọn địa chỉ đầy đủ";
            return;
        } else {
            document.querySelector(".validAddress").textContent = "";
        }

        const btn = document.querySelector(".luuProfile");
        btn.disabled = true;
        btn.textContent = "Đang xử lý...";
        setTimeout(() => {
            let newUser = {
                ...user,
                name: fullName,
                phone,
                ward: {
                    code: wardSelect.value,
                    name: wardSelect.options[wardSelect.selectedIndex].text
                },
                district: {
                    code: districtSelect.value,
                    name: districtSelect.options[districtSelect.selectedIndex].text
                },
                province: {
                    code: provinceSelect.value,
                    name: provinceSelect.options[provinceSelect.selectedIndex].text
                }
            }

            console.log(newUser);

            localStorage.setItem("currentUser", JSON.stringify(newUser));

            let users = JSON.parse(localStorage.getItem("user")) || [];
            users = users.map(u => u.email === user.email ? newUser : u);

            localStorage.setItem("user", JSON.stringify(users));
            alert("Chỉnh sửa thành công");
            btn.disabled = false;
            btn.textContent = "Lưu thay đổi";
            window.location.href = "../account.html"
        }, 1500);
    })

}
function handleChangePassword() {
    const form = document.getElementById("passwordForm");
    if (!form) return;

    const newPass = document.getElementById("newPassword");
    const confirmPass = document.getElementById("confirmPassword");
    const error = document.getElementById("matchError");

    confirmPass.addEventListener("input", () => {
        if (confirmPass.value !== newPass.value) {
            error.classList.remove("d-none");
        } else {
            error.classList.add("d-none");
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const oldPassword = document.getElementById("oldPassword").value.trim();
        const newPassword = newPass.value.trim();
        const confirmPassword = confirmPass.value.trim();
        console.log(oldPassword, newPassword, confirmPassword);
        // VALIDATE
        if (oldPassword != user.pass) {
            document.querySelector(".valdiOldPass").textContent = "Mật khẩu không chính xác";
            return;
        } else {
            document.querySelector(".valdiOldPass").textContent = "";
        }
        if (newPassword.length < 8) {
            document.querySelector(".validPass").textContent = "Mật khẩu phải 8 ký tự";
            return;
        } else {
            document.querySelector(".validPass").textContent = "";
        }

        if (newPassword !== confirmPassword) {
            error.classList.remove("d-none");
            return;
        } else {
            error.classList.add("d-none");
        }

        let btn = document.getElementById("matKhau");

        btn.disabled = true;
        btn.textContent = "Đang xử lý...";
        setTimeout(() => {
            let newPass = {
                ...user,
                pass: newPassword
            }
            localStorage.setItem("currentUser", JSON.stringify(newPass));
            let users = JSON.parse(localStorage.getItem("user"));
            users = users.map(u => user.email === u.email ? newPass : u);
            localStorage.setItem("user", JSON.stringify(users));

            alert("cập nhật thành công");
            btn.disabled = false;
            btn.textContent = "Cập nhật mật khẩu";
            window.location.href = "../account.html";
        }, 1500);

    })
    console.log(user);
    console.log(JSON.parse(localStorage.getItem("user")));
}
function logout() {
    document.getElementById("logout").addEventListener("click", () => {
        if (confirm("Bạn có muốn đăng xuất không ?")) {
            localStorage.removeItem("currentUser");
            window.location.href = "../login.html";
        }
    })
}
document.addEventListener("DOMContentLoaded", () => {
    renderUser(),
        handleUpdateProfile(),
        handleChangePassword(),
        logout()
});
document.querySelectorAll(".toggle-password").forEach(icon => {
    icon.addEventListener("click", function () {
        // Tìm input tương ứng dựa trên data-target
        const targetId = this.getAttribute("data-target");
        const passwordInput = document.getElementById(targetId);

        // Chuyển đổi type giữa password và text
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            this.classList.replace("ti-lock", "ti-unlock");
        } else {
            passwordInput.type = "password";
            this.classList.replace("ti-unlock", "ti-lock");
        }
    });
});
// Sự kiện thay đổi Tỉnh/Thành phố
document.getElementById("province").addEventListener("change", function () {
    let provinceCode = this.value;

    // Reset các dropdown con
    document.getElementById("district").innerHTML = '<option value="">Chọn Quận/Huyện</option>';
    document.getElementById("ward").innerHTML = '<option value="">Chọn Xã/Phường</option>';

    if (provinceCode) {
        fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
            .then(response => response.json())
            .then(data => {
                let districtSelect = document.getElementById("district");
                data.districts.forEach(d => {
                    let option = document.createElement("option");
                    option.value = d.code;
                    option.textContent = d.name;
                    districtSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Lỗi:', error));
    }
});

// Sự kiện thay đổi Quận/Huyện
document.getElementById("district").addEventListener("change", function () {
    let districtCode = this.value;

    // Reset dropdown Phường/Xã
    document.getElementById("ward").innerHTML = '<option value="">Chọn Xã/Phường</option>';

    if (districtCode) {
        fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
            .then(response => response.json())
            .then(data => {
                let wardSelect = document.getElementById("ward");
                data.wards.forEach(w => {
                    let option = document.createElement("option");
                    option.value = w.code;
                    option.textContent = w.name;
                    wardSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Lỗi:', error));
    }
});