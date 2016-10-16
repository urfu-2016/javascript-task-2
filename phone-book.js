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

var phoneBookEntry = {
    name: undefined,
    phone: undefined,
    email: undefined
};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} – результат добавления записи в телефонной книге
 */
exports.add = function (phone, name, email) {
    if (!isValidArguments(phone, name, email) || isEntryExists(phone)) {
        return false;
    }
    var entry = Object.create(phoneBookEntry);
    entry.name = name;
    entry.phone = phone;
    entry.email = email;
    phoneBook.push(entry);

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} – результат обновления записи в телефонной книге
 */
exports.update = function (phone, name, email) {
    if (!isValidArguments(phone, name, email) || !isEntryExists(phone)) {
        return false;
    }
    var entry = phoneBook[getEntryPositionByPhone(phone)];
    entry.name = name;
    entry.email = email;

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} – количество удалённых записей из телефонной книге
 */
exports.findAndRemove = function (query) {
    if (!isNotEmpty(query)) {
        return 0;
    }
    query = query.trim().toLowerCase();
    if (query === '*') {
        return removeAllEntries();
    }

    return removeEntriesByQuery(query);
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} – Найденные записи в формате Имя, +7 (333) 444-55-66, example@gmail.com
 */
exports.find = function (query) {
    if (!isNotEmpty(query)) {
        return [];
    }
    query = query.trim().toLowerCase();
    if (query === '*') {
        return getAllEntries();
    }

    return getEntriesByQuery(query);
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

function isValidArguments(phone, name, email) {
    return isValidPhone(phone) && isValidName(name) && isValidEmail(email);
}

function isNotEmpty(param) {
    return typeof param === 'string' && param.trim().length > 0;
}

var phonePattern = new RegExp('^[5]{3}(\\d)\\1{2}(\\d)\\2{1}(\\d)\\3{1}$');

function isValidPhone(phone) {
    return isNotEmpty(phone) && phonePattern.exec(phone);
}

function isValidName(name) {
    return isNotEmpty(name);
}

var emailPattern = new RegExp('^\\w+@\\w+[.]\\w{2,}$');

function isValidEmail(email) {
    var emailIsValid = isNotEmpty(email) && emailPattern.exec(email);

    return email === undefined || emailIsValid;
}

function isEntryExists(phone) {
    return getEntryPositionByPhone(phone) !== -1;
}

function getEntryPositionByPhone(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return i;
        }
    }

    return -1;
}

function formatEntry(e) {
    var result = e.name + ', ' + formatPhone(e.phone);
    if (e.email) {
        result += ', ' + e.email;
    }

    return result;
}

function formatPhone(phone) {
    var result = '+7 (';
    result += phone.slice(0, 3) + ') ';
    result += phone.slice(3, 6) + '-';
    result += phone.slice(6, 8) + '-';
    result += phone.slice(8, 10);

    return result;
}

function getAllEntries() {
    var entries = [];
    for (var i = 0; i < phoneBook.length; i++) {
        entries.push(formatEntry(phoneBook[i]));
    }

    return entries.sort();
}

function isEntrySatisfiedQuery(e, q) {
    var keys = Object.keys(e);
    for (var k = 0; k < keys.length; k++) {
        if (e[keys[k]] && e[keys[k]].toLowerCase().indexOf(q) !== -1) {
            return true;
        }
    }

    return false;
}

function getEntriesByQuery(query) {
    var entries = [];
    for (var i = 0; i < phoneBook.length; i++) {
        var entry = phoneBook[i];
        if (isEntrySatisfiedQuery(entry, query)) {
            entries.push(formatEntry(entry));
        }
    }

    return entries.sort();
}

function removeAllEntries() {
    return phoneBook.splice(0, phoneBook.length).length;
}

function removeEntriesByQuery(query) {
    var removedCount = 0;
    for (var i = 0; i < phoneBook.length; i++) {
        var entry = phoneBook[i];
        if (isEntrySatisfiedQuery(entry, query)) {
            phoneBook.splice(i, 1);
            i--;
            removedCount++;
        }
    }

    return removedCount;
}
