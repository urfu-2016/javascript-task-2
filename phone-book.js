'use strict';

exports.isStar = true;

var phoneBook = {
    phoneNumbers: [],
    names: [],
    emails: []
};

function compareNumeric(a, b) {
    if (a > b) {

        return -1;
    }
    if (a < b) {

        return 1;
    }
}

function isValidNumber(phoneNumber) {
    if (phoneNumber.length !== 10) {

        return false;
    }
    var phone = phoneNumber.replace(/\s+/g, '');

    return (phone.length === 10 &&
            phone[0] === phone[1] &&
            phone[1] === phone[2] &&
            phone[3] === phone[4] &&
            phone[4] === phone[5] &&
            phone[6] === phone[7] &&
            phone[8] === phone[9] &&
            /^\d{10}$/.test(phone));
}

function makeNumber(phone) {

    return '+7 (' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) +
        '-' + phone.substring(6, 8) + '-' + phone.substring(8, 10);
}

/**
 * Заполняет массив индексами из массивов в которых найдено совпадение
 * @param {String} query
 * @returns {Array} foundIndexes
 */
function helpFind(query) {
    var foundIndexes = [];
    phoneBook.phoneNumbers.forEach(function (elem, index) {
        if (elem.indexOf(query) !== -1) {
            foundIndexes.push(index);
        }
    });
    phoneBook.names.forEach(function (elem, index) {
        if ((elem.indexOf(query) !== -1) && (!(index in foundIndexes))) {
            foundIndexes.push(index);
        }
    });
    phoneBook.emails.forEach(function (elem, index) {
        if (elem !== undefined) {
            if ((elem.indexOf(query) !== -1) && (!(index in foundIndexes))) {
                foundIndexes.push(index);
            }
        }
    });

    return foundIndexes;
}

exports.add = function (phone, name, email) {
    var isRepeat = 0;
    if (phone === undefined || name === undefined || !isValidNumber(phone)) {

        return false;
    }
    phoneBook.phoneNumbers.forEach(function (elem) {
        if (elem === phone) {
            isRepeat = 1;
        }
    });
    if (isRepeat === 1) {

        return false;
    }
    phoneBook.phoneNumbers.push(phone);
    phoneBook.names.push(name);
    phoneBook.emails.push(email);

    return true;
};

exports.update = function (phone, name, email) {
    if (phone === undefined || name === undefined || !isValidNumber(phone)) {

        return false;
    }
    var updateIndex = -1;
    phoneBook.phoneNumbers.forEach(function (elem, index) {
        if (elem === phone) {
            updateIndex = index;
        }
    });
    if (updateIndex === -1) {

        return false;
    }
    phoneBook.phoneNumbers.splice(updateIndex, 1, phone);
    phoneBook.names.splice(updateIndex, 1, name);
    phoneBook.emails.splice(updateIndex, 1, email);

    return true;
};

exports.findAndRemove = function (query) {
    var foundIndexes = [];
    if (query === undefined || query === '') {

        return 0;
    }
    if (query === '*') {
        var i;
        for (i = 0; i < phoneBook.phoneNumbers.length; i++) {
            foundIndexes.push(i);
        }
    } else {
        foundIndexes = helpFind(query);
    }
    foundIndexes.sort(compareNumeric);
    foundIndexes.forEach(function (elem) {
        phoneBook.phoneNumbers.splice(elem, 1);
        phoneBook.names.splice(elem, 1);
        phoneBook.emails.splice(elem, 1);
    });

    return foundIndexes.length;
};

exports.find = function (query) {
    var foundIndexes = [];
    var foundNotes = [];
    if (query === undefined || query === '') {

        return foundNotes;
    }
    if (query === '*') {
        var i;
        for (i = 0; i < phoneBook.phoneNumbers.length; i++) {
            foundIndexes.push(i);
        }
    } else {
        foundIndexes = helpFind(query);
    }
    foundIndexes.forEach(function (elem) {
        if (phoneBook.emails[elem] !== undefined) {
            foundNotes.push(phoneBook.names[elem] + ', ' +
            makeNumber(phoneBook.phoneNumbers[elem]) + ', ' +
            phoneBook.emails[elem]);
        } else {
            foundNotes.push(phoneBook.names[elem] + ', ' +
            makeNumber(phoneBook.phoneNumbers[elem]));
        }
    });

    return foundNotes.sort();
};

exports.importFromCsv = function (csv) {
    if (typeof csv !== 'string') {

        return 0;
    }
    var csvArray = csv.split('\n');
    var n = 0;
    csvArray.forEach(function (elem) {
        if (elem.split(';').length === 3 || elem.split(';').length === 2) {
            var name = elem.split(';')[0];
            var phone = elem.split(';')[1];
            var email = elem.split(';')[2];
            if (exports.add(phone, name, email) || exports.update(phone, name, email)) {
                n++;
            }
        }
    });

    return n;
};
