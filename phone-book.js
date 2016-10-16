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

function checkIfPhone(potentialPhone) {
    if (potentialPhone === undefined) {

        return false;
    }

    return ((potentialPhone.match(/\d{10}/) !== null) && potentialPhone.length === 10);
}

function findIndexOfPhone(phone) {
    if (phone === undefined) {

        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if ((phoneBook[i].phone.indexOf(phone)) !== -1) {

            return i;
        }
    }

    return -1;
}

function checkUniqueness(phone, name, email) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (checkContactForQuery(phone, phoneBook[i]) ||
            checkContactForQuery(name, phoneBook[i]) ||
            checkContactForQuery(email, phoneBook[i])) {

            return false;
        }
    }

    return true;
}

/**
 * Добавление записи в телефонную книгу add('5554440044', 'Григорий', 'grisha@example.com');
 * @param {String} phone add('5554440044', 'Григорий', 'grisha@example.com');
 * @param {String} name  add('5552220022', 'Борис', 'boris@example.com');
 * @param {String} email
 */

exports.add = function (phone, name, email) {
    if ((typeof name !== 'string') || (name === '') || (checkIfPhone(phone) === false)) {

        return false;
    }
    if ((email === undefined) && (checkUniqueness(phone, name, email) === true)) {
        phoneBook.push({ phone: phone, name: name });

        return true;
    }
    if (checkUniqueness(phone, name, email) === true) {
        phoneBook.push({ phone: phone, name: name, email: email });

        return true;
    }

    return false;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */

exports.update = function (phone, name, email) {
    var phoneInd = (findIndexOfPhone(phone));
    if ((checkIfPhone(phone) === false) || (phoneInd === -1)) {

        return false;
    }
    if (name !== undefined) {
        phoneBook[phoneInd].name = name;
    }
    if (email !== undefined) {
        phoneBook[phoneInd].email = email;
    }
    if (email === undefined) {
        delete phoneBook[phoneInd].email;
    }

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */

exports.findAndRemove = function (query) {
    var numOfDeleted = phoneBook.length;
    var phoneBookAfterRemove = [];
    if (query === '') {

        return 0;
    }
    if (query === '*') {
        phoneBook = phoneBookAfterRemove;

        return numOfDeleted;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (checkContactForQuery(query, phoneBook[i]) === false) {
            phoneBookAfterRemove.push(phoneBook[i]);
            numOfDeleted--;
        }
    }
    phoneBook = phoneBookAfterRemove;

    return numOfDeleted;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */

exports.find = function (query) {
    var acc = [];
    if (query === '') {
        acc = [];
    } else if (query === '*') {
        findAllAndConvert(acc);
    } else {
        findQueryAndConvert(query, acc);
    }

    return acc.sort();
};

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    var arrOfCSV = csv.split('\n');
    var numOfAddedOrUpdated = 0;
    for (var i = 0; i < arrOfCSV.length; i++) {
        var contact = arrOfCSV[i].split(';');
        if (exports.add(contact[1], contact[0], contact[2])) {
            numOfAddedOrUpdated++;
        } else if (exports.update(contact[1], contact[0], contact[2])) {
            numOfAddedOrUpdated++;
        }
    }

    return numOfAddedOrUpdated;
};

function findAllAndConvert(acc) {
    for (var i = 0; i < phoneBook.length; i++) {
        acc.push(convertObjToStr(phoneBook[i]));
    }

    return acc;
}

function findQueryAndConvert(query, acc) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (checkContactForQuery(query, phoneBook[i]) === true) {
            acc.push(convertObjToStr(phoneBook[i]));
        }
    }

    return acc;
}

function checkContactForQuery(query, contact) {
    var keys = Object.keys(contact);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = contact[key];
        if ((value.indexOf(query) !== -1) && (value !== undefined)) {
            return true;
        }
    }

    return false;
}

function convertObjToStr(objWithQuery) {
    var strWithoutEmail = objWithQuery.name + ', +7 (' + objWithQuery.phone.slice(0, 3) +
    ') ' + objWithQuery.phone.slice(3, 6) + '-' + objWithQuery.phone.slice(6, 8) +
    '-' + objWithQuery.phone.slice(8);

    if (objWithQuery.email === undefined) {
        return strWithoutEmail;
    }
    var strWithEmail = strWithoutEmail + ', ' + objWithQuery.email;

    return strWithEmail;
}
