const API_URL = "https://script.google.com/macros/s/AKfycbz9ccZ0AkrAirwQwA02Zd0t9vBNtT7kvAMlD0GD1ySs-o60FHMZiEJb85tr43FqZBmf/exec";

let allProducts = [];

const search2 = document.getElementById("search2");
const categorySelect = document.getElementById("category");

async function loadData() {
  const res = await fetch(API_URL);
  allProducts = await res.json();

  setupCategory();
  applyFilter();
}

function render(data) {
  const container = document.getElementById("list");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No product found</p>";
    return;
  }

  data.forEach(p => {
    container.innerHTML += `
      <div class="card" onclick='openModal(${JSON.stringify(p)})'>
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>${p.category}</p>
        <p>$${p.price_usd} / ៛${formatRiel(p.price_riel)}</p>
        <small>${p.description}</small>
      </div>
    `;
  });
}

function setupCategory() {
  const categories = [...new Set(allProducts.map(p => p.category))];

  categorySelect.innerHTML =
    `<option value="all">All</option>` +
    categories.map(c => `<option value="${c}">${c}</option>`).join("");
}

function applyFilter() {
  let data = [...allProducts];

  const searchValue = search2.value.toLowerCase();
  const categoryValue = categorySelect.value;

  if (searchValue) {
    data = data.filter(p =>
      p.name.toLowerCase().includes(searchValue)
    );
  }

  if (categoryValue !== "all") {
    data = data.filter(p =>
      p.category === categoryValue
    );
  }

  render(data);
}

function openModal(p) {
  const modal = document.getElementById("modal");

  modal.classList.add("show");

  document.getElementById("modal-img").src = p.image;
  document.getElementById("modal-name").innerText = p.name;
  document.getElementById("modal-category").innerText = p.category;
  document.getElementById("modal-price").innerText =
  `$${p.price_usd} / ៛${formatRiel(p.price_riel)}`;
  document.getElementById("modal-desc").innerText = p.description;
}

function closeModal() {
  document.getElementById("modal").classList.remove("show");
}

const modal = document.getElementById("modal");

modal.addEventListener("click", function (e) {
  if (e.target === modal) {
    closeModal();
  }
});

search2.addEventListener("input", applyFilter);
categorySelect.addEventListener("change", applyFilter);

loadData();

function formatRiel(value) {
  return Number(value).toLocaleString("en-US");
}
