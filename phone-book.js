'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

function checkPhone(phone) {
    var re = /\d{10}/;

    return re.test(phone);
}

function checkName(name) {
    return name && name.length > 0;
}

function getRegexpFromQuery(query) {
    if (query === '*') {
        return new RegExp('.' + query);
    }
    if (query === '') {
        return null;
    }

    return new RegExp('.*' + query + '.*');
}

function sortPhoneBook(a, b) {
    return a[0] > b[0];
}

function phoneFormat(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' +
        phone.slice(3, 6) + '-' + phone.slice(6, 8) +
        '-' + phone.slice(8, 10);
}

function recordFormat(key, record) {
    var result = '';
    result += record.Name;
    result += ', ';
    result += phoneFormat(key);
    if (record.Email) {
        result += ', ';
        result += record.Email;
    }

    return result;
}

/**
 * Телефонная книга
 */
var phoneBook = {};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.add = function (phone, name, email) {
    if (checkPhone(phone) &&
        !(phone in phoneBook) &&
        checkName(name)) {
        phoneBook[phone] = { Name: name, Email: email };

        return true;
    }

    return false;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.update = function (phone, name, email) {
    if (phone in phoneBook && name.length > 0) {
        phoneBook[phone] = { Name: name, Email: email };

        return true;
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
exports.findAndRemove = function (query) {
    var keys = findKeys(query);
    for (var i = 0; i < keys.length; i++) {
        delete phoneBook[keys[i]];
    }

    return keys.length;
};

function findKeys(query) {
    var result = [];
    var re = getRegexpFromQuery(query);
    if (!re) {
        return result;
    }
    var keys = Object.keys(phoneBook);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (re.test(key) || re.test(phoneBook[key].Name) || re.test(phoneBook[key].Email)) {
            result.push(key);
        }
    }

    return result.sort(sortPhoneBook);
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {
    var result = [];
    var keys = findKeys(query);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        result.push(recordFormat(key, phoneBook[key]));
    }

    return result.sort(sortPhoneBook);
};

function parseCsv(record) {
    var parse = record.split(';');
    var result = { Name: parse[0], Phone: parse[1] };
    if (parse[2]) {
        result.Email = parse[2];
    }

    return result;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    var countAdded = 0;
    var records = csv.split('\n');
    for (var i = 0; i < records.length; i++) {
        var e = records[i];
        var record = parseCsv(e);
        var success = exports.add(record.Phone, record.Name, record.Email);
        success = !success ? exports.update(record.Phone, record.Name, record.Email) : success;
        if (success) {
            countAdded++;
        }
    }

    return countAdded;
};
