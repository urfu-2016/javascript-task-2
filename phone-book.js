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
 * @returns {Boolean}
 */

exports.add = function (phone, name, email) {
    if (checkPhone(phone) && checkName(name) && !(checkExist(phone))) {
        phoneBook[phone] = [phone, name, email || ''];

        return true;
    }

    return false;
};

function checkPhone(phone) {
    var re = /^\d{10}$/;

    return re.test(phone);
}

function checkName(name) {
    return name !== '' && name !== undefined;
}

function checkExist(phone) {
    return phone in phoneBook;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.update = function (phone, name, email) {
    if (checkPhone(phone) && checkName(name) && checkExist(phone)) {
        phoneBook[phone] = [phone, name, email || ''];

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
    if (query === '') {
        return 0;
    }
    if (query === '*') {
        var count = Object.keys(phoneBook).length;
        phoneBook = {};
        return count;
    }
    var findRec = searchString(query);
    findRec.forEach(function (x) {
        delete phoneBook[x[0]];
    });

    return findRec.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {
    if (query === '') {
        return [];
    }
    if (query === '*') {
        return getNPE(phoneBook).sort(compare);
    }

    return getNPE(searchString(query)).sort(compare);
};

function getNPE(records) {
    var answer = [];
    for (var rec in records) {
        if (records[rec][2] !== '') {
            answer.push(records[rec][1] + ', ' +
             newFormatPhone(records[rec][0]) + ', ' + records[rec][2]);
        } else {
            answer.push(records[rec][1] + ', ' + newFormatPhone(records[rec][0]));
        }
    }

    return answer;
}

function compare(x, y) {
    return x[0].localeCompare(y[0]);
}

function searchString(query) {
    var searchRecord = [];
    for (var record in phoneBook) {
        if (phoneBook[record][2].indexOf(query) !== -1 ||
        phoneBook[record][0].indexOf(query) !== -1 ||
        phoneBook[record][1].indexOf(query) !== -1) {
            searchRecord.push([phoneBook[record][0], phoneBook[record][1], phoneBook[record][2]]);
        }
    }

    return searchRecord;
}

function newFormatPhone(record) {
    return ('+7 (' + record.substring(0, 3) + ') ' + record.substring(3, 6) + '-' +
        record.substring(6, 8) + '-' + record.substring(8, 10));
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
    var cut = csv
    .split('\n')
    .map(function (x) {
        return x.split(';');
    });

    var count = 0;
    for (var record in cut) {
        if (exports.add(cut[record][1], cut[record][0], cut[record][2]) ||
            exports.update(cut[record][1], cut[record][0], cut[record][2])) {
            count++;
        }
    }

    return count;
};
