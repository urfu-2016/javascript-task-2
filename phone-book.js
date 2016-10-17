'use strict';

exports.isStar = true;

var phoneBook = {};

exports.add = function (phone, name, email) {
    if (isCorrectPhone(phone) && name && !isHavePhone(phone)) {
        phoneBook[phone] = {
            name: name
        };
        if (email) {
            phoneBook[phone].email = email;
        }

        return true;
    }

    return false;
};

function isCorrectPhone(phone) {
    var re = /^\d{10}$/;

    return re.test(phone);
}

function isHavePhone(phone) {
    return phoneBook.hasOwnProperty(phone);
}

exports.update = function (phone, name, email) {
    if (isCorrectPhone(phone) && name && isHavePhone(phone)) {
        phoneBook[phone] = {
            name: name
        };
        if (email) {
            phoneBook[phone].email = email;
        }

        return true;
    }

    return false;
};

exports.findAndRemove = function (query) {
    var foundPhones = findPhones(query);
    for (var i = 0; i < foundPhones.length; i++) {
        delete phoneBook[foundPhones[i]];
    }

    return foundPhones.length;
};

exports.find = function (query) {
    var foundPhones = findPhones(query);
    for (var i = 0; i < foundPhones.length; i++) {
        var item = [phoneBook[foundPhones[i]].name, convertPhone(foundPhones[i])];
        if (phoneBook[foundPhones[i]].hasOwnProperty('email')) {
            item.push(phoneBook[foundPhones[i]].email);
        }
        foundPhones[i] = item;
    }
    foundPhones.sort(function (a, b) {
        return a[0].localeCompare(b[0]);
    });
    for (var j = 0; j < foundPhones.length; j++) {
        foundPhones[j] = foundPhones[j].join(', ');
    }

    return foundPhones;
};

function findPhones(query) {
    if (!query) {
        return [];
    }
    if (query === '*') {
        return Object.keys(phoneBook);
    }
    var foundPhones = [];
    for (var phone in phoneBook) {
        if (isHasQuery(phone, query)) {
            foundPhones.push(phone);
        }
    }

    return foundPhones;
}

function isHasQuery(phone, query) {
    return (phone.indexOf(query) !== -1 || phoneBook[phone].name.indexOf(query) !== -1 ||
    (phoneBook[phone].hasOwnProperty('email') && phoneBook[phone].email.indexOf(query) !== -1));
}

function convertPhone(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) +
        '-' + phone.slice(6, 8) + '-' + phone.slice(8);
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
    var items = csv.split('\n');
    var success = 0;
    for (var i = 0; i < items.length; i++) {
        var item = items[i].split(';');
        if ((item.length === 2 &&
            (this.add(item[1], item[0]) || this.update(item[1], item[0]))) ||
            (item.length === 3 &&
            (this.add(item[1], item[0], item[2]) || this.update(item[1], item[0], item[2])))) {
            success++;
        }
    }

    return success;
};
