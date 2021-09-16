const express=require("express");
const {check, validationResult } = require('express-validator');
const nodemailer = require("nodemailer");
var cors = require('cors')
const app=express();
app.use(cors())
require('dotenv').config();
app.use(express.json());
app.get("/",(req,res)=>{
  return res.status(200).send("welcome")
})
app.post("/send", 
  check('name').isLength({ min: 3,max:20 }).withMessage( 'Name should be 3 to 20 characters.'),
  check('email').isEmail().withMessage( 'Not a valid email.'),
  check('subject').isLength({ min: 3,max:200 }).withMessage( 'Subject should be more than more than 3 characters.'),
  check('message').isLength({ min: 3, max:2000 }).withMessage( 'Message should be more than 3 characters.'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array(),error:true });
    }
    const {subject,name,phone,email,message}=req.body
    
    
  try {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP,
    port: 587,
    secure: false, 
    auth: {
      user: process.env.USER_EMAIL, 
      pass: process.env.USER_PASSWORD,
    },
  });

  let out=`<div><strong>First Names:  ${name}</strong></div><br/><div><strong>Phone :  ${phone}</strong></div><br/><div style="margin-top:'12px',margin-bottom:'12px'"><strong>Email:  ${email}</strong></div><hr/><div>${message}</div>`
  
   await transporter.sendMail({
    from: '"designerscf.com" <designerscut@designerscf.com>', 
    to: "designerscut@cox.net", 
    subject: subject, 
    text: "",
    html: out, 
  });
  return res.status(200).json({message:"success",error:false})
  } catch (error) {
      res.status(500).json({message:error.message,error:true})
  }
 
  
})
const port = process.env.PORT || 3000
app.listen(port,()=>console.log("ok"))