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

function checkPhone(phone) {
    if (phone.length !== 10 || /[^[0-9]/.test(phone) || phone === '') {

        return false;
    }

    return true;
}

function checkName(name) {
    if (name === '' || typeof name !== 'string' || name === undefined) {

        return false;
    }

    return true;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.add = function (phone, name, email) {
    if (!checkPhone(phone)) {

        return false;
    }
    if (!checkName(name)) {

        return false;
    }

    var isExist = phoneBook.some(function (item) {

        return phone === item.phone;
    });

    if (!isExist) {
        if (email === undefined || typeof email !== 'string') {
            email = '';
        }
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
 * @returns {boolean} isUpdated
 */
exports.update = function (phone, name, email) {
    if (!checkPhone(phone)) {

        return false;
    }
    if (!checkName(name)) {

        return false;
    }
    var objIndex = phoneBook.findIndex(function (item) {

        return phone === item.phone;
    });

    if (objIndex === -1) {

        return false;
    }

    if (email === undefined || typeof email !== 'string') {
        email = '';
    }
    phoneBook[objIndex] = { phone: phone, name: name, email: email };

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} - количество удаленных записей
 */
exports.findAndRemove = function (query) {
    if (!query || typeof query !== 'string') {

        return 0;
    }

    var count;
    if (query !== '*') {
        var newPhoneBook = getNotRemovedItems(query);
        count = phoneBook.length - newPhoneBook.length;
        phoneBook = newPhoneBook;
    } else {
        count = phoneBook.length;
        phoneBook = [];
    }

    return count;
};

function getNotRemovedItems(query) {

    return phoneBook.filter(function (item) {
        var result = item.phone.indexOf(query) === -1 &&
            item.name.indexOf(query) === -1;
        if (item.email) {
            result = result && item.email.indexOf(query) === -1;
        }

        return result;
    });
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {
    if (!query || typeof query !== 'string') {

        return [];
    }
    var queryResult;
    if (query !== '*') {
        queryResult = getItemsByQuery(query);
    } else {
        queryResult = phoneBook;
    }

    var sortedResult = sortArray(queryResult);

    return sortedResult.map(function (item) {
        var queryLine = item.name + ', ' + convertPhone(item.phone);

        if (item.email) {
            queryLine += ', ' + item.email;
        }

        return queryLine;
    });
};

function convertPhone(phone) {

    return '+7 (' +
        phone.substring(0, 3) + ') ' +
        phone.substring(3, 6) + '-' +
        phone.substring(6, 8) + '-' +
        phone.substring(8, phone.length);
}

function sortArray(arr) {

    return arr.sort(function (a, b) {
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        }
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
        }

        return 0;
    });
}

function getItemsByQuery(query) {

    return phoneBook.filter(function (item) {
        var result = item.phone.indexOf(query) !== -1 ||
            item.name.indexOf(query) !== -1;
        if (item.email) {
            result = result || item.email.indexOf(query) !== -1;
        }

        return result;
    });
}


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
    var parsed = csv.split('\n');

    var counter = 0;

    for (var i = 0; i < parsed.length; i++) {
        var pars = parsed[i].split(';');
        var name = pars[0];
        var phone = pars[1];
        var email = pars[2];
        if (exports.add(phone, name, email) || exports.update(phone, name, email)) {
            counter++;
        }
    }

    return counter;
};

