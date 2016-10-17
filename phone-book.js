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
 * @returns {Boolean} success
 */
exports.add = function (phone, name, email) {
    if (!name || !isPhoneCorrect(phone) || !isEmailCorrect(email)) {
        return false;
    }

    if (phoneBook.hasOwnProperty(phone)) {
        return false;
    }

    phoneBook[phone] = {
        name: name,
        email: email
    };

    return true;
};

function isPhoneCorrect(phone) {
    var pattern = /\d{10}$/;

    return pattern.test(phone);
}


function isEmailCorrect(email) {
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    return pattern.test(email) || email === undefined;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
    * @returns {Boolean} success
 */
exports.update = function (phone, name, email) {
    if (!name || !isPhoneCorrect(phone)) {
        return false;
    }

    if (!phoneBook.hasOwnProperty(phone)) {
        return false;
    }

    phoneBook[phone] = {
        name: name,
        email: email
    };

    return true;
};

exports.findAndRemove = function (query) {
    if (query === '' || query === undefined) {
        return 0;
    }

    var contacts = getContactsBy(query);
    contacts.forEach(function deleteFromBook(phone) {
        delete phoneBook[phone];
    });

    return contacts.length;
};

function formatPhone(phone) {

    return phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($1) $2-$3-$4');
}

function getContactsBy(query) {
    var phones = Object.keys(phoneBook);
    if (query === '*') {
        return phones;
    }

    var contacts = [];
    phones.forEach(function (phone) {
        var contact = phoneBook[phone];
        if (phone.indexOf(query) !== -1 || contact.name.indexOf(query) !== -1 ||
            (contact.email !== undefined && contact.email.indexOf(query) !== -1)) {

            contacts.push(phone);
        }
    });

    return contacts;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} Array of formatted lines
 */
exports.find = function (query) {
    if (query === '' || query === undefined) {
        return [];
    }

    var contacts = getContactsBy(query);

    contacts.sort(function byName(one, another) {
        return (phoneBook[one].name).localeCompare(phoneBook[another].name);
    });

    function formatOutput(phone) {
        return [phoneBook[phone].name, formatPhone(phone), phoneBook[phone].email]
            .filter(Boolean).join(', ');
    }

    return contacts.map(formatOutput);
};


/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    var count = 0;

    var lines = csv.split('\n');
    lines.forEach(function processLine(line) {
        var data = line.split(';');

        var name = data[0];
        var phone = data[1];
        var email = data[2];

        var containsPhone = phoneBook.hasOwnProperty(phone);
        if (!containsPhone) {
            count += exports.add(phone, name, email);
        } else {
            count += exports.update(phone, name, email);
        }
    });

    return count;
};
