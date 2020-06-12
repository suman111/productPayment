const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const app = express()

var Publishable_Key = ''
var Secret_Key = ''

const stripe = require('stripe')(Secret_Key)

const port = process.env.PORT || 3000

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

// View Engine Setup 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/prices', function (req, res) {

	//list single price using id
	//  stripe.prices.retrieve(
	//     'price_1Gt5YhH9VQ4wk3Yd2fyqvw3K',
	//     function(err, price) {
	// 	  // asynchronously called
	// 	   p1 = price.nickname
	//     }
	//   ); 
	
	//list the prices
	stripe.prices.list(
		{ limit: 3 },
		function (err, prices) {
			res.send(prices)
		}
	);
})

app.get('/', function (req, res) {

	 res.render('Home', { 
	 key: Publishable_Key 
	 }) 
})

app.post('/payment', function (req, res) {

	// Moreover you can take more details from user 
	// like Address, Name, etc from form 
	stripe.customers.create({
		email: req.body.stripeEmail,
		source: req.body.stripeToken,
		name: 'suman',
		address: {
			line1: 'calicut',
			postal_code: '673015',
			city: 'calicut',
			state: 'kerala',
			country: 'India',
		}
	})
		.then((customer) => {

			return stripe.charges.create({
				amount: 3500,	 // Charing Rs 35 
				description: ' Product',
				currency: 'INR',
				customer: customer.id
			});
		})
		.then((charge) => {
			res.send("Success") // If no error occurs 
		})
		.catch((err) => {
			res.send(err)	 // If some error occurs 
		});
})

app.listen(port, function (error) {
	if (error) throw error
	console.log("Server created Successfully")
}) 
