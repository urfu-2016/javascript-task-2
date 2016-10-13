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

function isValidPhone(phone) {
    var regPhone = /\d{10}/g;

    return phone !== undefined && regPhone.test(phone) && phone.length === 10;
}

function isValidEmail(email) {
    var regEmail = /((\d|\w)+@\w(\w{1,}|-)*\w.\w{2,})/g;

    return regEmail.test(email) || email === undefined;
}

function isHaveNote(phone) {

    return Object.keys(phoneBook).indexOf(phone) !== -1;
}

exports.add = function (phone, name, email) {
    if (isValidEmail(email) && isValidPhone(phone) &&
        !isHaveNote(phone) && name !== undefined) {
        phoneBook[phone] = { name: name, email: email };

        return true;
    }

    return false;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */

exports.update = function (phone, name, email) {
    if (!isValidEmail(email) || !isValidPhone(phone) ||
        isHaveNote(phone) || name === undefined) {
        return false;
    }
    phoneBook[phone].name = name;
    phoneBook[phone].email = email;
    if (email === undefined) {
        delete phoneBook[phone].email;
    }

    return true;
};

exports.findAndRemove = function (query) {
    var counter = 0;
    Object.keys(phoneBook).forEach(function (phone) {
        if (isCorrectQuery(query, phone) || query === '*') {
            counter++;
            delete phoneBook[phone];
        }
    });

    return counter;
    // Ваша необьяснимая магия здесь
};

function parsePhone(phone) {
    return '+7 (' + phone.substring(0, 3) + ') ' +
            phone.substring(3, 6) + '-' + phone.substring(6, 8) + '-' +
            phone.substring(8, phone.length);
}

function isCorrectQuery(query, phone) {

    return phone.indexOf(query) !== 1 ||
        phoneBook[phone].name.indexOf(query) !== 1 ||
        phoneBook[phone].email.indexOf(query) !== 1;
}

exports.find = function (query) {
    var newPhoneBook = [];
    Object.keys(phoneBook).forEach(function (phone) {
        if (isCorrectQuery(query, phone) || query === '*') {
            var str = phoneBook[phone].name + ', ' + parsePhone(phone);
            if (phoneBook[phone].email !== undefined) {
                str += ', ' + phoneBook[phone].email;
            }
            newPhoneBook.push(str);
        }
    });

    return newPhoneBook.sort();
};

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    var clients = csv.split('\n');
    clients.forEach(function (client) {
        var newClient = client.split(';');
        if (newClient.length < 4) {
            exports.add(newClient[0], newClient[1], newClient[2]);
        }
    });
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует

    return phoneBook.length;
};
