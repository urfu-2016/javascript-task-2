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

function isCorrectPhone(phone) {
    return /^\d{10}$/.test(phone);
}

exports.add = function (phone, name, email) {
    if (phone in phoneBook || !name || !isCorrectPhone(phone)) {
        return false;
    }
    phoneBook[phone] = { 'name': name, 'email': email };

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function (phone, name, email) {
    if (!(phone in phoneBook) || !name) {
        return false;
    }
    phoneBook[phone] = { 'name': name, 'email': email };

    return true;
};

function isSubstring(string, substring) {
    if (!string) {
        return false;
    }

    return string.indexOf(substring) !== -1;
}

function isContactFitToQuery(query, phone) {
    var contactInfo = phoneBook[phone];

    return isSubstring(phone, query) ||
        isSubstring(contactInfo.name, query) ||
        isSubstring(contactInfo.email, query);
}

function getFilterForQuery(query) {
    return function (phone) {
        return isContactFitToQuery(query, phone);
    };
}

function internalFind(query) {
    if (!query) {
        return [];
    }
    if (query === '*') {
        return Object.keys(phoneBook);
    }

    return Object.keys(phoneBook).filter(getFilterForQuery);
}

// как же тяжело без лямбд...
function internalRemove(phone) {
    delete phoneBook[phone];
}

function prettifyPhone(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' +
        phone.slice(3, 6) + '-' +
        phone.slice(6, 8) + '-' +
        phone.slice(8, 10);
}

function phoneToContactString(phone) {
    var result = phoneBook[phone].name + ', ' + prettifyPhone(phone);
    if (phoneBook[phone].email) {
        result += ', ' + phoneBook[phone].email;
    }

    return result;
}

function compareFunction(phone, otherPhone) {
    if (phone === otherPhone) {
        return 0;
    }
    if (phone < otherPhone) {
        return -1;
    }

    return 1;
}

function getPrettyFindResultForPhones(phones) {
    return phones.sort(compareFunction).map(phoneToContactString);
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var contactsToRemove = internalFind(query);
    contactsToRemove.forEach(internalRemove);

    return contactsToRemove.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    if (!query) {
        return [];
    }
    if (query === '*') {
        return getPrettyFindResultForPhones(Object.keys(phoneBook));
    }

    return getPrettyFindResultForPhones(internalFind(query));
};

function handleCsvLine(line) {
    var contact = line.split(';');
    if (contact.length < 2 || contact.length > 3) {
        return false;
    }
    var name = contact[0];
    var phone = contact[1];
    var email;
    if (contact.length === 3) {
        email = contact[2];
    }
    if (!phoneBook[contact[1]]) {
        return exports.add(phone, name, email);
    }

    return exports.update(phone, name, email);
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
    return csv.split('\n').filter(handleCsvLine).length;
};
