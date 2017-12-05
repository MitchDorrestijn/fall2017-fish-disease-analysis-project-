// Helper functions that may be used everywhere in the app
class HelperFunctions {

    // Removes document references and replaces them with IDs to prevent super giant returning JSONs
    flatData(snapshot) {
        let data = snapshot.data();
        for(let key of Object.keys(data)) {
            if(data[key].constructor.name == 'DocumentReference'){
                data[key] = data[key].id
            }
        }
        return data;
    }
}

module.exports = new HelperFunctions()