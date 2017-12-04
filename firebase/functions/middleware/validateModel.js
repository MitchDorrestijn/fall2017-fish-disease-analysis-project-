// Middleware to validate req.body.* models. When invalid keys are found, return 400.
// Usage: validateModel("user", ["firstName", "lastName", "id"])

module.exports = function validateModel(modelName, keys) {
  	return function(req, res, next) {
    	if(!req.body[modelName]){
			return res.status(400).send("Missing model: " + modelName + ". (req.body." + modelName + ")");
		}

		for(let item of Object.keys(req.body[modelName])) {
            if(keys.indexOf(item) == -1){
				return res.status(400).send("Invalid key found: " + item + ". Remove key to validate.");
			}
        }
		next();
  	}
}