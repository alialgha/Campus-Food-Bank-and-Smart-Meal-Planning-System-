let user = localStorage.getItem("currentUser");
if (!user) {
  window.location.href = "index.html";
}
document.getElementById("userName").textContent = user;

let defaultInventory = [
  { id: 1, name: "Rice", category: "Grains", quantity: 10, icon: "🍚" },
  { id: 2, name: "Pasta", category: "Grains", quantity: 15, icon: "🍝" },
  { id: 3, name: "Beans", category: "Canned Goods", quantity: 20, icon: "🫘" },
  { id: 4, name: "Milk", category: "Dairy", quantity: 20, icon: "🥛" },
  { id: 5, name: "Potatoes", category: "Vegetables", quantity: 25, icon: "🥔" },
  { id: 6, name: "Whole Hen", category: "Meat", quantity: 6, icon: "🍗" },
  { id: 7, name: "Carrots", category: "Vegetables", quantity: 18, icon: "🥕" },
  { id: 8, name: "Bell Peppers", category: "Vegetables", quantity: 12, icon: "🫑" },
  { id: 9, name: "Bread", category: "Bakery", quantity: 8, icon: "🍞" },
  { id: 10, name: "Eggs", category: "Dairy", quantity: 30, icon: "🥚" },
  { id: 11, name: "Apples", category: "Fruits", quantity: 22, icon: "🍎" },
  { id: 12, name: "Canned Tuna", category: "Canned Goods", quantity: 14, icon: "🐟" }
];

let inventory = JSON.parse(localStorage.getItem("inventory")) || defaultInventory;
localStorage.setItem("inventory", JSON.stringify(inventory));

let listKey = "list_" + user;
let shoppingList = JSON.parse(localStorage.getItem(listKey)) || [];

function saveList() {
  localStorage.setItem(listKey, JSON.stringify(shoppingList));
  document.getElementById("listCount").textContent = shoppingList.length;
}

function showToast(text) {
  document.getElementById("toastText").textContent = text;
  bootstrap.Toast.getOrCreateInstance(document.getElementById("toast"), { delay: 1500 }).show();
}

function showFood() {
  let text = document.getElementById("search").value.toLowerCase();
  let items = inventory.filter(i => i.name.toLowerCase().includes(text) || i.category.toLowerCase().includes(text));
  let grid = document.getElementById("foodGrid");

  if (items.length === 0) {
    grid.innerHTML = '<p class="text-center">No food items found.</p>';
    return;
  }

  grid.innerHTML = items.map(i => `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="food-card p-3 h-100">
        <div class="food-icon">${i.icon}</div>
        <h5 class="mb-1">${i.name}</h5>
        <p class="small mb-1">Category: ${i.category}</p>
        <p class="small mb-2">Available: ${i.quantity}</p>
        <button class="btn btn-red btn-sm w-100" onclick="addToList(${i.id})">
          <i class="bi bi-cart-plus"></i> Add to List
        </button>
      </div>
    </div>
  `).join("");
}

function addToList(id) {
  let food = inventory.find(i => i.id === id);
  let item = shoppingList.find(i => i.id === id);

  if (item) {
    if (item.quantity < food.quantity) {
      item.quantity++;
    } else {
      showToast("No more " + food.name + " available.");
      return;
    }
  } else {
    shoppingList.push({ id: food.id, name: food.name, category: food.category, quantity: 1 });
  }

  saveList();
  showToast(food.name + " added to your list.");
}

function showList() {
  let body = document.getElementById("listBody");
  document.getElementById("emptyMsg").classList.toggle("d-none", shoppingList.length > 0);

  body.innerHTML = shoppingList.map(i => {
    let max = inventory.find(f => f.id === i.id).quantity;
    return `
      <tr>
        <td>${i.name}</td>
        <td>${i.category}</td>
        <td><input type="number" class="form-control form-control-sm" min="1" max="${max}" value="${i.quantity}" onchange="updateQty(${i.id}, this.value)"></td>
        <td class="text-end"><button class="btn btn-sm btn-outline-danger" onclick="removeItem(${i.id})"><i class="bi bi-trash"></i> Remove</button></td>
      </tr>
    `;
  }).join("");
}

function updateQty(id, value) {
  let item = shoppingList.find(i => i.id === id);
  let max = inventory.find(f => f.id === id).quantity;
  let qty = parseInt(value) || 1;
  item.quantity = Math.min(Math.max(qty, 1), max);
  saveList();
  showList();
}

function removeItem(id) {
  shoppingList = shoppingList.filter(i => i.id !== id);
  saveList();
  showList();
}

function clearList() {
  shoppingList = [];
  saveList();
  showList();
}

function clearSearch() {
  document.getElementById("search").value = "";
  showFood();
}

function showPage(page) {
  document.getElementById("inventoryPage").classList.toggle("d-none", page !== "inventory");
  document.getElementById("listPage").classList.toggle("d-none", page !== "list");
  if (page === "list") showList();
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

document.getElementById("search").addEventListener("input", showFood);
showFood();
saveList();
