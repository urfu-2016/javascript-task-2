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

exports.add = function (phone, name, email) {
    if (isCorrectPhone(phone) && !phoneBook[phone] && name) {
        phoneBook[phone] = { name: name, email: email };

        return true;
    }

    return false;
};

exports.update = function (phone, name, email) {
    if (phoneBook[phone] && name) {
        phoneBook[phone] = { name: name, email: email };

        return true;
    }

    return false;
};

exports.findAndRemove = function (query) {
    var keys = Object.keys(phoneBook);
    var deleted = 0;

    for (var i = 0; i < keys.length; i++) {
        var phone = keys[i];
        var name = phoneBook[phone].name;
        var email = phoneBook[phone].email;

        if (query && ((phone.indexOf(query) !== -1) || (name.indexOf(query) !== -1) ||
            (query === '*') || (email && (email.indexOf(query) !== -1)))) {
            delete phoneBook[phone];
            deleted = deleted + 1;
        }
    }

    return deleted;
};

exports.find = function (query) {
    var keys = Object.keys(phoneBook);
    var array = [];

    for (var i = 0; i < keys.length; i++) {
        var phone = keys[i];
        var name = phoneBook[phone].name;
        var email = phoneBook[phone].email;

        if ((phone.indexOf(query) === -1) && (name.indexOf(query) === -1) && query &&
            (query !== '*') && (email && (email.indexOf(query) !== -1))) {
            array.push(name + ', ' + formatPhone(phone) + ', ' + email);
        }

        if (query && ((phone.indexOf(query) !== -1) || (name.indexOf(query) !== -1)) ||
            (query === '*')) {
            array.push(name + ', ' + formatPhone(phone) + returnEmail(email));
        }
    }

    return array.sort();
};

exports.importFromCsv = function (csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    var contacts = csv.split('\n');
    var count = 0;

    for (var i = 0; i < contacts.length; i++) {
        var contact = contacts[i].split(';');
        var name = contact[0];
        var phone = contact[1];
        var email = contact[2];
        var isAddedOrUpdated;

        if (phoneBook[phone]) {
            isAddedOrUpdated = exports.update(phone, name, email);
        } else {
            isAddedOrUpdated = exports.add(phone, name, email);
        }

        if (isAddedOrUpdated) {
            count = count + 1;
        }
    }

    return count;
};

function isCorrectPhone(phone) {
    return /^\d{10}$/.test(phone);
}

function formatPhone(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' +
        phone.slice(6, 8) + '-' + phone.slice(8, 10);
}

function returnEmail(email) {
    if (!email) {
        return '';
    }

    return ', ' + email;
}
