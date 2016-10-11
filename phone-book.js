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

function isStringInContact(contact, string) {
    return contact.split(', ').some(
        function (el) {
            return el.indexOf(string) !== -1;
        }
    );
}

function isValidPhone(phone) {
    return /^(\d)\1{2}(\d)\2{2}(\d)\3{1}(\d)\4{1}$/.test(phone);
}

function checkInput(phone, name, email) {
    return typeof phone === 'string' &&
           isValidPhone(phone) &&
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
        if (isStringInContact(phoneBook[phone], query)) {
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
                return isStringInContact(el, query);
            }
        )
        .sort();
};

exports.importFromCsv = function (csv) {
    return csv.split('\n').length;
};
