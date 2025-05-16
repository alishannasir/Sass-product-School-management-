import nodemailer from "nodemailer";

async function SendEmail(
  to: string,
  subject: string,
  html: string
): Promise<nodemailer.SentMessageInfo> {
  console.log(process.env.PASS_KEY , process.env.EMAIL ,"ENMAIL AND KEY")
   try {
    const transporter = nodemailer.createTransport({
        service:"gmail",
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS_KEY,
        },

    })


   const info = await  transporter.sendMail({
    from :`'Schoolify' <${process.env.EMAIL}>`,
    to,
    subject,
   html
   })
   return info

   } catch (error:any) {
    console.log(error)
     throw new Error(error)
   }
}


export default SendEmail