// // sticky cart
// let sidebar=document.getElementsByClassName("sidebar")[0]
// let sidebar_content=document.getElementsByClassName("content-wrapper")[0]

// window.onscroll=()=>{
//   let scrollTop=window.scrollY//current scroll position
//   let viewportHeight=window.innerHeight
//   let contentHeight=sidebar_content.getBoundingClientRect().height//current content height
//   let sidebarTop=sidebar.getBoundingClientRect().top+window.pageYOffset

//   if(scrollTop>=contentHeight-viewportHeight+sidebarTop){
//     sidebar_content.style.transform=`translateY(-${contentHeight-viewportHeight+sidebarTop}px)`
//     sidebar_content.style.position="fixed"
//   }
//   else{
//     sidebar_content.style.transform=""
//     sidebar_content.style.position=""
//   }

// }

// pop up
document.addEventListener("DOMContentLoaded",function () {
  let items = document.querySelector(".items");
  let popup = document.getElementById("popup");
  let itemName = document.getElementById("itemName");
  let itemQuantity = document.getElementById("itemQuantity");
  let itemPrice = document.getElementById("itemPrice");
  
})

document.addEventListener("DOMContentLoaded", function () {
  let products = document.querySelector(".products");
  async function fetchProducts(url) {
    try {
      let data = await fetch(url);
      let response = await data.json();

      for (let i = 0; i < response.length; i++) {
        // popup
        let item = response[i];


        let description = response[i].description;
        let title = response[i].title;
        products.innerHTML += `
            <div class="product">
                 <img src="${response[i].image}" alt="${
          response[i].category.name
        }" class="product-img">
                 <div class="product-content">
                 <h2 class="product-title">${
                   title.length > 18
                     ? title.substring(0, 18).concat("...")
                     : title
                 }</h2>
                 <h4 class="product-category">${response[i].category}</h4>
                 <p class="product-description">${
                   description.length > 20
                     ? description.substring(0, 80).concat("...more")
                     : description
                 }</p>
                 <div class="product-price-container">
                     <h3 class="product-price">Sh ${response[i].price}</h3>
                     <a href="#!" data-productID="${
                       response[i].id
                     }" class="add-to-cart">Add to Cart</a>
                 </div>     
                </div>           
    
            </div>
            `;

        // adding to cart
        let carts = document.querySelectorAll(".add-to-cart");

        let items = response.map((item) => ({
          name: item.category,
          tag: item.title,
          price: item.price,
          inCart: 0,
        }));
        //[

        // {
        //   name: "Grey Tshirt",
        //   tag: "grayTshirt",
        //   price: 15,
        //   inCart: 0,
        // },
        // {
        //   name: "Grey hoodie",
        //   tag: "greyhoodie",
        //   price: 15,
        //   incart: 0,
        // },
        // { name: "blackTshirt", tag: "blackTshirt", price: 150, inCart: 0 },
        // {
        //   name: "blackhoodie",
        //   tag: "blackhoodie",
        //   price: 150,
        //   inCart: 0,
        // },
        // ];

        for (let i = 0; i < carts.length; i++) {
          carts[i].addEventListener("click", () => {
            cartNumbers(items[i]);
            totalCost(items[i]);
          });
        }

        function onLoadCartNumbers() {
          let productNumbers = localStorage.getItem("cartNumbers");

          if (productNumbers) {
            document.querySelector(".cartTitle span").textContent =
              productNumbers;
          }
        }

        function cartNumbers(item) {
          // console.log("product clicked is ",item);
          let productNumbers = localStorage.getItem("cartNumbers");
          // console.log(productNumbers);
          // console.log(typeof productNumbers);
          productNumbers = parseInt(productNumbers);
          // console.log(typeof productNumbers);
          if (productNumbers) {
            localStorage.setItem("cartNumbers", productNumbers + 1);
            document.querySelector(".cartTitle span").textContent =
              productNumbers + 1;
          } else {
            localStorage.setItem("cartNumbers", 1);
            document.querySelector(".cartTitle span").textContent = 1;
          }
          setItems(item);
        }
        // onLoadCartNumbers();
        function setItems(item) {
          let cartItems = localStorage.getItem("itemsInCart");
          cartItems = JSON.parse(cartItems);

          if (cartItems != null) {
            if (cartItems[item.tag] == undefined) {
              cartItems = {
                ...cartItems,
                [item.tag]: item,
              };
            }
            cartItems[item.tag].inCart += 1;
          } else {
            item.inCart = 1;
            cartItems = {
              [item.tag]: item,
            };
          }

          localStorage.setItem("itemsInCart", JSON.stringify(cartItems));
        }
        function totalCost(item) {
          // console.log("the product price is ", item.price);
          let cartCost = localStorage.getItem("totalCost");

          if (cartCost != null) {
            cartCost = parseInt(cartCost);
            localStorage.setItem("totalCost", cartCost + item.price);
          } else {
            localStorage.setItem("totalCost", item.price);
          }
        }
        // displayCart();
      }
    } catch (error) {
      console.log(err);
    }

    function displayCart() {
      let cartItems = localStorage.getItem("itemsInCart");
      cartItems = JSON.parse(cartItems);
      let productContainer = document.querySelector(".cart");
      let cartCost = localStorage.getItem("totalCost");
      if (cartItems && productContainer) {
        productContainer.innerHTML = "";
        Object.values(cartItems).map((item) => {
          productContainer.innerHTML += `
                <div class="items">
                    <div class="item">
                        <div class="productName">${(item.name).length>4 ? (item.name).substring(0,10).concat("......"):(item.name)}</div>
                        <form action="">
                            <label for="quantity"> Quantity</label>
                            <input value="${
                              item.inCart
                            }" type="number" name="quantity">
                        </form>
                        <h3>Price</h3>
                        <h5>Sh ${item.price * item.inCart}.00 </h5> 
                        <i class="fa-solid fa-trash" style="color: #fb0915;"></i>  
                    </div>
                    <hr>   
                </div>`;
          
        });
        productContainer.innerHTML += `
                <div class="total"><h2>Total</h2>
                        <h5>Sh ${cartCost}</h5>
                                          
                    </div>
                    <hr>
                    <form class="form2" action="">
                        <label for="payment"> Pay With   |</label>
                        <select name="payment" id="payment">
                            <option value="">M-PESA</option>
                            <option value="">PAYPAL</option>
                            
                        </select>
                        <button>PAY</button>
                    </form>
                `;
      }
    }
  

    onLoadCartNumbers();
    displayCart();
  }
  fetchProducts("https://fakestoreapi.com/products");
});
