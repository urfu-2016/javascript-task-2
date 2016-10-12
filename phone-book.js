'use strict';

var util = require('util');

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
 * Валидация входных данных
 * @param {String} phone
 * @param {String} name
 * @returns {boolean|*}
 */
var isValid = function (phone, name) {
    return /^\d{10}$/gi.test(phone) && name;
};

/**
 * Получение записей
 * @param {String} query
 * @returns {Array.<T>}
 */
var getRecords = function (query) {
    return phoneBook.filter(function (record) {
        return record.phone.indexOf(query) !== -1 ||
            record.name.indexOf(query) !== -1 ||
            record.email.indexOf(query) !== -1;
    });
};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean}
 */
exports.add = function (phone, name, email) {
    if (isValid(phone, name)) {
        var records = getRecords(phone);
        if (records.length === 0) {
            phoneBook.push({
                name: name,
                phone: phone,
                email: email || ''
            });

            return true;
        }

        return false;
    }

    return false;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean}
 */
exports.update = function (phone, name, email) {
    if (isValid(phone, name)) {
        var records = getRecords(phone);
        if (records.length === 1) {
            var index = phoneBook.indexOf(records[0]);
            phoneBook[index].name = name;
            phoneBook[index].email = email || '';

            return true;
        }

        return false;
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
exports.findAndRemove = function (query) {
    var records = getRecords(query);
    records.forEach(function (record) {
        phoneBook.splice(phoneBook.indexOf(record), 1);
    });

    return records.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array.<T>}
 */
exports.find = function (query) {
    var records = query === '*' ? getRecords('') : getRecords(query);

    return records.map(function (record) {
        var phone = /(\d{3})(\d{3})(\d{2})(\d{2})/gi.exec(record.phone);
        var line = util.format('%s, %s', record.name,
            util.format('+7 (%s) %s-%s-%s',
                phone[1], phone[2], phone[3], phone[4]
            ));

        return record.email !== '' ? util.format('%s, %s', line, record.email) : line;
    }).sort();
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
    var csvLines = csv.split('\n');
    for (var index = 0; index < csvLines.length; index++) {
        var data = csvLines[index].split(';');
        if (data.length < 4 &&
            (this.add(data[1], data[0], data[2]) ||
            this.update(data[1], data[0], data[2]))) {
            count++;
        }
    }

    return count;
};
