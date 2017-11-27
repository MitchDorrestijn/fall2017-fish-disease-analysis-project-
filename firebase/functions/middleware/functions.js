// Adding functions to request, available for every route to use

module.exports = (req, res, next) => {

    // Function to delete all illegal keys from object, for example from body
    req.removeIllegalKeys = (allowedKeys, object) => {
        // Deletes all illegal keys
        Object.keys(object).forEach((itm) => {
            let deleting = true;
            allowedKeys.forEach((key) => {
                console.log(itm + " vs. " + key);
                if (itm == key) deleting = false;
            });
            if (deleting){
                delete object[itm];
            }
        });
    };

    next();
};