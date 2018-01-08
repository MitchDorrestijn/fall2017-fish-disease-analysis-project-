const notifications = require('../notifications/notifications.js');
const admin = require('firebase-admin');
const db = admin.firestore();

class Checker {
    digest (aquarium, user, entry) {
        const self = this;
        return new Promise((resolve, reject) => {
            // Getting all rules
            let promises = [];
            db.collection('notification_rules').get()
            .then((rulesSnapshot) => {
                // Iterating through rules

                rulesSnapshot.docs.forEach((doc) => {
                    // Checks whether a rule is broken
                    const rule = doc.data();
                    
                    let isAllFired = true;
                    rule.triggers.forEach((trigger) => {
                        // isAllFired will be false when 1 trigger is not fired. All triggers need to be fired
                        // for the notification to happen.
                        if(!self.isTriggerFired(aquarium, user, entry, trigger)){
                            isAllFired = false;
                        }
                    });

                    // When isAllFired == false, cancel and return.
                    if(!isAllFired){
                        return;
                    }

                    let promise = Promise.resolve();

                    if(entry.species) {
                        promise = entry.species.get()
                    }

                    promise.then((doc) => {
                        let species = undefined;
                        if(doc) {
                            species = doc.data();
                        }
                        const message = self.composeNotification(species, aquarium, entry, rule.triggers, rule);
                        return notifications.add(user.id, message, rule.type)
                    })

                    promises.push(promise);
                })
            })
            .then(() => {
                // All rules evaluated
                return Promise.all(promises)
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                reject(error);
            })
        });
    }

    isTriggerFired (aquarium, user, entry, rule) {
        if (!entry.hasOwnProperty(rule.attribute)) {
            // If the entry does not own the attribute that the rule is for, then rule is not broken.
            return false;
        }

        // Defines the value evaluated
        const value = entry[rule.attribute];

        const isInRange = (value) => { 
            if (value < rule.min) { 
                return false; 
            } 
 
            if (value > rule.max) { 
                return false; 
            } 
        } 

        // When no species specified, the rule is applicable for the whole aquarium
        switch (rule.equation) {
            case "range":
                return !isInRange(entry.value);
                break;
            case "<":
                return value < rule.compared;
                break;
            case ">":
                return value > rule.compared;
                break;
            case "==":
                return value == rule.compared;
                break;
        }
    }

    composeNotification (species, aquarium, entry, triggers, rule) {
        let mapper = [];
        if(species){
            mapper.push({ key: "{species}", value: species.name })
        }
        mapper.push({ key: "{aquarium}", value: aquarium.name })
        triggers.forEach((trigger) => {
            mapper.push({ key: "{" + trigger.attribute + "}", value: entry[trigger.attribute] })
        })

        let message = rule.message;

        mapper.forEach((pair) => {
            while(message.indexOf(pair.key) != -1){
                message = message.replace(pair.key, pair.value);
            }
        });
        return message;
    }
}

module.exports = new Checker();