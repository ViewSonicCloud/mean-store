var Joi = require('joi');
module.exports = {
  body :{
    "email": Joi.string().required(),
    "password": Joi.string().min(6).max(30).required()
  }
};
