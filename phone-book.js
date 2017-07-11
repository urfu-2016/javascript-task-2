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
  * Поиск записи в книге по телефону
  * @param {String} query
  * @returns {Number} result
  */
function findByPhone(query) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === query) {

            return i;
        }
    }

    return -1;
}

/**
 * Проверка номера
 * @param {String} phone
 * @returns {boolean} result
 */
function phoneIsGood(phone) {
    if (phone.length === 10) {
        var regex = /[0-9]+/; // похоже неверно
        if (phone.match(regex) === null) {

            return false;
        }
    } else {

        return false;
    }

    return true;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean} result
 */
exports.add = function (phone, name, email) {
    if (name === undefined) {

        return false;
    }
    if (!phoneIsGood(phone)) {

        return false;
    }
    if (findByPhone(phone) !== -1) {

        return false;
    }
    var note = {
        phone: phone,
        name: name,
        email: email
    };
    phoneBook.push(note);

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean} result
 */
exports.update = function (phone, name, email) {
    if (!phoneIsGood(phone)) {

        return false;
    }
    var ind = findByPhone(phone);
    if (ind === -1) {

        return false;
    }
    if (name !== undefined) {
        phoneBook[ind].name = name;
    }
    if (email === undefined) {
        phoneBook[ind].email = '';
    } else {
        phoneBook[ind].email = email;
    }

    return true;
};

/**
 * Поиск совпадений в данной записи
 * @param {String} query
 * @param {Object} note
 * @returns {boolean} result
 */
function findMatches(query, note) {
    if (note.phone.indexOf(query) !== -1) {

        return true;
    }
    if (note.name.indexOf(query) !== -1) {

        return true;
    }
    if (note.email !== undefined) {
        if (note.email.indexOf(query) !== -1) {

            return true;
        }
    }

    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} result
 */
exports.findAndRemove = function (query) {
    if (query === undefined) {

        return 0;
    }
    var res = 0;
    if (query === '*') {
        res = phoneBook.length;
        phoneBook.splice(0, res);

        return res;
    }
    var i = 0;
    while (i < phoneBook.length) {
        if (findMatches(query, phoneBook[i])) {
            res++;
            phoneBook.splice(i, 1);
            continue;
        }
        i++;
    }

    return res;
};

/**
 * Изменение формата новера телефона
 * @param {Object} copy
 * @returns {Array} result
 */
function changeFormat(copy) {
    var temp = [];
    for (var i = 0; i < copy.length; i++) {
        temp[i] = '+7 (' + copy[i].phone.slice(0, 3) + ') ' + copy[i].phone.slice(3, 6) + '-';
        temp[i] += copy[i].phone.slice(6, 8) + '-' + copy[i].phone.slice(8, 10);
    }

    return temp;
}

/**
 * Вспомогательная функция для сортировки по имени
 * @param {Object} a
 * @param {Object} b
 * @returns {Number} result
 */
function sortByName(a, b) {
    if (a.name > b.name) {

        return 1;
    }
    if (a.name < b.name) {

        return -1;
    }

    return 0;
}

/**
 * Копирование телефонной книги
 * @param {Object} a
 * @returns {Object} result
 */
function Copy(a) {
    var result = [];
    for (var key in phoneBook) {
        result[key] = phoneBook[key];
    }
    result.sort(sortByName);
    return result;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} result
 */
exports.find = function (query) {
    if (query === undefined) {
        return [];
    }
    var copy = Copy(phoneBook);
    var i = 0;
    if (query !== '*') {
        while (i < copy.length) {
            if (findMatches(query, copy[i])) {
                i++;
                continue;
            }
            copy.splice(i, 1);
        }
    }
    var newPhones = changeFormat(copy);
    var res = [];
    for (i = 0; i < copy.length; i++) {
        res.push(copy[i].name + ', ' + newPhones[i] + ', ' + copy[i].email);
    }

    return res;
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
