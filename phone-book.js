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
 * Проверка входных данных на корректность
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.correctInput = function (phone, name, email) {
    var correctPhone = (/\d{9}/.test(phone)) && (phone[0] === phone[1]) &&
    (phone[1] === phone[2]) && (phone[3] === phone[4]) && (phone[4] === phone[5]) &&
    (phone[6] === phone[7]) && (phone[8] === phone[9]);
    var correctName = (typeof name === 'string' && name.length > 0);
    var correctEmail = (typeof email === 'undefined') || (typeof email === 'string');

    return (correctPhone && correctName && correctEmail);
};

/**
 * Проверка записи в телефонной книге
 * @param {String} phone
 * @returns {Number} – -1, если номера нет; номер записи в противном случае
 */
exports.numberInPhone = function (phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {

            return i;
        }
    }

    return -1;
};

  /**

 * '1112223344' -> '+7 (111) 222-33-44'
 * @param {String} phone
 * @returns {String} телефон в новом формате
 */
exports.formatPhone = function (phone) {

    return '+7 (' + phone.substr(0, 3) + ') ' + phone.substr(3, 3) + '-' + phone.substr(6, 2) +
    '-' + phone.substr(8, 2);
};

/**
 * Преобразование записи в строку
 * @param {Object} record
 * @returns {String} запись в строку
 */
exports.recordToLine = function (record) {
    var line;
    if (record.email === undefined) {
        line = record.name + ', ' + exports.formatPhone(record.phone);
    } else {
        line = record.name + ', ' + exports.formatPhone(record.phone) +
        ', ' + record.email;
    }

    return line;
};

/**
 * Проверка на содержание подстроки
  * @param {Object} record
   * @param {String} query
   * @returns {Boolean}
   */
exports.subRecord = function (record, query) {
    var key = Object.keys(record);
    for (var i = 0; i < key.length; i++) {
        if ((record[key[i]] !== undefined) && (record[key[i]].indexOf(query) !== -1)) {
            return true;
        }
    }

    return false;
};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.add = function (phone, name, email) {
    if (exports.correctInput(phone, name, email) && exports.numberInPhone(phone) === -1) {
        if (typeof email === 'undefined') {
            phoneBook.push({ phone: phone, name: name });
        } else {
            phoneBook.push({ phone: phone, name: name, email: email });
        }

        return true;
    }

    return false;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function (phone, name, email) {
    var index = exports.numberInPhone(phone);
    if (exports.correctInput(phone, name, email) && index > -1) {
        phoneBook[index].name = name;
        if (typeof email !== 'undefined') {
            phoneBook[index].email = email;
        } else {
            delete phoneBook[index].email;
        }

        return true;
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    if (query === '') {

        return 0;
    }
    if (query === '*') {
        var n = phoneBook.length;
        phoneBook = [];

        return n;
    }
    var res = [];
    var count = phoneBook.length;
    for (var i = 0; i < phoneBook.length; i++) {
        if (!exports.subRecord(phoneBook[i], query)) {
            res.push(phoneBook[i]);
            count--;
        }
    }
    phoneBook = res;

    return count;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    if (query === '') {

        return [];
    }
    var flag = [];
    if (query === '*') {
        for (var i = 0; i < phoneBook.length; i++) {
            flag.push(exports.recordToLine(phoneBook[i]));
        }
    }
    for (var j = 0; j < phoneBook.length; j++) {
        if (exports.subRecord(phoneBook[j], query)) {
            flag.push(exports.recordToLine(phoneBook[j]));
        }
    }

    return flag.sort();
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

    var records = csv.split('\n');
    var res;
    var count = 0;
    for (var i = 0; i < records.length; i++) {
        res = records[i].split(';');
        if (exports.update(res[1], res[0], res[2]) ||
        (exports.add(res[1], res[0], res[2]))) {
            count++;
        }
    }

    return count;
};
