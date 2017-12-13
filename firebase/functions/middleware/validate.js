// Middleware to validate with Joi validation (see npm) 
// Usage: validate(schema, "species") 
 
module.exports = function validate(schema, modelName) { 
    return function(req, res, next) { 
        if(!req.body[modelName]){ 
            return res.status(400).send("Missing model: " + modelName + ". (req.body." + modelName + ")"); 
        } 
 
        const result = Joi.validate(req.body[modelName], schema); 
        if(result.error === null){ 
            next(); 
        } else { 
            res.status(400).send("Validation failed: " + error.message); 
        } 
    } 
}