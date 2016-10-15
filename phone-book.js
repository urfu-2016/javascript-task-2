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
var phoneRegex = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;

function findPhones(query) {
    if (!query) {
        return [];
    }

    var keys = Object.keys(phoneBook).sort(function (a, b) {
        return phoneBook[a].name > phoneBook[b].name;
    });

    if (query === '*') {
        return keys;
    }

    return keys.filter(function (phone) {
        return phone.indexOf(query) !== -1 ||
            phoneBook[phone].name.indexOf(query) !== -1 ||
            phoneBook[phone].email && phoneBook[phone].email.indexOf(query) !== -1;
    });
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} isSuccess
 */
exports.add = function (phone, name, email) {
    if (phoneRegex.test(phone) && !phoneBook[phone] && name) {
        phoneBook[phone] = {
            name: name,
            email: email
        };

        return true;
    }

    return false;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} isSuccess
 */
exports.update = function (phone, name, email) {
    if (phoneBook[phone] && name) {
        phoneBook[phone] = {
            name: name,
            email: email
        };

        return true;
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} removedCount
 */
exports.findAndRemove = function (query) {
    var entries = findPhones(query);
    entries.forEach(function (phone) {
        delete phoneBook[phone];
    });

    return entries.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} foundEntries
 */
exports.find = function (query) {
    return findPhones(query).map(function (phone) {
        return phoneBook[phone].name +
            ', ' + phone.replace(phoneRegex, '+7 ($1) $2-$3-$4') +
            (phoneBook[phone].email ? (', ' + phoneBook[phone].email) : '');
    });
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

    return csv.split('\n').filter(function (string) {
        var parsed = string.split(';');
        var name = parsed[0];
        var phone = parsed[1];
        var email = parsed[2];

        return exports.update(phone, name, email) || exports.add(phone, name, email);
    }).length;
};
