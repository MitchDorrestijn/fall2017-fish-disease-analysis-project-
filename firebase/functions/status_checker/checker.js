const notifications = require('../notifications/notifications.js');
const admin = require('firebase-admin');
const db = admin.firestore();

const ranges = {
    pH: {
        min: 7,
        max: 10
    },
    kH: {
        min: 5,
        max: 56
    },
    NO3: {
        min: 10,
        max: 57
    }
}

class Checker {
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

    isRuleBroken (aquarium, user, entry, rule) {
        if (!entry.hasOwnProperty(rule.attribute)) {
            // If the entry does not own the attribute that the rule is for, then rule is not broken.
            return false;
        }

        // Defines the value evaluated
        const value = entry[rule.attribute];

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

        const isInRange = (value, rule) => {
            if (value < rule.min) {
                return false;
            }

            if (value > rule.max) {
                return false;
            }
        }
    }

    composeNotification (species, aquarium, entry, rule) {
        const mapper = []
        if(species){
            mapper.push({ key: "{species}", value: species.name})
        }
        mapper.push({ key: "{aquarium}", value: aquarium.name})
        mapper.push({ key: "{attribute}", value: rule.attribute})
        mapper.push({ key: "{value}", value: entry[rule.attribute]})
        mapper.push({ key: "{equation}", value: rule.equation})
        mapper.push({ key: "{compared}", value: rule.compared})

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
/*
{
    check: (userid, entry) => {
        for (var value in ranges) {
            if (ranges.hasOwnProperty(value)) {
                if (entry.hasOwnProperty(value)) {
                    // Checks whether a value is less than allowed
                    if (entry[value] < ranges[value].min) {
                        notifications.add(userid, "The value of " + value + " is too low!", 1);
                    }

                    // Checks whether a value is more than allowed
                    if (entry[value] > ranges[value].max) {
                        notifications.add(userid, "The value of " + value + " is too high!", 1);
                    }
                }
            }
        }
    },

    digest: (aquarium, user, entry) => {
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
                                return notifications.add(user.id, message, 1)
                            })
                            .then(() => {
                                resolve(true);
                            })
                            .catch((error) => {
                                reject(error)
                            })
                        } else {
                            const message = self.composeNotification(undefined, aquarium, entry, rule);
                            notifications.add(user.id, message, 1)
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
    },

    isRuleBroken: (aquarium, user, entry, rule) => {
        if (!entry.hasOwnProperty(rule.attribute)) {
            // If the entry does not own the attribute that the rule is for, then rule is not broken.
            return false;
        }

        // Defines the value evaluated
        const value = entry[rule.attribute];

        // When no species specified, the rule is applicable for the whole aquarium
        switch (rule.aquation) {
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

        const isInRange = (value, rule) => {
            if (value < rule.min) {
                return false;
            }

            if (value > rule.max) {
                return false;
            }
        }
    },

    composeNotification: (species, aquarium, entry, rule) => {
        if(species){
            message.replace('{species}', species.name);
        }
        message.replace('{aquarium}', aquarium.name);
        message.replace('{attribute}', rule.attribute);
        message.replace('{value}', entry.value);
        message.replace('{equation}', rule.equation);
        message.replace('{compared}', rule.compared);
        return message;
    }
} */