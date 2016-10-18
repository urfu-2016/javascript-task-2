'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */
var phoneBook = [];

function checkPhoneAndName(phone, name) {
    return (phone && /^\d{10}$/.test(phone) && name);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.add = function (phone, name, email) {
    if (!checkPhoneAndName(phone, name)) {

        return false;
    }

    var isExist = phoneBook.some(function (item) {

        return phone === item.phone;
    });

    if (!isExist) {
        if (email === undefined || typeof email !== 'string') {
            email = '';
        }
        phoneBook.push({ phone: phone, name: name, email: email });

        return true;
    }

    return false;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean} isUpdated
 */
exports.update = function (phone, name, email) {
    if (!checkPhoneAndName(phone, name)) {

        return false;
    }
    var objIndex = phoneBook.findIndex(function (item) {

        return phone === item.phone;
    });

    if (objIndex === -1) {

        return false;
    }

    if (email === undefined || typeof email !== 'string') {
        email = '';
    }
    phoneBook[objIndex] = { phone: phone, name: name, email: email };

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} - количество удаленных записей
 */
exports.findAndRemove = function (query) {
    if (!query || typeof query !== 'string') {

        return 0;
    }

    if (query === '*') {

        return resultDeletedPhoneBook(-1);
    }

    return resultDeletedPhoneBook(query);
};

function resultDeletedPhoneBook(query) {
    var len;
    if (query === -1) {
        len = phoneBook.length;
        phoneBook = [];

        return len;
    }

    var newPhoneBook = phoneBook.filter(function (item) {
        var result = item.phone.indexOf(query) === -1 &&
            item.name.indexOf(query) === -1;
        if (item.email) {
            result = result && item.email.indexOf(query) === -1;
        }

        return result;
    });

    len = phoneBook.length - newPhoneBook.length;
    phoneBook = newPhoneBook;

    return len;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} - массив
 */
exports.find = function (query) {
    if (!query || typeof query !== 'string' || query === '') {

        return [];
    }

    if (query === '*') {

        return resultPhoneBook(phoneBook);
    }

    var resultBook = phoneBook.filter(function (item) {
        var result = item.phone.indexOf(query) !== -1 ||
            item.name.indexOf(query) !== -1;
        if (item.email) {
            result = result || item.email.indexOf(query) !== -1;
        }

        return result;
    });

    return resultPhoneBook(resultBook);
};

function resultPhoneBook(array) {
    array = array.sort(compare);

    return array.map(function (item) {
        var result = item.name + ', ' +
            item.phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($1) $2-$3-$4');

        if (item.email) {
            result += ', ' + item.email;
        }

        return result;
    });
}

function compare(a, b) {
    if (a.name.toLowerCase() < b.name.toLowerCase()) {

        return -1;
    }
    if (a.name.toLowerCase() > b.name.toLowerCase()) {

        return 1;
    }

    return 0;
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
    var parsed = csv.split('\n');

    var counter = 0;

    for (var i = 0; i < parsed.length; i++) {
        var pars = parsed[i].split(';');
        var name = pars[0];
        var phone = pars[1];
        var email = pars[2];
        if (exports.add(phone, name, email) || exports.update(phone, name, email)) {
            counter++;
        }
    }

    return counter;
};

