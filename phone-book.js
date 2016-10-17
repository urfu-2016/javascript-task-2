'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = false;

/**
 * Телефонная книга
 */
var phoneBook = [];

function isUnique(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone.toString()) {

            return false;
        }
    }

    return true;
}

function isCorrect(phone, name, email) {
    var phoneRe = /^\d{10}$/;
    if (phoneRe.test(phone) && name !== undefined && name.length > 0 &&
        typeof name === 'string' && (email === undefined || typeof email === 'string')) {

        return true;
    }

    return false;
}

function doPatheticContact(contact) {
    var newContact = contact.name + ', ';
    newContact += '+7 (' + contact.phone.slice(0, 3) + ') ' + contact.phone.slice(3, 6) +
    '-' + contact.phone.slice(6, 8) + '-' + contact.phone.slice(8, 10);
    if (contact.email !== undefined) {
        newContact += ', ' + contact.email;
    }

    return newContact;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} result of adding
 */
exports.add = function (phone, name, email) {
    if (isUnique(phone) && isCorrect(phone, name, email)) {
        phoneBook.push({
            'phone': phone.toString(),
            'name': name,
            'email': email });

        return true;
    }

    return false;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} result of adding
 */
exports.update = function (phone, name, email) {
    if (!isCorrect(phone, name, email)) {

        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone.toString()) {
            phoneBook[i].name = name;
            phoneBook[i].email = email;

            return true;
        }
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} count of element to deleting
 */
exports.findAndRemove = function (query) {
    var deleteList = exports.find(query);
    phoneBook = phoneBook.filter(function (contact) {
        return deleteList.indexOf(doPatheticContact(contact)) === -1;
    });

    return deleteList.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Boolean} result of adding
 */
exports.find = function (query) {
    var phoneList = [];
    if (query === '') {

        return phoneList;
    }
    if (query === '*') {
        phoneList = phoneBook.map(doPatheticContact).sort();

        return phoneList;
    }
    phoneList = phoneBook.filter(function (contact) {
        return (contact.phone.indexOf(query) !== -1 ||
            contact.name.indexOf(query) !== -1 ||
            (contact.email !== undefined && contact.email.indexOf(query) !== -1));
    });
    phoneList = phoneList.map(doPatheticContact).sort();

    return phoneList;
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

    return csv.split('\n').length;
};
