const express=require("express");
const {check, validationResult } = require('express-validator');
const nodemailer = require("nodemailer");
var cors = require('cors')
const app=express();
app.use(cors())
require('dotenv').config();
app.use(express.json());
app.post("/send", 
  check('firstName').isLength({ min: 3,max:20 }).withMessage( 'First Name should be 3 to 20 characters.'),
  check('email').isEmail().withMessage( 'Not a valid email.'),
  check('subject').isLength({ min: 3,max:200 }).withMessage( 'Subject should be more than more than 3 characters.'),
  check('message').isLength({ min: 3, max:2000 }).withMessage( 'Message should be more than characters.'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {subject,firstName,lastName,email,message}=req.body
    
    
  try {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP,
    port: 587,
    secure: false, 
    auth: {
      user: process.env.USER_EMAIL, 
      pass: process.env.USER_PASSWORD,
    },
    tls: {
      
        rejectUnauthorized: false,
      },
  });

  let out=`<div><strong>First Names:  ${firstName}</strong></div><br/><div><strong>Last Name:  ${lastName}</strong></div><br/><div style="margin-top:'12px',margin-bottom:'12px'"><strong>Email:  ${email}</strong></div><hr/><div>${message}</div>`
  
   await transporter.sendMail({
    from: '"Designercut Contact Form" <ibrahim.nazari@designerscf.com>', 
    to: "ibrahimnazaryweb@gmail.com", 
    subject: subject, 
    text: "",
    html: out, 
  });
  return res.status(200).json({message:"success",error:false})
  } catch (error) {
      res.status(500).json({message:error.message,error:true})
  }
 
  
})

app.listen(5000,()=>console.log("ok"))