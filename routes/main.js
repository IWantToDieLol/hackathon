const express = require('express');
const paypal = require('paypal-rest-sdk');
const router = express.Router();

PAYPAL_CLIENT_ID = "AS4V9XrjamXnmMRtae6c_D61Gsj27LQC7OzughnPMqBieYuVcNSGuhGVIRc3aiHLkiy1fJDgwlgr5N55"
PAYPAL_CLIENT_SECRET = "EENDGdxtB9nXX8x0uKuk8R9RYx5IBg0HTe19S7gVLbYtX-DrD0iJFvX1u339Dnqxnn1ahdU6i6VzJr9n"

const paypalClientId = PAYPAL_CLIENT_ID;
const paypalClientSecret = PAYPAL_CLIENT_SECRET;

paypal.configure({
    'mode': 'live', //sandbox or live
    'client_id': paypalClientId,
    'client_secret': paypalClientSecret
});

router.get('/', (req, res) => {
	res.render('index', { paypalClientId: paypalClientId })
});

router.post('/purchasedetails', async function (req, res){
	let {price}= req.headers;
	console.log(price);

	const title = "Donation Success";
	res.render('successpage', {title: title});
});

router.get('/successpage', (req, res) => {
	res.render('successpage')
});

module.exports = router;
