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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} Entry was added or no.
 */
exports.add = function (phone, name, email) {

    if (!isCorrectType(phone, name, email) || !isNotEmpty(phone, name, email)) {

        return false;
    }
    if (isSameEntries(phone, email) || !isCorrectData(phone, name) || arguments.length > 3) {

        return false;
    }
    phoneBook.push({
        phone: phone.trim(),
        name: name.trim(),
        email: email
    });

    return true;
};

function isCorrectData(phone, name) {
    if (name === undefined || name === null) {

        return false;
    }
    if (phone === undefined || phone === null || phone.match(/\d/g).length !== 10) {

        return false;
    }

    return true;
}

function isCorrectType(phone, name, email) {
    if (typeof(phone) !== 'string' || typeof(name) !== 'string' || email === null) {

        return false;
    }
    if (email !== undefined && (typeof(email) !== 'string')) {

        return false;
    }

    return true;
}

function isNotEmpty(phone, name, email) {
    if (phone.replace(/^\s+/, '').length === 0 || name.replace(/^\s+/, '').length === 0) {

        return false;
    }
    if (email !== undefined && email.replace(/^\s+/, '').length === 0) {

        return false;
    }

    return true;
}

function isSameEntries(phone, email) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phone === phoneBook[i].phone) {
            return true;
        }
        if (email !== undefined && email === phoneBook[i].email) {

            return true;
        }
    }

    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} Entry was updated or no.
 */
exports.update = function (phone, name, email) {
    if (!isNotEmpty(phone, name, email)) {
        return false;
    }
    if (!isCorrectType(phone, name, email) || !isCorrectData(phone, name)) {
        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phone === phoneBook[i].phone) {
            phoneBook[i].name = name.trim();
            phoneBook[i].email = email;

            return true;
        }
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} The count of operations.
 */
exports.findAndRemove = function (query) {
    var counter = 0;
    if (typeof(query) !== 'string' || query === '') {
        return 0;
    }
    if (query === '*') {
        query = '';
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (findFields(query, phoneBook[i].phone, phoneBook[i].name, phoneBook[i].email)) {
            phoneBook.splice(i, 1);
            i--;
            counter++;
        }
    }

    return counter;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} The result Array of Strings.
 */
exports.find = function (query) {
    var result = [];
    if (typeof(query) !== 'string' || query === '') {
        return [];
    }
    if (query === '*') {
        query = '';
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (findFields(query, phoneBook[i].phone, phoneBook[i].name, phoneBook[i].email)) {
            result.push(toFormat(phoneBook[i].phone, phoneBook[i].name, phoneBook[i].email));
        }
    }

    return result.sort();
};

function findFields(query, phone, name, email) {
    if (name.indexOf(query) !== -1 || phone.indexOf(query) !== -1) {

        return true;
    }
    if (email !== undefined && email.indexOf(query) !== -1) {

        return true;
    }

    return false;
}

function toFormat(phone, name, email) {
    var format;
    format = name + ', ' + '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' +
        phone.slice(6, 8) + '-' + phone.slice(8, 10);
    if (email !== undefined) {
        format += ', ' + email;
    }

    return format;
}

function isEntryExist(csv) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (csv[1] === phoneBook[i].phone) {
            phoneBook[i].phone = csv[1];
            phoneBook[i].name = csv[0];
            phoneBook[i].email = csv[2];

            return true;
        }
    }

    return false;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    var pCSV = csv.split(/\s/g);
    var counter = pCSV.length;
    for (var i = 0; i < pCSV.length; i++) {
        pCSV[i] = pCSV[i].split(';');
        if (!isNotEmpty(pCSV[i][1], pCSV[i][0], pCSV[i][2])) {
            counter--;
        }
        if (!isCorrectData(pCSV[i][1], pCSV[i][0]) || pCSV[i].length > 3) {
            counter--;
        } else if (!isEntryExist(pCSV[i])) {
            phoneBook.push({
                phone: pCSV[i][1],
                name: pCSV[i][0],
                email: pCSV[i][2]
            });
        }
    }

    return counter;
};
