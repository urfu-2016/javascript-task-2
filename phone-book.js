'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */
var phoneBook = [];

exports.correctData = function (phone, name, email) {
    var correctPhone = (/\d{9}/.test(phone)) && (phone[0] === phone[1]) &&
    (phone[1] === phone[2]) && (phone[3] === phone[4]) && (phone[4] === phone[5]) &&
    (phone[6] === phone[7]) && (phone[8] === phone[9]);
    var correctName = (typeof name === 'string' && name.length > 0);
    var correctEmail = (typeof email === 'undefined') || (typeof email === 'string');

    return (correctPhone && correctName && correctEmail);
};
exports.testPersonality = function (phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {

            return i;
        }
    }

    return -1;
};

exports.add = function (phone, name, email) {
    if (exports.correctData(phone, name, email) && exports.testPersonality(phone) === -1) {
        if (typeof email === 'undefined') {
            phoneBook.push({ phone: phone, name: name });
        } else {
            phoneBook.push({ phone: phone, name: name, email: email });
        }

        return true;
    }

    return false;
};

exports.update = function (phone, name, email) {
    var phoneId = exports.testPersonality(phone);
    if (exports.correctData(phone, name, email) && phoneId > -1) {
        phoneBook[phoneId].name = name;
        if (typeof email !== 'undefined') {
            phoneBook[phoneId].email = email;
        } else {
            delete phoneBook[phoneId].email;
        }

        return true;
    }

    return false;
};

exports.find = function (query) {
    if (query === '') {

        return [];
    }
    var flag = [];
    if (query === '*') {
        for (var i = 0; i < phoneBook.length; i++) {
            flag.push(convertToString(phoneBook[i]));
        }
    }
    for (var j = 0; j < phoneBook.length; j++) {
        if (subRecord(phoneBook[j], query)) {
            flag.push(convertToString(phoneBook[j]));
        }
    }

    return flag.sort();
};

function formatPhone(phone) {

    return '+7 (' + phone.substr(0, 3) + ') ' + phone.substr(3, 3) + '-' + phone.substr(6, 2) +
    '-' + phone.substr(8, 2);
}

function convertToString(record) {
    var line;
    if (record.email === undefined) {
        line = record.name + ', ' + formatPhone(record.phone);
    } else {
        line = record.name + ', ' + formatPhone(record.phone) +
        ', ' + record.email;
    }

    return line;
}

function subRecord(record, query) {
    var key = Object.keys(record);
    for (var i = 0; i < key.length; i++) {
        if ((record[key[i]] !== undefined) && (record[key[i]].indexOf(query) !== -1)) {
            return true;
        }
    }

    return false;
}

exports.findAndRemove = function (query) {
    var numDel = phoneBook.length;
    var res = [];
    if (query === '') {

        return 0;
    }
    if (query === '*') {
        phoneBook = res;

        return numDel;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (!subRecord(phoneBook[i], query)) {
            res.push(phoneBook[i]);
            numDel--;
        }
    }
    phoneBook = res;

    return numDel;
};

exports.importFromCsv = function (csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    var arrayCsv = csv.split('\n');
    var res;
    var count = 0;
    for (var i = 0; i < arrayCsv.length; i++) {
        res = arrayCsv[i].split(';');
        if (exports.update(res[1], res[0], res[2]) ||
        (exports.add(res[1], res[0], res[2]))) {
            count++;
        }
    }

    return count;
};
