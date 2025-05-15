import Owner from "../models/owner/owner.model.js";
import School from "../models/school/school.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import CustomError from "../utils/CustomError.js";
import { Request, Response, NextFunction } from "express";

// const registerOwner =async function(req,res,next){
//     throw new CustomError("this is my cutom error" , 404 , {data:null})
// }

const registerOwner = AsyncHandler(async function (req:Request, res:Response, next:NextFunction) {
  // get fields
  console.log(req.body, "BODY");
  const {
    fullName,
    email,
    phone,
    password,
    // profile,
    plan,
    name,
    city,
    address,
    contactNumber,
    type,
  } = req.body;

  // field check
  const fieldsArray = [
    fullName,
    email,
    phone,
    password,
    // profile,
    plan,
    name,
    city,
    address,
    contactNumber,
    type,
  ];
  for (const field of fieldsArray) {
    if (!field) {
      return next(new CustomError("All fields are required", 400, { data: null }));
    }
  }

  //    owner create

  const owner = await Owner.create({
    fullName,
    email,
    phone,
    password,
    // profile,
    plan,
  });


  if(!owner){
      return next(new CustomError("Owner not created" , 400, {data:null}))
  }

console.log(owner  , "OWNER")

      // school create 
    const school =  await School.create({
        name:name,
        city:city,
        address:address,
        contactNumber:contactNumber,
        type:type,
        owner:owner._id
    })

    if(!school){
        return next(new CustomError("School not created" , 400, {data:null}))
    }


    res.status(201).json({
      message:"OWNER AND SCHOOL CREATED SUCCESFFULY ",
      status:1,
      data :{
            owner , school
      }
    })












});

export { registerOwner };