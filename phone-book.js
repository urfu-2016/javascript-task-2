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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {bool}
 */
exports.add = function (phone, name, email) {
    if (checkPhone(phone) || checkNameAdd(name)) {
        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return false;
        }
    }
    phoneBook.push({
        name: name,
        phone: phone,
        email: email
    });

    return true;
};

function checkPhone(phone) {
    if (typeof phone !== 'string') {
        return true;
    }
    if (String(parseInt(phone)).length !== 10 || isNaN(Number(phone))) {
        return true;
    }
    if (phone.indexOf('+') !== -1 || phone.indexOf('-') !== -1) {
        return true;
    }

    return false;
}

function checkNameAdd(name) {
    if (typeof name !== 'string' || name === undefined || name === '') {
        return true;
    }

    return false;
}

function checkNameUpdate(name) {
    if (typeof name !== 'string' || name === undefined) {
        return true;
    }

    return false;
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
    if (checkNameUpdate(name) || checkPhone(phone)) {
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
 * @returns {Number}
 */
exports.findAndRemove = function (query) {
    var res = exports.find(query);
    var count = 0;
    for (var i = 0; i < res.length; i++) {
        count += countPlus(res[i]);
    }

    return count;
};

function countPlus(res) {
    var s = '';
    for (var j = 0; j < phoneBook.length; j++) {
        s = phoneBook[j].name + ', ' + getFormatPhone(phoneBook[j].phone);
        if (phoneBook[j].email !== undefined) {
            s += ', ' + phoneBook[j].email;
        }
        if (s === res) {
            phoneBook.slice(j, 1);

            return 1;
        }
    }

    return 0;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {
    if (query === '*') {
        return getAll().sort(mySort);
    }
    if (query === '' || query === undefined) {
        return [];
    }

    return findPart(query).sort(mySort);
};

function findPart(query) {
    var res = [];
    for (var i = 0; i < phoneBook.length; i++) {
        resPush(res, phoneBook[i], query);
    }

    return res;
}

function resPush(res, obj, query) {
    var s = '';
    if (obj.phone.indexOf(query) !== -1 ||
        obj.name.indexOf(query) !== -1 ||
        (obj.email !== undefined && obj.email.indexOf(query) !== -1)) {
        s = obj.name + ', ' + getFormatPhone(obj.phone);
        if (obj.email !== undefined) {
            s += ', ' + obj.email;
        }
        res.push(s);
    }
}

function getAll() {
    var res = [];
    for (var i = 0; i < phoneBook.length; i++) {
        var s = phoneBook[i].name + ', ' + getFormatPhone(phoneBook[i].phone);
        if (phoneBook[i].email !== undefined) {
            s += ', ' + phoneBook[i].email;
        }
        res.push(s);
    }

    return res;
}


function mySort(a, b) {
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
    csv = csv.split('\n');
    var arr;
    var count = 0;
    for (var i = 0; i < csv.length; i++) {
        arr = csv[i].split(';');
        if (exports.add(arr[1], arr[0], arr[2])) {
            count++;
        } else if (exports.update(arr[1], arr[0], arr[2])) {
            count++;
        }
    }

    return count;
};
