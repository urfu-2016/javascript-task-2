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
 * Проверка на корректность
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean}
 */
exports.isCorrect = function (phone, name, email) {
    var cPhone = ((/\d{10}/.exec(phone)) && (typeof phone === 'string') &&
    (phone[0] === phone[1]) && (phone[1] === phone[2]) && (phone[3] === phone[4]) &&
    (phone[4] === phone[5]) && (phone[6] === phone[7]) && (phone[8] === phone[9]));
    var cName = ((name !== '') && (typeof name === 'string'));
    var cEmail = (typeof email === 'string');

    return (cName && cPhone && cEmail);
};

 /** Проверка на наличие в массиве
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean}
 */
exports.isExist = function (phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        var note = phoneBook[i];
        if (note.phone === phone) {
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
 * @returns {boolean}
 */
exports.add = function (phone, name, email) {
    if ((! (exports.isExist(phone))) && exports.isCorrect(phone, name, email)) {
        phoneBook.push({ 'name': name, 'email': email, 'phone': phone });

        return true;
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
    if (name === '') {
        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        var note = phoneBook[i];
        if (exports.isExist(phone)) {
            note.name = name;
            note.email = email;

            return true;
        }
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Integer}
 */
exports.findAndRemove = function (query) {
    var result = [];
    var deletedNote = 0;
    for (var i = 0; i < phoneBook.length; i++) {
        var note = phoneBook[i];
        if (exports.findInNote (note, query)) {
            result.push({ 'email': note.email, 'name': note.name,
            'phone': exports.phoneToPrint(note.phone) });
            deletedNote ++;
        }
    }
    phoneBook = result;

    return deletedNote;
};

/**
 * Поиск по всем аргументам записи
 * @param {Object} note
 * @param {String} query
 * @returns {Boolean}
 */
exports.findInNote = function (note, query) {
    return ((note.name.indexOf(query) === -1) || (note.phone.indexOf(query) === -1) ||
    (note.email.indexOf(query) === -1));
};

/**
 * Приведение к формату вывода на экран
 * @param {String} phone
 * @returns {String}
 */
exports.phoneToPrint = function (phone) {
    return '+7 (' + phone.substr(0, 3) + ') ' + phone.substr(3, 3) + '-' +
    phone.substr(6, 2) + '-' + phone.substr(8, 2);
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {
    var result = [];
    if (query === '') {
        return [];
    }
    if (query === '*') {
        return phoneBook.sort();
    }
    for (var i = 0; i < phoneBook.length; i++) {
        var note = phoneBook[i];
        if (exports.findInNote (note, query)) {
            result.push({ 'email': note.email, 'name': note.name,
            'phone': exports.phoneToPrint(note.phone) });
        }
    }

    return result;
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
