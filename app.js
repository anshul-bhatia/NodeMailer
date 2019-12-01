const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')

const app = express();

// View engine setup
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars');

// Static Folder
app.use('/public', express.static(path.join(__dirname, 'public')))

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.render('contact', { layout: false });
})

app.post('/send', (req, res) => {
    const output = `
    <p> You have a new contact request </p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.name} </li>
        <li>Company: ${req.body.company} </li>
        <li>Email: ${req.body.email} </li>
        <li>Phone: ${req.body.phone} </li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>`;
    // console.log(output)
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'mail.protonmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'test.anshulbhatia@protonmail.com', // generated ethereal user
            pass: 'wontTellYou'  // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer Contact" <test.anshulbhatia@protonmail.com>', // sender address
        to: 'anshul.bhatia26@gmail.com', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world!', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', { msg: 'Email has been sent' });
    });
})

app.listen(3000, () => {
    console.log("Server started....")
})

