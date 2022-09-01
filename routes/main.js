const express = require('express');
const crypto = require('crypto');
const paypal = require('paypal-rest-sdk');
const router = express.Router();
const quiz = require('../views/quiz');
const FAQ = require('../views/FAQ');



router.use(express.urlencoded({ extended: true }));

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

router.post('/payment', (req, res) => {
    const { donationAmount, customAmount } = req.body;

    const getDate = function(n) {
        const d = new Date();

        var getMonth = d.getMonth() < 10 ? '0' + parseInt(d.getMonth() + 1) : d.getMonth() + 1;
        var getDay = d.getDay() < 10 ? '0' + d.getDay() : d.getDay();

        var getMinute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
        var getSeconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();

        if (n == 'merchantTxnRef') {
            return d.getFullYear() + getMonth + getDay + ' ' + d.getHours() + ':' + getMinute + ':' + getSeconds + '.' + Math.floor(d.getMilliseconds() / 10);
        }
        else {
            return d.getFullYear() + getMonth + getDay + ' ' + d.getHours() + ':' + getMinute + ':' + getSeconds + '.' + d.getMilliseconds();
        }
    }

    var txnReq = {
        "ss": "1", 
        "msg": {
            "netsMid": "UMID_877772003", 
            "tid": "", 
            "submissionMode": "B", 
            "txnAmount": donationAmount != undefined ? donationAmount * 100 : customAmount * 100, 
            "merchantTxnRef": getDate('merchantTxnRef'), 
            "merchantTxnDtm": getDate(), 
            "paymentType": "SALE", 
            "currencyCode": "SGD", 
            "paymentMode": 'QR', 
            "merchantTimeZone": "+8:00", 
            "b2sTxnEndURL": "http://localhost:5000/successpage", 
            "clientType": "W", 
            "supMsg": "", 
            "netsMidIndicator": "U", 
            "ipAddress": "127.0.0.1", 
            "language": "en"
        }
    }

    var keyID = '154eb31c-0f72-45bb-9249-84a1036fd1ca';
    var secretKey = '38a4b473-0295-439d-92e1-ad26a8c60279';    
    var MAC_Value = crypto.createHash('sha256').update(JSON.stringify(txnReq) + secretKey).digest('base64');

    res.render('NETSpayment', { txnReq: JSON.stringify(txnReq), hmac: MAC_Value, keyID: keyID });
})

router.post('/successpage', (req, res) => {
	res.render('successpage')
});

router.get('/quiz', (req, res) => {
	res.render('quiz')
});

router.get('/FAQ', (req, res) => {
	res.render('FAQ')
});

module.exports = router;