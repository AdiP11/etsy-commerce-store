// Product data store
const products = [
    {
        id: 1,
        name: "Hinges",
        price: 599,
        image: "./images/hinges.jpeg",
        description: "SS hinges 4x14"
    },
    {
        id: 2,
        name: "Handles",
        price: 1499,
        image: "./images/handles.jpeg",
        description: "Description for Product 2"
    },
    {
        id: 3,
        name: "Ebco Soft Close Hinges",
        price: 280,
        image: ".images/ebco.jpeg",
        description: "Description for Product 3"
    },
    {
        id: 4,
        name: "Product 4",  
        price: 299,
        image: "https://via.placeholder.com/150",
        description: "Its really good"
    }
    
];

// Function to add new products
function addNewProduct(name, price, image, description) {
    const newProduct = {
        id: products.length + 1,
        name: name,
        price: price,
        image: image || "https://via.placeholder.com/150",
        description: description
    };
    products.push(newProduct);
    renderProducts(); // Re-render products after adding new one
}