let currentUser = localStorage.getItem("loginUser");
if (!currentUser) {
    window.location.href = "login.html";
}
let expenses = JSON.parse(localStorage.getItem(`expenses_${currentUser}`)) || [];
let currentPage = 1;
const itemsPerPage = 5;
let currentSearch = "";
let currentSortOrder = "none";
// Trang đăng xuất
function logout() {
    Swal.fire({
        title: "<h3>Bạn có chắc chắn muốn đăng xuất không?</h3>",
        icon: "question",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: `Có`,
        cancelButtonText: `Không`,
    }).then((result) => {
        if (result.isConfirmed) {  // Nếu người dùng nhấn "Có"
            localStorage.removeItem("loginUser"); // Xóa thông tin đăng nhập
            window.location.href = "login.html"; // Chuyển về trang đăng nhập
        }
    });
}

// Hiển thị Menu
function toggleMenu() {
    let menu = document.getElementById("logoutMenu");
    if (menu.classList.contains("hidden")) {
        menu.classList.remove("hidden");
    } else {
        menu.classList.add("hidden");
    }
}
// Số tiền còn lại
function saveMoney() {
    let moneyInput = document.getElementById("budget");
    let money = parseFloat(moneyInput.value); // Chuyển giá trị nhập vào thành số

    let remainMoneyElement = document.getElementById("remainMoney");

    if (isNaN(money) || money <= 0) {
        remainMoneyElement.innerText = "Số tiền không hợp lệ hoặc chưa nhập";
        remainMoneyElement.style.color = "red";
    } else {
        remainMoneyElement.innerText = money + " VND";
        remainMoneyElement.style.color = "#22C55E";
    }
}
//Quản lý ngân hàng
let categories = JSON.parse(localStorage.getItem(`categories_${currentUser}`)) || [];
let editIndex = null;

function addCategory() {
    let name = document.getElementById("category-name").value.trim().toLowerCase();
    let limit = parseFloat(document.getElementById("category-limit").value.trim());
    if (name && !isNaN(limit) && limit > 0) {
        categories.push({ name, limit });
        localStorage.setItem(`categories_${currentUser}`, JSON.stringify(categories));
        renderCategories();
        document.getElementById("category-name").value = "";
        document.getElementById("category-limit").value = "";

    } else if (limit < 0) {
        Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Số tiền không được âm hoặc bằng 0!",
            confirmButtonText: "OK"
        });

    } else {
        Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Vui lòng nhập đủ thông tin!",
            confirmButtonText: "OK"
        });
    }
}
// Hiển thị danh mục
function renderCategories() {
    let container = document.getElementById("category-list");
    document.getElementById("edit-form").style.display = "none";
    container.innerHTML = "";

    categories.forEach((cat, index) => {
        container.innerHTML += `
            <div class="category-item">
                <div class="category-content">
                    <span>${cat.name} - Giới hạn: ${cat.limit.toLocaleString()} VND </span>
                </div>
                <div class="category-action">
                    <a href="#" class="edit-btn" onclick="startEdit(${index})">Sửa</a>
                    <a href="#" class="delete-btn" onclick="deleteCategory(${index})">Xóa</a>
                </div>
            </div>`;
    });
}
// Xóa danh mục
function deleteCategory(index) {
    Swal.fire({
        title: "Bạn có chắc muốn xoá danh mục này?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "red",
        confirmButtonText: "Có",
        cancelButtonText: "Hủy",
    }).then((result) => {
        if (result.isConfirmed) {
            categories.splice(index, 1);
            localStorage.setItem(`categories_${currentUser}`, JSON.stringify(categories));
            renderCategories();
            Swal.fire({
                icon: "success",
                title: "Đã xoá!",
                text: "Danh mục đã được xoá.",
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}


// Sửa danh mục
function startEdit(index) {
    editIndex = index;
    document.getElementById("edit-name").value = categories[index].name;
    document.getElementById("edit-limit").value = categories[index].limit;
    document.getElementById("edit-form").style.display = "block";

}

// Lưu lại sửa
function saveEdit() {
    let newName = document.getElementById("edit-name").value.trim();
    let newLimit = parseFloat(document.getElementById("edit-limit").value.trim());

    if (newName && !isNaN(newLimit) && newLimit > 0) {
        categories[editIndex] = { name: newName, limit: newLimit };
        localStorage.setItem(`categories_${currentUser}`, JSON.stringify(categories));
        renderCategories();
        cancelEdit();
    } else {
        Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Vui lòng nhập đủ thông tin!",
            confirmButtonText: "OK"
        });
    }
}
// Hủy sửa 
function cancelEdit() {
    document.getElementById("edit-form").style.display = "none";
    editIndex = null;
}

// Hàm khởi tạo khi load trang
window.onload = function () {
    renderCategories();
    renderTransactions();
};

// Thêm chi tiêu
function addExpense() {
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value.trim();
    const note = document.getElementById("note").value.trim();

    if (isNaN(amount) || category === "") {
        Swal.fire({
            icon: "warning",
            title: "Lỗi",
            text: "Vui lòng nhập đầy đủ thông tin!"
        });
        return;
    }

    if (amount <= 0) {
        Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Số tiền phải lớn hơn 0!"
        });
        return;
    }

    const expense = {
        amount,
        category,
        note,
        createdAt: new Date().toISOString()
    };

    expenses.push(expense);
    localStorage.setItem(`expenses_${currentUser}`, JSON.stringify(expenses));

    // Reset input
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";
    document.getElementById("note").value = "";

    renderTransactions();

    Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Giao dịch đã được lưu lại!"
    });
}
// Tìm kiếm lịch sử
function searchTransactions(keyword) {
    currentSearch = keyword;
    currentPage = 1; // về trang đầu
    renderTransactions();
}
// Hiển thị giao dịch
function renderTransactions() {
    // Xóa nội dung cũ trước khi render lại
    const listContainer = document.getElementById("expense-list");
    listContainer.innerHTML = "";
    // Xử lý từ khóa tìm kiếm
    const searchKeyword = currentSearch.toLowerCase();
    // Lọc các giao dịch theo người nhập
    let filtered = expenses.filter(e => e.amount >= 0 && (e.category.toLowerCase().includes(searchKeyword) || (e.note && e.note.toLowerCase().includes(searchKeyword))));

    // Sắp xếp theo giá
    if (currentSortOrder === "asc") {
        filtered.sort((a, b) => a.amount - b.amount);
    } else if (currentSortOrder === "desc") {
        filtered.sort((a, b) => b.amount - a.amount);
    }
    // Tính tổng số trang
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalPages) {
        currentPage = 1; //Load lại trang nếu bị vượt quá
    }
    // Gọi vị trí trang từ đầu đến cuối
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filtered.slice(start, end);
    // Hiển thị giao dịch ra trang chính
    pageItems.forEach((e) => {
        const item = document.createElement("div");
        item.innerHTML = ` <div class="expense-item"> ${e.category} - ${e.note || ""}: ${e.amount.toLocaleString()} VND 
            <a href="#" class="delete-link" onclick="deleteExpense(${expenses.indexOf(e)})">Xóa</a> </div>`;
        listContainer.appendChild(item);
    });

    renderPagination(totalPages);
}
// Cập nhật sắp xếp
function updateSortButton() {
    const sortBtn = document.getElementById("sortToggleBtn");
    if (currentSortOrder === "asc") {
        sortBtn.innerText = "Theo giá tăng";
    } else if (currentSortOrder === "desc") {
        sortBtn.innerText = "Theo giá giảm";
    } else {
        sortBtn.innerText = "Sắp xếp";
    }
}
// Chuyển đổi thứ tự sắp xếp
function toggleSort() {
    if (currentSortOrder === "none") {
        currentSortOrder = "asc";
    } else if (currentSortOrder === "asc") {
        currentSortOrder = "desc";
    } else {
        currentSortOrder = "none";
    }
    updateSortButton();
    renderTransactions();
}

// Xoá giao dịch
function deleteExpense(index) {
    Swal.fire({
        title: "Xoá giao dịch?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Có",
        cancelButtonText: "Hủy"
    }).then(result => {
        if (result.isConfirmed) {
            expenses.splice(index, 1);
            localStorage.setItem(`expenses_${currentUser}`, JSON.stringify(expenses));
            renderTransactions();

            Swal.fire({
                icon: "success",
                title: "Đã xoá thành công",
                showConfirmButton: false,
                timer: 1200
            });
        }
    });
}
// Phân trang
function renderPagination(totalPages) {
    // Xóa lịch sử cũ khi phân trang
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    // Nút trước
    const prevBtn = document.createElement("button");
    prevBtn.className = "btn btn-outline-primary";
    prevBtn.innerText = "Previous";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => changePage("prev");
    paginationContainer.appendChild(prevBtn);

    // Vòng lặp số trang
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.className = "btn btn-outline-secondary";
        if (i === currentPage) {
            pageBtn.classList.add("active");
            pageBtn.classList.replace("btn-outline-secondary", "btn-primary");
        }
        pageBtn.innerText = i;
        pageBtn.onclick = () => {
            currentPage = i;
            renderTransactions();
        };
        paginationContainer.appendChild(pageBtn);
    }

    // Nút Next
    const nextBtn = document.createElement("button");
    nextBtn.className = "btn btn-outline-primary";
    nextBtn.innerText = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => changePage("next");
    paginationContainer.appendChild(nextBtn);
}