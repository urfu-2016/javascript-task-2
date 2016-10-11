'use strict';

exports.isStar = false;

var phoneBook = {};

function getObjectValues(obj) {
    return Object.keys(obj).map(
        function (el) {
            return obj[el];
        }
    );
}

function checkInput(phone, name, email) {
    return typeof phone === 'string' &&
           /^\d{10}$/.test(phone) &&
           typeof name === 'string' &&
           (email === undefined ||
            typeof email === 'string');
}

function formatPhone(phone) {
    return '+7 (' + phone.substring(0, 3) +
           ') ' + phone.substring(3, 6) +
           '-' + phone.substring(6, 8) +
           '-' + phone.substring(8, 10);
}

function formatContact(phone, name, email) {
    var result = name + ', ' + formatPhone(phone);
    if (email !== undefined) {
        result += ', ' + email;
    }

    return result;
}

exports.add = function (phone, name, email) {
    if (!checkInput(phone, name, email) ||
        phoneBook[phone] !== undefined) {
        return false;
    }

    phoneBook[phone] = formatContact(phone, name, email);

    return true;
};

exports.update = function (phone, name, email) {
    if (!checkInput(phone, name, email) ||
        phoneBook[phone] === undefined) {
        return false;
    }

    phoneBook[phone] = formatContact(phone, name, email);

    return true;
};

exports.findAndRemove = function (query) {
    var originalLength = Object.keys(phoneBook).length;
    if (query === '*' || query === '') {
        phoneBook = {};

        return originalLength;
    }
    if (typeof query !== 'string') {
        return 0;
    }

    for (var phone in phoneBook) {
        if (phoneBook[phone].indexOf(query) !== -1) {
            delete phoneBook[phone];
        }
    }

    return originalLength - Object.keys(phoneBook).length;
};

exports.find = function (query) {
    if (query === '*' || query === '') {
        return getObjectValues(phoneBook).sort();
    }
    if (typeof query !== 'string') {
        return [];
    }

    return getObjectValues(phoneBook)
        .filter(
            function (el) {
                return el.indexOf(query) !== -1;
            }
        )
        .sort();
};

exports.importFromCsv = function (csv) {
    return csv.split('\n').length;
};
