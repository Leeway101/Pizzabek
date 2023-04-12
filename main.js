const root = document.getElementById("root");
const badge = document.getElementById("badge");
const modalBody = document.querySelector(".modal-body");
const total = document.getElementById("total");
const input = document.getElementById("input");
const select = document.getElementById("select");
const modal = document.querySelector(".modal")
const form = document.querySelector("#form")

// Filter
const filtBtn = document.querySelectorAll(".filt-btn")
filtBtn.forEach((element, idx) => {

  element.addEventListener('click', (e) => {
    closeModal()
    e.preventDefault()
    if (element.id === "pishloqli") {
      root.innerHTML = ''
      fetchAll("http://localhost:7777/pishloqli")
    } else if (element.id === "gushtli") {
      root.innerHTML = ''
      fetchAll("http://localhost:7777/goshtli")
    } else if (element.id === "quziqorinli") {
      root.innerHTML = ''
      fetchAll("  http://localhost:7777/qoziqorinli")
    } else if (element.id === "achchiq") {
      root.innerHTML = ''
      fetchAll("http://localhost:7777/achchiq")
    } else if (element.id === "barchasi") {
      root.innerHTML = ''
      fetchAll("http://localhost:7777/barcha-pitsalar")
    }
  })
})


// end filter

let korzinka = []
let barcha = [];
let pitsalar = [];
// Input search
input.addEventListener("input", (e) => {
  if (input.value === "") {
    fetchAll("http://localhost:7777/barcha-pitsalar")
  }
  e.preventDefault()
  let sortedProducts = barcha.filter((v) => v.title.toLowerCase().includes(input.value.toLowerCase()))
  console.log(sortedProducts);
  root.innerHTML = ''
  render(sortedProducts)
});

async function fetchAll(url) {
  const res = await fetch(url)
  const data = await res.json()
  console.log(data);
  barcha = data
  pitsalar = data
  render(barcha)
}
fetchAll("http://localhost:7777/barcha-pitsalar")

if (input.value === "") {
  fetchAll()
}

function render(arr) {
  console.log('render called');
  let res = "";
  arr.forEach((product) => {
    res += `
    <div id="card" onclick="openModal(${product.id - 1})">
    <div class="row container  cards" >
        <div class="col-sm-3 d-flex flex-md-column text-center card-body">
            <img style="height: 140px; width: 250px; margin: 10px;" src="${product.image}" class="card-img-top" alt="${product.image}">
            <div class="card-text">
                <h3 class="card-h3">${product.title}</h3>
                <h4  class="card-p">${product.description}</h4>
                <button  class="card-btn">${product.price}</button>
            </div>    
        </div>
    </div>
    </div>`;
  });
  root.innerHTML += res;
  res = ""
}

let num = 0;
function openModal(id) {
  num = 0;
  document.getElementById('myModal').style.display = "block";
  let prod = barcha.filter((product) => product.id === id + 1);
  console.log(prod[0]);
  document.getElementById("modal-content-body").innerHTML = `
    <div>
      <img src="${prod[0].image}"/>
    </div>
    <div>
      <h1>${prod[0].title}</h1>
      <p>
      ${prod[0].description}
      </p>
      <div class="py-3 sanoq-div">
      <button id="sanoq" onclick="decrease(${prod[0].id})">-</button>
      <span id="count_p">0</span>
      <button id="sanoq" onclick="increase(${prod[0].id})">+</button>
      </div>
      <div class=" razmer">
        <button id="razmer" onclick="setXamir(${prod[0].id})">Qalin</button>
        <button onclick="setXamir(${prod[0].id})">Ingichka</button>
      </div>
      <div class="py-3">
        <button id="qushish" onclick="addToBag(${prod[0].id})">Savatga qushish</button>
      </div>
    </div>
  `
}
function setXamir(product) {
  let setted = barcha.filter((p) => p.id === product ? p.xamir = "qalin" : "ingichka")
  console.log(setted);
}
function decrease(product) {
  if (num != 0) num--
  document.getElementById('count_p').innerText = num
  let decreased = barcha.filter((p) => p.id === product ? parseInt(p.count) += parseInt(num) : null)
  console.log(decreased);
}
function increase(product) {
  num++
  document.getElementById('count_p').innerText = num
  let increased = barcha.filter((p) => p.id === product ? p.count += parseInt(num) : null)
  console.log(increased);
}

function closeModal() {
  document.getElementById('myModal').style.display = "none";
}

function deleteProduct(ind) {
  // count -= korzinka[ind].price;
  // korzinka.splice(ind, 1)
  // badge.textContent = korzinka.length;
  // korzinkaRender();
  // total.textContent = count.toFixed(2);
  // if (korzinka.length === 0) {
  //   modalBody.innerHTML = `<img width="100%" src="./images/karzinka-empty.png" alt="">`
  // }
  if (korzinka.find((product) => product.id === ind)) {
    korzinka.splice(ind, 1)
    korzinkaRender()
    badge.innerText = korzinka.length
  }
}

// Korzinkaga tanlangan productlarni chiqazish
function korzinkaRender(korzinka) {
  console.log('korzinka');
  console.log(korzinka);
  modalBody.innerHTML = ""
  let res = "";
  if (korzinka?.length === 0) {
    modalBody.innerHTML = `<img width="100%" src="./images/karzinka-empty.png" alt="">`
  }
  korzinka?.forEach((v) => {
    res += `
    <div id="productDetail" class="d-flex align-items-center justify-content-between my-2">
        <div class="d-flex align-items-center gap-4">
          <img width="70" src="${v.image}"/>
            <div>
              <h4 class="korzinkaTitle">${v.title}</h4>
              <span class="text-muted">${v.xamir}</span>
              <h2 class="korzinkaTitle text-success">$${v.price}</h2> 
            </div>
            <div  class="d-flex align-items-center justify-content-between my-2">
              Nechta:${v.count}
              <button  id="uchirish" onclick="deleteProduct(${v.id})">delete</button>
            </div>
          </div>

        
      </div>
    `;

    modalBody.innerHTML = res;
  });
}

let count = 0;
// barcha - pitsalar[idsi].title
// Korzinkaga qoshish
function addToBag(idsi) {
  let filtred = barcha.filter((p) => p.id === idsi)
  console.log(filtred);
  if (filtred[0].count !== 0) {
    let korzinkaFilt = barcha.filter((product) => product.id === idsi)
    korzinka.push(...korzinkaFilt)
    console.log(korzinka);
    korzinkaRender(korzinka)
    badge.innerText = korzinka.length
  }
  else {
    alert("Pitsani Retsipini Tanlang")
    // korzinka = [...korzinka, ...barcha - pitsalar.slice(idsi, idsi + 1)]
    // badge.textContent = korzinka.length;
    // korzinkaRender();
    // count += barcha - pitsalar[idsi].price;
    // total.textContent = count.toFixed(2);
  }
}
