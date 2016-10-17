'use strict';

/**
 * Сделано задание на звездочку.
 * Реализован метод importFromCsv
 */
exports.isStar = false;

/**
 * Телефонная книга
 */
var phoneBook = [];
var NAME = 'Name';
var PHONE = 'Phone';
var EMAIL = 'Email';

/**
 * creat correct phone.
 * @param {String} phone
 * @returns {String} отредактированный номер
 */
function correctPhone(phone) {

    return '+7 (555) ' + phone.substr(3, 3) + '-' + phone.substr(6, 2) + '-' + phone.substr(8, 2);
}

/**
 * swap i and last elem.
 * @param {Number} num
 * @returns {void}
 */
function swap(num) {
    var data = phoneBook[num];
    phoneBook[num] = phoneBook[phoneBook.length - 1];
    phoneBook[phoneBook.length - 1] = data;
}

/**
 * the existence check.
 * @param {String} phone
 * @returns {Boolean} нашли нет
 */
function findForAdd(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i][PHONE] === phone) {

            return true;
        }
    }

    return false;
}

/**
 * проверяет корректность.
 * @param {String} data
 * @returns {Boolean} нашли нет
 */
function correctData(data) {
    try {
        if (data.length === 0) {

            return false;
        }
    } catch (err) {

        return false;
    }

    return true;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} добавили нет
 */
exports.add = function (phone, name, email) {
    if (!(/^555\d\d\d\d\d\d\d$/.test(phone))) {

        return false;
    }
    if (email === undefined) {
        email = '';
    }
    if (!(correctData(name))) {

        return false;
    }
    if (findForAdd(phone, name, email)) {
        return false;
    }
    phoneBook.push({ 'Phone': phone, 'Name': name, 'Email': email });

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} обновили или нет
 */
exports.update = function (phone, name, email) {
    if (correctData(name) === 0) {

        return false;
    }
    if (email === undefined) {
        email = '';
    }
    var result = 0;
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i][PHONE] === phone) {
            phoneBook[i][NAME] = name;
            phoneBook[i][EMAIL] = email;
            result++;
        }
    }
    if (result < 0) {

        return false;
    }

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} колличество удаленных строк
 */
exports.findAndRemove = function (query) {
    var result = 0;
    if (query === '*') {
        result = phoneBook.length;
        phoneBook = [];
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if ((phoneBook[i][NAME].indexOf(query) >= 0) ||
           (phoneBook[i][PHONE].indexOf(query) >= 0) ||
           (phoneBook[i][EMAIL].indexOf(query) >= 0)) {
            result++;
            swap(i);
            i = i - 1;
            phoneBook.pop();
        }
    }

    return result;
};
function getAllData() {
    var result = [];
    for (var i = 0; i < phoneBook.length; i++) {
        result.push(correctStr(phoneBook[i]));
    }

    return result.sort();
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} str
 * @returns {String} строка
 */
function correctStr(str) {
    if (str[EMAIL] === '') {

        return str[NAME] + ', ' + correctPhone(str[PHONE]);
    }

    return str[NAME] + ', ' + correctPhone(str[PHONE]) + ', ' + str[EMAIL];
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} массив строк
 */
exports.find = function (query) {
    var result = [];
    if (query === '*') {

        return getAllData(phoneBook);
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if ((phoneBook[i][NAME].indexOf(query) >= 0) ||
           (phoneBook[i][PHONE].indexOf(query) >= 0) ||
           (phoneBook[i][EMAIL].indexOf(query) >= 0)) {
            result.push(correctStr(phoneBook[i]));
        }
    }

    return result.sort();
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

    return csv.split('\n').length;
};
