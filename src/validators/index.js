import {body} from "express-validator";

const userRegistrationValidator = () => {
     return [
        body("username").not().isEmpty().withMessage("Username is required"),
        body("email").isEmail().withMessage("Email is required"),
        body("password").not().isEmpty().withMessage("Password is required")
     ]
}

export {
    userRegistrationValidator
}