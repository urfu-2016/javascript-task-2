'use strict';

exports.isStar = true;

var phoneBook = {};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */

var PHONE_PATTERN = /[0-9]+/;

function isPhoneCorrect(phone) {
    return PHONE_PATTERN.test(phone) && phone.length === 10;
}

function isPhoneBookContains(phone) {
    return Object.keys(phoneBook).indexOf(phone) !== -1;
}

exports.add = function (phone, name, email) {
    if (!isPhoneCorrect(phone) || name === undefined || isPhoneBookContains(phone)) {
        return false;
    }
    phoneBook[phone] = { name: name, email: email };

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} result
 */
exports.update = function (phone, name, email) {
    if (!isPhoneBookContains(phone) || name === undefined) {
        return false;
    }
    phoneBook[phone].name = name;
    phoneBook[phone].email = email;

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} count
 */
exports.findAndRemove = function (query) {
    var keys = findRecords(query);
    keys.forEach(function (key) {
        delete phoneBook[key];
    });

    return keys.length;
};

function phoneToString(phone) {
    return '+7 '.concat('(', phone.slice(0, 3), ') ', phone.slice(3, 6),
        '-', phone.slice(6, 8), '-', phone.slice(8, 10));
}

function contains(string, substring) {
    return string !== undefined && string.indexOf(substring) !== -1;
}

function isPhoneContainsQuery(phone, query) {
    var name = phoneBook[phone].name;
    var email = phoneBook[phone].email;

    return contains(phone, query) || contains(name, query) || contains(email, query);
}

function findRecords(query) {
    return Object.keys(phoneBook).filter(function (key) {
        return isPhoneContainsQuery(key, query);
    });
}

function recordToArray(key) {
    var name = phoneBook[key].name;
    var phone = key;
    var email = phoneBook[key].email;
    if (email === undefined) {
        return [name, phone];
    }

    return [name, phone, email];
}


function recordsToString(keys) {
    return keys
        .map(recordToArray)
        .sort(compare)
        .map(recordArrayToString);
}

function compare(arr1, arr2) {
    if (arr1[0] > arr2[0]) {
        return 1;
    } else if (arr1[0] < arr2[0]) {
        return -1;
    }

    return 0;
}

function recordArrayToString(arr) {
    arr[1] = phoneToString(arr[1]);

    return arr.join(', ');
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param query
 * @returns recordsArray
 */
exports.find = function (query) {
    var keys = [];
    if (query === '*') {
        keys = Object.keys(phoneBook);
    } else if (query === '') {
        keys = [];
    } else {
        keys = findRecords(query);
    }

    return recordsToString(keys);
};

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    var records = csv
        .split('\n')
        .map(parseCsvLine)
        .map(addOrUpdateRecord);

    return records
        .filter(function (elem) {
            return elem;
        })
        .length;
};

function parseCsvLine(line) {
    return line.split(';');
}

function addOrUpdateRecord(csvRecord) {
    var name = csvRecord[0];
    var phone = csvRecord[1];
    var email = csvRecord[2];

    return exports.add(phone, name, email) || exports.update(phone, name, email);
}
