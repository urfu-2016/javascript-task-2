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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {bool}
 */
exports.add = function (phone, name, email) {
    if (checkPhoneName(phone, name)) {
        return false;
    }
    var line = {
        name: name,
        phone: phone,
        email: email
    };
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return false;
        }
    }
    phoneBook.push(line);

    return true;
};

function checkPhoneName(phone, name) {
    var phoneNumber = Number(phone);
    if (phone.length !== 10 || isNaN(phoneNumber) || name === undefined ||
        typeof phone !== 'string') {
        return true;
    }
}

function getFormatPhone(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' +
        phone.slice(6, 8) + '-' + phone.slice(8, 10);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {bool} true/false
 */
exports.update = function (phone, name, email) {
    if (name === undefined) {
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

function find(query) {
    if (checkQuery(query)) {
        return;
    }
    var res = [];
    if (query === '*') {
        res = returnAll();
    } else {
        cic(query, res);
    }
    res.sort(sortFunction);

    return res;
}
function cic(query, res) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (checkEntry(phoneBook[i], query)) {
            returnPart(res, i);
        }
    }
}

function returnPart(res, i) {
    if (phoneBook[i].email !== undefined) {
        res.push(phoneBook[i].name + ', ' + getFormatPhone(phoneBook[i].phone) +
            ', ' + phoneBook[i].email);
    } else {
        res.push(phoneBook[i].name + ', ' + getFormatPhone(phoneBook[i].phone));
    }
}

function returnAll() {
    var res = [];
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].email !== undefined) {
            res.push(phoneBook[i].name + ', ' + getFormatPhone(phoneBook[i].phone) + ', ' +
                phoneBook[i].email);
        } else {
            res.push(phoneBook[i].name + ', ' + getFormatPhone(phoneBook[i].phone));
        }
    }

    return res;
}

function checkQuery(query) {

    return query === '' || query === undefined;
}

function checkEntry(obj, query) {
    if (obj.phone.indexOf(query) !== -1 || obj.name.indexOf(query) !== -1) {
        return true;
    }
    if (obj.email !== undefined) {
        if (obj.email.indexOf(query) !== -1) {
            return true;
        }
    }

    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
exports.findAndRemove = function (query) {
    var toRemove = find(query);
    var count = 0;
    for (var j = 0; j < toRemove.length; j++) {
        count = cicl(count, j, toRemove);
    }

    return count;
};

function cicl(count, j, toRemove) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (getFormatPhone(phoneBook[i].phone) === toRemove[j].split(', ')[1]) {
            phoneBook.splice(phoneBook.indexOf(phoneBook[i]), 1);
            count++;
            break;
        }
    }

    return count;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {

    return find(query);
};

function sortFunction(a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
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
    var count = 0;
    csv = csv.split('\n');
    for (var i = 0; i < csv.length; i++) {
        var arr = csv[i].split(';');
        console.info(exports.add(arr[1], arr[0], arr[2]));
        console.info(exports.update(arr[1], arr[0], arr[2]));
        count = countPlus(count, arr);
    }

    return count;
};

function countPlus(count, arr) {
    if (exports.add(arr[1], arr[0], arr[2])) {
        count++;
    } else if (exports.update(arr[1], arr[0], arr[2])) {
        count++;
    }

    return count;
}
