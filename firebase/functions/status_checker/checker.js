const notifications = require('../notifications/notifications.js');
const admin = require('firebase-admin');
const db = admin.firestore();

class Checker {
    digestOld (aquarium, user, entry) {
        const self = this;
        return new Promise((resolve, reject) => {
            // Getting all rules
            db.collection('notification_rules').get()
            .then((rulesSnapshot) => {
                // Iterating through rules
                rulesSnapshot.docs.forEach((doc) => {
                    // Checks whether a rule is broken
                    const rule = doc.data();
                    // If rule is broken
                    if(self.isRuleBroken(aquarium, user, entry, rule)){
                        if(entry.species){
                            entry.species.get()
                            .then((doc) => {
                                const species = doc.data();
                                const message = self.composeNotification(species, aquarium, entry, rule);
                                return notifications.add(user.id, message, rule.type)
                            })
                            .then(() => {
                                resolve(true);
                            })
                            .catch((error) => {
                                reject(error)
                            })
                        } else {
                            const message = self.composeNotification(undefined, aquarium, entry, rule);
                            notifications.add(user.id, message, rule.type)
                            .then(() => {
                                resolve(true);
                            })
                            .catch((error) => {
                                reject(error)
                            })
                        }
                    }
                })
            })
            .then(() => {
                // All rules evaluated
                resolve(true);
            })
            .catch((error) => {
                reject(error);
            })
        });
    }

    digest (aquarium, user, entry) {
        const self = this;
        return new Promise((resolve, reject) => {
            // Getting all rules
            db.collection('notification_rules').get()
            .then((rulesSnapshot) => {
                // Iterating through rules
                rulesSnapshot.docs.forEach((doc) => {
                    // Checks whether a rule is broken
                    const rule = doc.data();
                    let triggers = [];
                    // Get triggers for the rule
                    db.collection('notification_rules').doc(rule.id).collection("triggers").get()
                    .then((triggerSnapshot) => {
                        // If no triggers, return.
                        if(triggerSnapshot.docs.length == 0){
                            resolve();
                            return;
                        }
                        let isAllFired = true;
                        triggerSnapshot.docs.forEach((doc) => {
                            const trigger = doc.data();
                            triggers.push(trigger);
                            // isAllFired will be false when 1 trigger is not fired. All triggers need to be fired
                            // for the notification to happen.
                            if(!self.isTriggerFired(aquarium, user, entry, trigger)){
                                isAllFired = false;
                            }
                        });

                        // When isAllFired == false, cancel and return.
                        if(!isAllFired){
                            resolve(true);
                            return;
                        }

                        if(entry.species){
                            entry.species.get()
                            .then((doc) => {
                                const species = doc.data();
                                const message = self.composeNotification(species, aquarium, entry, triggers, rule);
                                return notifications.add(user.id, message, rule.type)
                            })
                            .then(() => {
                                resolve(true);
                            })
                            .catch((error) => {
                                reject(error)
                            })
                        } else {
                            const message = self.composeNotification(undefined, aquarium, entry, triggers, rule);
                            console.log("Message: " + message);
                            notifications.add(user.id, message, rule.type)
                            .then(() => {
                                console.log("noti added!");
                                resolve(true);
                            })
                            .catch((error) => {
                                console.log(error);
                                reject(error)
                            })
                        }
                    })
                    .catch((error) => {
                        reject(error);
                    })
                })
            })
            .then(() => {
                // All rules evaluated
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

    // isRuleBroken (aquarium, user, entry, rule) {
    //     if (!entry.hasOwnProperty(rule.attribute)) {
    //         // If the entry does not own the attribute that the rule is for, then rule is not broken.
    //         return false;
    //     }

    //     // Defines the value evaluated
    //     const value = entry[rule.attribute];

    //     const isInRange = (value) => { 
    //         if (value < rule.min) { 
    //             return false; 
    //         } 
 
    //         if (value > rule.max) { 
    //             return false; 
    //         } 
    //     } 

    //     // When no species specified, the rule is applicable for the whole aquarium
    //     switch (rule.equation) {
    //         case "range":
    //             return !isInRange(entry.value);
    //             break;
    //         case "<":
    //             return value < rule.compared;
    //             break;
    //         case ">":
    //             return value > rule.compared;
    //             break;
    //         case "==":
    //             return value == rule.compared;
    //             break;
    //     }
    // }

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

    // composeNotification (species, aquarium, entry, rule) {
    //     const mapper = []
    //     if(species){
    //         mapper.push({ key: "{species}", value: species.name})
    //     }
    //     mapper.push({ key: "{aquarium}", value: aquarium.name})
    //     mapper.push({ key: "{attribute}", value: rule.attribute})
    //     mapper.push({ key: "{value}", value: entry[rule.attribute]})
    //     mapper.push({ key: "{equation}", value: rule.equation})
    //     mapper.push({ key: "{compared}", value: rule.compared})

    //     let message = rule.message;

    //     mapper.forEach((pair) => {
    //         while(message.indexOf(pair.key) != -1){
    //             message = message.replace(pair.key, pair.value);
    //         }
    //     });
    //     return message;
    // }
}

module.exports = new Checker();