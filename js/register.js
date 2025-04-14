document.querySelector(".emailError").style.display = "none";

// Lấy thông tin user
let dataUser = JSON.parse(localStorage.getItem("dataUser")) || { email: [], password: [] };

// Đăng ký
function register() {
    let email = document.getElementById("txtRegisterEmail").value.trim();
    let password = document.getElementById("txtRegisterPassword").value.trim();
    let confirmPassword = document.getElementById("txtRegisterConfirmPassword").value.trim();

    for (let i = 0; i < dataUser.email.length; i++) {
        if (dataUser.email[i] === email) {
            showErrorEmail("Email đã bị trùng!");
            return;
        }
    }

    if (!validateEmail(email)) {
        showErrorEmail("Email không hợp lệ!");
        return;
    } else {
        document.querySelector(".emailError").style.display = "none";
    }

    if (password.length < 6) {
        showErrorEmail("Mật khẩu phải có ít nhất 6 ký tự!");
        return;
    }

    if (password !== confirmPassword) {
        showErrorEmail("Mật khẩu không khớp!");
        return;
    }

    // Lưu tên người dùng
    dataUser.email.push(email);
    dataUser.password.push(password);
    localStorage.setItem("dataUser", JSON.stringify(dataUser));

    Swal.fire({
        title: "<h3>Thông báo</h3>",
        html: "Đăng ký thành công!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
    });

    setTimeout(() => {
        window.location.href = "../pages/login.html";
    }, 1500);
}

// Kiểm tra định dạng email
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Hiển thị lỗi đăng ký
function showErrorEmail(txtError) {
    document.querySelector(".emailError").style.display = "block";
    document.querySelector(".emailError").textContent = txtError;
}
