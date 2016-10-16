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

function validateString(string) {
    if (typeof(string) !== 'string' || string.length === 0) {
        throw new TypeError();
    }
}

function validatePhone(phone) {
    validateString(phone);
    if (phone.length !== 10 || isNaN(parseInt(phone))) {
        throw new TypeError();
    }
}

function validateEmail(email) {
    if (typeof(email) !== 'undefined') {
        validateString(email);
    }
}

function validateData(phone, name, email) {
    try {
        validatePhone(phone);
        validateString(name);
        validateEmail(email);
    } catch (error) {
        if (error.name === 'TypeError') {
            return false;
        }
    }

    return true;
}

function getRecord(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return phoneBook[i];
        }
    }

    return null;
}

function checkMatch(record, query) {
    var phoneMatch = record.phone.indexOf(query) !== -1;
    var nameMatch = record.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    var emailMatch = record.email === null
    ? false : record.email.toLowerCase().indexOf(query.toLowerCase()) !== -1;

    return phoneMatch || nameMatch || emailMatch;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} success
 */
exports.add = function (phone, name, email) {
    if (!validateData(phone, name, email)) {
        return false;
    }
    if (getRecord(phone) === null) {
        if (typeof(email) === 'undefined') {
            email = null;
        }
        phoneBook.push({ 'phone': phone, 'name': name, 'email': email });

        return true;
    }

    return false;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} success
 */
exports.update = function (phone, name, email) {
    if (!validateData(phone, name, email)) {
        return false;
    }
    var record = getRecord(phone);
    if (record === null) {
        return false;
    }
    record.name = String(name);
    record.email = typeof(email) === 'undefined' ? null : String(email);

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} amount
 */
exports.findAndRemove = function (query) {
    if (query === '') {
        return 0;
    }
    if (query === '*') {
        var length = phoneBook.length;
        phoneBook = [];

        return length;
    }
    var removed = 0;
    for (var i = phoneBook.length - 1; i >= 0; i--) {
        if (checkMatch(phoneBook[i], query)) {
            removed += 1;
            phoneBook.splice(i, 1);
        }
    }

    return removed;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} results
 */
exports.find = function (query) {
    if (query === '') {
        return [];
    }
    var records;
    if (query === '*') {
        records = phoneBook.slice();
    } else {
        records = phoneBook.filter(function (record) {
            return checkMatch(record, query);
        });
    }
    records.sort(function (a, b) {
        var nameA = a.name.toLowerCase();
        var nameB = b.name.toLowerCase();
        if (nameA > nameB) {
            return 1;
        } else if (nameA < nameB) {
            return -1;
        }

        return 0;
    });

    return records.map(function (record) {
        var re = /(.{3})(.{3})(.{2})(.{2})/;
        var formattedPhone = record.phone.replace(re, '+7 ($1) $2-$3-$4');
        var result = record.name + ', ' + formattedPhone;
        if (record.email !== null) {
            result += ', ' + record.email;
        }

        return result;
    });
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

    var amount = 0;
    csv.split('\n').forEach(function (item) {
        var items = item.split(';');
        if (items.length < 2) {
            return;
        }
        var name = items[0];
        var phone = items[1];
        var email = items[3];
        if (!exports.add(phone, name, email)) {
            if (exports.update(phone, name, email)) {
                amount += 1;
            }
        } else {
            amount += 1;
        }
    });

    return amount;
};
