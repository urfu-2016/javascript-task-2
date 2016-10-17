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
 * @returns {Boolean}
 */
exports.add = function (phone, name, email) {
    if (!checkArgument(phone) || phoneBook.hasOwnProperty(phone) || !checkArgument(name)) {

        return false;
    }

    var data = getCorrectData(phone, name, email);
    if (data && data.hasOwnProperty(phone)) {
        phoneBook[phone] = data[phone];

        return true;
    }

    return false;
};

function checkArgument(argument) {
    return (typeof argument === 'string' && argument.length !== 0);
}

function getCorrectData(phone, name, email) {
    var data = {};

    if (phone.match(/^\d{10}$/)) {
        data[phone] = {};
        if (!checkArgument(name)) {
            return false;
        }

        data[phone].name = name;
        if (checkArgument(email)) {
            data[phone].email = email;
        } else if (typeof email !== 'undefined') {
            return false;
        }
    } else {
        return false;
    }

    return data;
}


/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.update = function (phone, name, email) {
    var data = getCorrectData(phone, name, email);
    if (!data || !phoneBook.hasOwnProperty(phone)) {
        return false;
    }

    var contact = data[phone];
    if (contact.hasOwnProperty('name')) {
        phoneBook[phone].name = contact.name;
    }
    if (contact.hasOwnProperty('email')) {
        phoneBook[phone].email = contact.email;
    } else {
        delete phoneBook[phone].email;
    }

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {String}
 */
exports.findAndRemove = function (query) {
    if (!query || typeof query !== 'string') {
        return 0;
    }

    var lengthBeforeDeleting = Object.keys(phoneBook).length;
    Object.keys(phoneBook)
        .filter(function (phone) {
            return isContactRelevant(phone, query);
        })
        .forEach(function (phone) {
            delete phoneBook[phone];
        });

    return lengthBeforeDeleting - Object.keys(phoneBook).length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {
    var phoneRegExp = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;

    if (!checkArgument(query)) {
        return 0;
    }

    return Object.keys(phoneBook)
        .filter(function (phone) {
            return isContactRelevant(phone, query);
        })
        .map(function (phone) {
            var formattedPhone = phone.replace(phoneRegExp, '+7 ($1) $2-$3-$4');
            var contactEntry = phoneBook[phone].name + ', ' + formattedPhone;
            if (phoneBook[phone].hasOwnProperty('email')) {
                contactEntry += ', ' + phoneBook[phone].email;
            }

            return contactEntry;
        })
        .sort();
};

function isContactRelevant(phone, query) {
    if (phone.indexOf(query) !== -1 || query === '*') {
        return true;
    }

    return Object.keys(phoneBook[phone])
        .some(function (key) {
            return phoneBook[phone][key].indexOf(query) !== -1;
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

    var contactsStrings = csv.split('\n');
    var changedEntrysCount = 0;

    contactsStrings
        .map(function (contactString) {
            var contactParts = contactString.split(';');
            var phone = contactParts[1];

            return getCorrectData(phone, contactParts[0], contactParts[2]);
        })
        .filter(function (contact) {
            return contact || contact[Object.keys(contact)[0]];
        })
        .forEach(function (contact) {
            var phone = Object.keys(contact)[0];
            var name = contact[phone].name;
            var email = contact[phone].email;
            if (exports.update(phone, name, email) || exports.add(phone, name, email)) {
                changedEntrysCount++;
            }
        });

    return changedEntrysCount;
};
