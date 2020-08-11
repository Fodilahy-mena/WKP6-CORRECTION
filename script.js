const foods = [
	{
		id: 'ravitoto',
		price: 5000,
		title: 'Ravitoto',
		spicy: true,
		vegetarian: false,
	},
	{
		id: 'pasta',
		price: 4000,
		title: 'Pasta',
		spicy: true,
		vegetarian: true,
	},
	{
		id: 'burger',
		price: 5000,
		title: 'Burger',
		spicy: false,
		vegetarian: false,
	},
	{
		id: 'rice',
		price: 2000,
		title: 'Rice and Leaves',
		spicy: false,
		vegetarian: true,
	},
	{
		id: 'mofogasy',
		price: 500,
		title: 'Mofogasy',
		spicy: false,
		vegetarian: true,
	},
];

const orders = [];

const foodList = document.querySelector('.food-list');
const orderList = document.querySelector('.order-list');
const totalElem = document.querySelector('.total');
const spicy = document.querySelector('#spicy');
const vegetarian = document.querySelector('#vegetarian');

// Show the food element from the list
const loadFoodList = () => {
	// creat a copy of t5he initial array
	let filteredFoods = [...foods];

	// filter the spicy stuff if we want that
	if(spicy.checked) {
		filteredFoods = filteredFoods.filter(food => food.spicy);
		console.log('We want the spicy staff');
	}
	// same for vagies
	if (vegetarian.checked) {
		filteredFoods = filteredFoods.filter(food => food.vegetarian);
		console.log('We want the vegies');
	}
	const html = filteredFoods.map(food => {
		return `
		<li>
			<span>
				${food.title}
				<img class="icon" ${food.spicy ? "" : "hidden"} src="./assets/flame.svg" alt="Spicy ${food.title}">
				<img class="icon" ${food.vegetarian ? "" : "hidden"} src="./assets/leaf.svg" alt="Vegetarian ${food.title}">
			</span>
			<span>${food.price}</span>
			<button value="${food.id}" class="add">Add</button>
		</li>
		`;
	})
	.join('');
	foodList.innerHTML = html;
};

// Add food element to the order
const addFoodToOrder = id => {
	console.log(id);
	// find the food that has the same id
	const newOrder = foods.find(food => food.id === id);
	console.log(newOrder);
	orders.push(newOrder);

	orderList.dispatchEvent(new CustomEvent('orderUpdated'));
};

// Event delegation to handle click on a food list button
const handleListClick = e => {
	if (e.target.matches('button.add')) {
		addFoodToOrder(e.target.value);
	}
	// console.log(e);
};

/// show the order list, as we want it
const showOrderList = () => {

	// Create an object that count the number of times that each object is  
	const instances = orders.reduce((acc, order) => {
		if(acc[order.id]) {
			acc[order.id]++;
		} else {
			acc[order.id] = 1;
		}
		return acc;
	}, {});
	 

	// change the object into an array
	const html = Object.entries(instances)
	//loop through each properties of this array
	.map(([foodId, numberOfFood]) => {
		// const numberOfFood = order[1];

		// get the full object back with its id
		const fullOrder = foods.find(food => food.id === foodId);
		return `
		<li>
			<span>${fullOrder.title}</span> 
			<span>x ${numberOfFood}</span> 
			<span>${fullOrder.price * numberOfFood} Ar</span>
		</li>
		`
	}).join('');
	orderList.innerHTML = html;
	console.log(orders);
	
};
// calculate the full bill
const updateTotal = () => {
	const total = orders.reduce((totalAcc, order) => {
		return totalAcc + order.price;
	}, 0);
	totalElem.textContent = `${total} Ar`;
};
// custom event to update the total price
orderList.addEventListener('orderUpdated', updateTotal);

// ***** MODAL CODE *****

const outerModal = document.querySelector('.modal-outer');
const innerModal = document.querySelector('.modal-inner');
const orderButton = document.querySelector('.confirm');

const openModal = e => {
	const html = `
		<h2>Thank you!</h2>
		<p>Your order is confirmed.<br/>
		We will prepare your food, and deliver to you when it's ready.</p>
		<p>The total amount is <b>${totalElem.textContent}</b>.</p>
		<button>Close</button>
	`;
	innerModal.innerHTML = html;
	outerModal.classList.add('open');
};

const handleClick = e => {
	const isOutside = !e.target.closest('.modal-inner');
	if (isOutside) {
		outerModal.classList.remove('open');
	}
	if (e.target.matches('button')) {
		outerModal.classList.remove('open');
	}
};

const handleEscape = e => {
	if (e.key === 'Escape') {
		outerModal.classList.remove('open');
	}
};

// ******* LISTENERS *******
// Modal listener
orderButton.addEventListener('click', openModal);
window.addEventListener('keydown', handleEscape);
outerModal.addEventListener('click', handleClick);

// event delegation on the food list
foodList.addEventListener('click', handleListClick);

// custom event for updating the order list
orderList.addEventListener('orderUpdated', showOrderList);

// listeners ofr our filters to reload
spicy.addEventListener('change', loadFoodList);
vegetarian.addEventListener('change', loadFoodList);
window.addEventListener('DOMContentLoaded', loadFoodList);
