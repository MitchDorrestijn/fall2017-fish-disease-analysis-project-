const notifications = require('../notifications/notifications.js');

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

module.exports = {
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
    }
}