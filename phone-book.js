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

var recPhoneBook;


function removeSpace(str) {

    // replace(/(^\s+)|(\s+$)/g, ''); // .replace(/\s+/g, ' ');
    return str.trim();
}

function correctName(str) {

    if (typeof str !== 'string') {

        return false;
    }
    str = removeSpace(str);

    return str.length !== 0;
}

function correctEmail(str) {

    if (typeof str !== 'string') {

        return false;
    }
    // str = /^[a-z0-9_\.-]+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i.test(str);
    str = str.trim();

    return str.length !== 0 && str.indexOf('@') !== -1;

}

function searchInPhoneBook(phone) {

    for (var i = 0; i < phoneBook.length; i++) {
        recPhoneBook = phoneBook[i];
        if (recPhoneBook.phone === phone) {

            return true;
        }
    }

    return false;
}

function findQuery(query) {

    for (var key in recPhoneBook) {
        if (recPhoneBook[key] !== undefined &&
            (recPhoneBook[key].toLowerCase()).indexOf(query.toLowerCase()) > -1) {

            return true;
        }
    }

    return false;
}

function formatPhone(phone) {

    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) +
        '-' + phone.slice(6, 8) + '-' + phone.slice(8);
}

function returnRec() {

    return recPhoneBook.name + ', ' + formatPhone(recPhoneBook.phone) +
        ((recPhoneBook.email !== '') ? (', ' + recPhoneBook.email) : (''));
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.add = function (phone, name, email) {

    if (typeof phone !== 'string' || !(/^[0-9]{10}$/.test(phone))) {

        return false;
    }

    if (!correctName(name)) {

        return false;
    }

    if (!correctEmail(email)) {
        email = '';
    }

    if (searchInPhoneBook(phone)) {

        return false;
    }

    var newRecPhoneBook = {
        phone: phone,
        name: removeSpace(name),
        email: email
    };

    phoneBook.push(newRecPhoneBook);

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.update = function (phone, name, email) {

    if (!searchInPhoneBook(phone)) {

        return false;
    }

    if (correctName(name)) {
        recPhoneBook.name = removeSpace(name);
    }

    if (correctEmail(email)) {
        recPhoneBook.email = email;
    } else {
        recPhoneBook.email = '';
    }

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} - количество удаленных записей
 */
exports.findAndRemove = function (query) {

    query = query.trim();

    if (typeof query !== 'string' || query.length === 0) {

        return 0;
    }

    var k = 0;
    if (query === '*') {
        k = phoneBook.length;
        phoneBook = [];

        return k;
    }

    for (var i = 0; i < phoneBook.length; i++) {
        recPhoneBook = phoneBook[i];
        if (findQuery(query)) {
            phoneBook.splice(i, 1);
            k = k + 1;
            i = i - 1;
        }
    }

    return k;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} foundRec
 */
exports.find = function (query) {

    var foundRec = [];

    query = query.trim();

    if (typeof query !== 'string' || query.length === 0) {

        return foundRec;
    }

    for (var i = 0; i < phoneBook.length; i++) {
        recPhoneBook = phoneBook[i];
        if (query === '*') {
            foundRec.push(returnRec());
        } else if (findQuery(query)) {
            foundRec.push(returnRec());
        }
    }

    foundRec.sort();

    return foundRec;
};

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {

    var arrayStr;
    var infoRec;
    var k = 0;

    arrayStr = csv.split('\n');

    for (var i = 0; i < arrayStr.length; i++) {
        infoRec = arrayStr[i].split(';');

        if (exports.add(infoRec[1], infoRec[0], infoRec[2]) ||
            exports.update(infoRec[1], infoRec[0], infoRec[2])) {
            k = k + 1;
        }
    }

    return k;

};
