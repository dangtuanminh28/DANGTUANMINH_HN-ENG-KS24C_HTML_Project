document.querySelector(".loginError").style.display = "none";

// Lấy thông tin người dùng
let dataUser = JSON.parse(localStorage.getItem("dataUser")) || { email: [], password: [] };

// Đăng nhập
function login() {
    let email = document.getElementById("txtLoginEmail").value.trim();
    let password = document.getElementById("txtLoginPassword").value.trim();

    if (email === "" || password === "") {
        showErrorLogin("Vui lòng nhập email và mật khẩu!");
        return;
    }

    for (let i = 0; i < dataUser.email.length; i++) {
        if (dataUser.email[i] === email && dataUser.password[i] === password) {
            document.querySelector(".loginError").style.display = "none";
            localStorage.setItem("loginUser", email); // Lưu email đang đăng nhập
            window.location = "../pages/index.html"; // Chuyển sang trang chính
            return;
        }
    }

    showErrorLogin("Tài khoản hoặc mật khẩu không đúng!");
}

// Hiển thị lỗi đăng nhập
function showErrorLogin(txtError) {
    document.querySelector(".loginError").style.display = "block";
    document.querySelector(".loginError").textContent = txtError;
}
