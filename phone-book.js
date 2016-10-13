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

function inputValidation(phone, name, email) {
    return typeof phone === "string" && /\d{10}/.test(phone) &&
    typeof name === "string" && name !== '' && name !== undefined &&
    (typeof email === "string" || email === undefined);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.add = function (phone, name, email) {
    if (!inputValidation(phone, name, email)) {
        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return false;
        }
    }
    phoneBook.push({
        phone: phone,
        name: name,
        email: email
    });

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function (phone, name, email) {
    if (!inputValidation(phone, name, email)) {
        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
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
 */
exports.findAndRemove = function (query) {
    var findRecord = exports.find(query);
    phoneBook = phoneBook.filter(function (array) {
        return findRecord.indexOf(output(array)) === -1;
    });

    return findRecord.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    if (query === '*') {
        return phoneBook.map(output).sort();
    }
    if (query === '') {
        return [];
    }
    var masRecord = phoneBook.filter(function (arr) {
        return arr.phone.indexOf(query) !== -1 ||
            arr.name.indexOf(query) !== -1 ||
            (arr.email !== undefined && arr.email.indexOf(query) !== -1);
    });

    return masRecord.map(output).sort();
};

/**
 * @return {string}
 */
function output(con) {
    if (con.email != undefined) {
        var email = ', ' + con.email;
    } else {
        email = '';
    }

    return con.name + ', ' +
        '+7 (' + con.phone.slice(0, 3) + ') '
        + con.phone.slice(3, 6) + '-'
        + con.phone.slice(6, 8) + '-'
        + con.phone.slice(8) + email;
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
    var count = 0;
    var arrayRecord = csv.split('\n');
    arrayRecord.forEach(function (item) {
        var masData = item.split(';');
        if (exports.update(masData[1], masData[0], masData[2])) {
            count++;
        }
        if (exports.add(masData[1], masData[0], masData[2])) {
            count++;
        }
    });

    return count;
};
