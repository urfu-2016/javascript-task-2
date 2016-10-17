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
    if (!phone || !name || phoneBook.hasOwnProperty(phone)) {
        return false;
    }

    var contact = getContact(phone, name, email);
    if (contact) {
        phoneBook[phone] = contact;

        return true;
    }

    return false;
};

function getContact(phone, name, email) {
    var data = getCorrectData(phone, name, email);
    if (data && data.hasOwnProperty(phone)) {

        return data[phone];
    }
}

function getCorrectData(phone, name, email) {
    var data = {};
    var correctPhone = getMatch(phone, /^\d{10}$/);

    if (correctPhone) {
        data[correctPhone] = {};
        if (typeof name !== 'string' || name.length === 0) {
            return false;
        }
        data[correctPhone].name = name;
        if (email || email !== '' && typeof email === 'string')
            data[correctPhone] = addEntryToData(
                data[correctPhone], email, 'email', /^.*?$/);
    } else {
        return false;
    }

    return data;
}

function getMatch(string, regExp) {
    if (string) {
        var match = string.match(regExp);
        if (match) {
            return match[0];
        }
    }
}

function addEntryToData(data, string, key, regExp) {
    if (!data) {
        return false;
    }
    var result = getMatch(string, regExp);
    if (result) {
        data[key] = string;
    } else if (string) {
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
    if (!data || !phoneBook.hasOwnProperty(phone) || !name) {
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
    var numberRegExp = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;

    if (!query) {
        return false;
    }

    return Object.keys(phoneBook)
        .filter(function (phone) {
            return isContactRelevant(phone, query);
        })
        .map(function (phone) {
            var formattedPhone = phone.replace(numberRegExp, '+7 ($1) $2-$3-$4');
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

    return Object.keys(phoneBook[phone]).some(function (key) {
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
