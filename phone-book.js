'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */
var phoneBook = {};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
var correctPhone = /(\d)\1\1(\d)\2\2(\d)\3(\d)\4/;

function isString(value) {
    return typeof value === 'string';
}

function isUndefined(value) {
    return typeof value === 'undefined';
}

function isCorrect(phone, name, email) {
    var isCorrectPhone = isString(phone);
    var isCorrectName = isString(name) && name !== '';
    var isCorrectEmail = (isString(email) && email.indexOf('@') !== -1) || isUndefined(email);
    var isCorrectForm = correctPhone.test(phone) && phone.length === 10;

    return isCorrectPhone && isCorrectForm && isCorrectName && isCorrectEmail;
}

function addOrUpdate(num, phone, name, email) {
    if (!isCorrect(phone, name, email)) {
        return false;
    }

    if (num === 0 && phoneBook.hasOwnProperty(phone)) {
        return false;
    }

    if (num === 1 && !phoneBook.hasOwnProperty(phone)) {
        return false;
    }

    if (num === 2 && isUndefined(email) && !isUndefined(phoneBook[phone].email)) {
        email = phoneBook[phone].email;
    }

    phoneBook[phone] = { 'name': name, 'email': email };

    return true;
}

exports.add = function (phone, name, email) {
    return addOrUpdate(0, phone, name, email);
};

exports.update = function (phone, name, email) {
    return addOrUpdate(1, phone, name, email);
};

function check(phone, query) {
    var inPhone = phone.indexOf(query) !== -1;
    var inName = phoneBook[phone].name.toLowerCase().indexOf(query) !== -1;
    var inEmail = false;

    if (isString(phoneBook[phone].email)) {
        inEmail = phoneBook[phone].email.toLowerCase().indexOf(query) !== -1;
    }

    return (inPhone || inName || inEmail);
}

function findPhones(query) {
    if (typeof query !== 'string') {
        throw new TypeError();
    }

    if (query === '') {
        return [];
    }

    var keys = Object.keys(phoneBook);

    if (query === '*') {
        return keys;
    }

    query = query.toLowerCase();

    var result = keys.filter(function (phone) {
        return check(phone, query);
    });

    return result;
}

var pattern = '+7 ($1$1$1) $2$2$2-$3$3-$4$4';

function toPhoneString(phone) {
    var record = [phoneBook[phone].name, phone.replace(correctPhone, pattern)];

    if (isString(phoneBook[phone].email) && phoneBook[phone].email !== '') {
        record.push(phoneBook[phone].email);
    }

    return record.join(', ');
}

function deletePhone(phone) {
    delete phoneBook[phone];
}

exports.findAndRemove = function (query) {
    var phones = findPhones(query);
    phones.forEach(deletePhone);

    return phones.length;
};

exports.find = function (query) {
    var result = findPhones(query).map(toPhoneString);
    result.sort();

    return result;
};

function countRecords(n, record) {
    return n + addOrUpdate(3, record.phone, record.name, record.email);
}

function parseCSVString(s) {
    var record = s.split(';');
    var recordObj = { 'phone': record[1], 'name': record[0], 'email': record[2] };

    return recordObj;
}

exports.importFromCsv = function (csv) {
    return csv.split(/\r\n|\r|\n/).map(parseCSVString)
                          .reduce(countRecords, 0);
};
