'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */
var phoneBook = []; /* {phone: string, name: string, (email: string)*/

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean}
 */
var phoneReg = /\d+/;
exports.add = function (phone, name, email) {
    if (addNote(phone, name, email)) {
        phoneBook.sort(compareByName);

        return true;
    }

    return false;
};

function addNote(phone, name, email) {
    if (isCorrectPhone(phone) || phoneBook.some(isPhoneInBook, phone) || name === undefined) {
        return false;
    }
    phoneBook.push(createPhoneBookObject(phone, name, email));

    return true;
}

function isCorrectPhone(phone) {
    return phoneReg.exec(phone)[0].length !== 10;
}

function compareByName(note1, note2) {
    return note1.name.localeCompare(note2.name);
}

function createPhoneBookObject(phone, name, email) {
    var phoneBookObj = { phone: phone, name: name };
    if (email !== undefined) {
        phoneBookObj.email = email;
    }

    return phoneBookObj;
}

/** @this isPhoneInBook
 * @param {String} element
 * @returns {boolean}
 */
function isPhoneInBook(element) {
    return isEquals(element.phone, this);
}

function isEquals(item1, item2) {
    return item1 === item2;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean}
 */
exports.update = function (phone, name, email) {
    if (phone === undefined || name === undefined) {
        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            phoneBook[i] = createPhoneBookObject(phone, name, email);

            return true;
        }
    }

    return false;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {
    return findCorrectNotes(query, isNoteInBook).map(stylizeNote);
};

/**
 * @param {Object} note
 * @returns {String}
 */
function stylizeNote(note) {
    var stylizedNote = '';
    stylizedNote += note.name + ', ';
    stylizedNote += stylizePhoneNumber(note.phone);
    if (note.hasOwnProperty('email')) {
        stylizedNote += ', ' + note.email;
    }

    return stylizedNote;
}

/**
 * @param {String} phone
 * @returns {String}
 */
function stylizePhoneNumber(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' + stylizeLastSevenNumbers(phone);
}

/**
 * @param {String} phone
 * @returns {String}
 */
function stylizeLastSevenNumbers(phone) {
    var result = ''
    var indexes = [3, 6, 8];
    for (var i = 0; i < indexes.length; i++) {
        if (i !== indexes.length - 1) {
            result += phone.slice(indexes[i], indexes[i + 1]) + '-';
        } else {
            result += phone.slice(indexes[i], phone.length);
        }
    }

    return result;
}

/**
 * @param {String} query
 * @param {Function} filterFunc
 * @returns {Array}
 */
function findCorrectNotes(query, filterFunc) {
    if (!query || query.length === 0) {
        return [];
    }
    if (query === '*') {
        query = '.';
    }
    query = query.replace(/\\/, '\\\\');
    query = query.replace(/\./, '\\.');
    var regexp = new RegExp(query);

    return phoneBook.filter(filterFunc, regexp);
}

function correctQuery(query) {
    var specialSymbols = '\\.[]()^\'"$?*+=!|{}'

    return query;
}

/**
 * @this isNoteInBook
 * @param {Object} item
 * @param {RegExp} regexp
 * @returns {boolean}
 */
function isNoteInBook(item, regexp) {
    if (typeof regexp === 'number') {
        regexp = this;
    }
    for (var key in item) {
        if (regexp.exec(item[key])) {
            return true;
        }
    }

    return false;
}

/**
 * @this isNotNoteInBook
 * @param {Object} item
 * @returns {boolean}
 */
function isNotNoteInBook(item) {
    return !isNoteInBook(item, this);
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
exports.findAndRemove = function (query) {
    var oldPhoneBookLength = phoneBook.length;
    phoneBook = findCorrectNotes(query, isNotNoteInBook);

    return oldPhoneBookLength - phoneBook.length;
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
