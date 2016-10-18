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
exports.add = function (phone, name, email) {
    if (!isCorrectPhone(phone) || !duplicationPhone(phone) || !name) {
        return false;
    }
    phoneBook[phone] = {'phone': phone, 'name': name, 'email': email};

    return true;
};

function isCorrectPhone(phone) {
    return /^\d{10}$/.test(phone);
}

function duplicationPhone(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        var doubling = phoneBook[i];
        if (Number(phone) === Number(doubling)) {
            return false;
        }
    }

    return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function (phone, name, email) {
    if (phone in phoneBook || !name || !isCorrectPhone(phone)) {
        return false;
    }
    phoneBook[phone] = { 'name': name, 'email': email };

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var newPhoneBook = [];
    if (query === '') {
        return 0;
    }
    if (typeof(query) !== 'string') {

        return 0;
    }
    if (query === '*') {
        var allRemoved = phoneBook.length;
        phoneBook = [];

        return allRemoved;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (!isSubstr(phoneBook[i], query)) {
            newPhoneBook.push(phoneBook[i]);
        }
    }
    var removed = phoneBook.length - newPhoneBook.length;
    phoneBook = newPhoneBook;

    return removed;
};

function isSubstr(arr, str) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== undefined && arr[i].indexOf(str) !== -1) {

            return true;
        }
    }

    return false;
}

function endedFind(query) {
    var findPhone = [];
    if (query === '*') {
        for (var j = 0; j < phoneBook.length; j++) {
            findPhone.push(formatPhoneBook(phoneBook[j]));
        }

        return findPhone;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (isSubstr(phoneBook[i], query)) {
            findPhone.push(formatPhoneBook(phoneBook[i]));
        }
    }

    return findPhone;
}

function formatPhoneBook(itemPhoneBook) {
    var formatedItem = '';
    var phone = '+7 (' + itemPhoneBook[0].slice(0, 3) + ') ' + itemPhoneBook[0].slice(3, 6) +
        '-' + itemPhoneBook[0].slice(6, 8) + '-' + itemPhoneBook[0].slice(8, 10);
    if (itemPhoneBook[2] !== undefined) {
        formatedItem = itemPhoneBook[1] + ', ' + phone + ', ' + itemPhoneBook[2];
    } else {
        formatedItem = itemPhoneBook[1] + ', ' + phone;
    }

    return formatedItem;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    var findPhone = [];
    if (typeof(query) !== 'string' || query === '') {
        return findPhone.sort();
    }
    findPhone = endedFind(query);

    return findPhone.sort();
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
    var count = 0;
    var splitCsv = csv.split('\n');
    for (var i = 0; i < splitCsv.length; i++) {
        var data = splitCsv[i].split(';');
        var name = data[0];
        var phone = data[1];
        var email = data[2];
        if (exports.add(phone, name, email) || exports.update(phone, name, email)) {
            count++;
        }
    }

    return count;
};
