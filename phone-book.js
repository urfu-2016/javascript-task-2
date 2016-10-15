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
    return typeof value === 'string' && value !== '';
}

function isUndefined(value) {
    return typeof value === 'undefined';
}

function isCorrect(phone, name, email) {
    var isCorrectType = isString(phone) && isString(name) && (isString(email) || isUndefined(email));
    var isCorrectForm = correctPhone.test(phone);

    return isCorrectType && isCorrectForm;
}

function addOrUpdate(add, update, phone, name, email) {
    if (!isCorrect(phone, name, email)) {
        return false;
    }

    if (!add && update && !phoneBook.hasOwnProperty(phone)) {
        return false;
    }

    if (add && !update && phoneBook.hasOwnProperty(phone)) {
        return false;
    }

    phoneBook[phone] = { 'name': name, 'email': email};

    return true;
}

exports.add = function (phone, name, email) {
    return addOrUpdate(true, false, phone, name, email);
};

exports.update = function (phone, name, email) {
    return addOrUpdate(false, true, phone, name, email);
};

function check(phone, query) {
    var inPhone = phone.indexOf(query) !== -1;
    var inName = phoneBook[phone].name.indexOf(query) !== -1;
    var inEmail = (isString(phoneBook[phone].email)) ? phoneBook[phone].email.indexOf(query)  !== -1: false;

    return (inPhone || inName || inEmail);
}

function findPhones(query) {
    if (!isString(query) || query === '') {
        return [];
    }

    var keys = Object.keys(phoneBook);

    if (query === '*') {
        return keys;
    }

    var result = keys.filter(function (phone) { return check(phone, query); });

    return result;
}

function toPhoneString(phone) {
    var record = [phoneBook[phone].name, phone.replace(correctPhone,  '+7 ($1$1$1) $2$2-$3$3-$4$4')]
    if (isString(phoneBook[phone].email)) {
        record.push(phoneBook[phone].email);
    }

    return record.join(', ');
}

exports.findAndRemove = function (query) {
    var phones = findPhones(query);
    phones.forEach(function (phone) { delete phoneBook[phone]; });

    return phones.length;
};

exports.find = function (query) {
    var result = findPhones(query).map(toPhoneString);
    result.sort();

    return result;
};

function countRecords(n, record) {
    return n + addOrUpdate(true, true, record.phone, record.name, record.email);
}

function parseCSVString(s) {
    var record = s.split(';');
    var recordObj = {'phone': record[1], 'name': record[0], 'email': record[2] };

    return recordObj;
}

exports.importFromCsv = function (csv) {
    return csv.split('\n').map(parseCSVString).reduce(countRecords, 0);
};
