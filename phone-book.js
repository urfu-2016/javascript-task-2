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
    var correctPhone = (/\d{9}/.test(phone)) && (/(555)\d{3}\d{2}\d{2}/);
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

    return true;
};

exports.add = function (phone, name, email) {
    if (exports.correctData(phone, name, email) && exports.testPersonality(phone) === true) {
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
    var phoneId = (exports.testPersonality(phone));
    if (exports.correctData(phone, name, email) && exports.testPersonality !== true) {
        phoneBook[phoneId].name = name;
        if (typeof email === 'undefined') {
            delete phoneBook[phoneId].email;
        } else {
            phoneBook[phoneId].email = email;
        }

        return true;
    }

    return false;
};

exports.find = function (query) {
    var flag = [];
    if (query === '') {

        return [];
    } else if (query === '*') {
        rewrite(flag);
    } else {
        findSubAndConvert(flag, query);
    }

    return flag.sort();
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

function rewrite(flag) {
    for (var i = 0; i < phoneBook.length; i++) {
        flag.push(convertToString(phoneBook[i]));
    }

    return flag;
}

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

function findSubAndConvert(flag, query) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (checkSub(query, phoneBook[i]) === true) {
            flag.push(convertToString(phoneBook[i]));
        }
    }

    return flag;
}

function checkSub(query, sub) {
    var keys = Object.keys(sub);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = sub[key];
        if ((value.indexOf(query) !== -1) && (value !== undefined)) {
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
        if (checkSub (query, phoneBook[i]) === false) {
            res.push(phoneBook[i]);
            numDel--;
        }
    }

    return numDel;
};
