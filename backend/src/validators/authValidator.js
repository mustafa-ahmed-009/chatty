import slugify from "slugify";
import { check , body } from "express-validator";
import { handlingValidationErrorMiddleWare } from "../middlewares/validatorMiddleWare.js";
import { User } from "../models/userModel.js";

export const signupValidator = [
    check('name')
    .notEmpty()
    .withMessage('User required')
    .isLength({ min: 3 })
    .withMessage('Too short User name'), 

    check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (val) => { // Ensure async validation
        const user = await User.findOne({ email: val });
        if (user) {
            throw new Error("Email already in use");
        }
    }), 

    check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    }),

    check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required'),
    check('profilePic')
    .optional(),
    handlingValidationErrorMiddleWare
];

export const loginValidator = [
    check('email')
      .notEmpty()
      .withMessage('Email required')
      .isEmail()
      .withMessage('Invalid email address'),
  
    check('password')
      .notEmpty()
      .withMessage('Password required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  
      handlingValidationErrorMiddleWare,
];
export const updateUserValidator = [
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
  .optional()
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      })
    ),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  check('profileImg').optional(),
  handlingValidationErrorMiddleWare,
];
  