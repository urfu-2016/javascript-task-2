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

function formatNumber(numberString) {
    var result = '+7';
    result += ' (';
    result += numberString.substring(0, 3);
    result += ') ';
    result += numberString.substring(3, 6);
    result += '-';
    result += numberString.substring(6, 8);
    result += '-';
    result += numberString.substring(8, 10);

    return result;

}

function entryToString (entry) {
    var result = '';
    result += entry[0];
    result += ', ';
    result += entry[1];
    if (entry.length === 3){
        result += ', ';
        result += entry[2];
    }

    return result;

}

function formatContact(entry) {
    var result = '';
    result += entry[0];
    result += ', ';
    result += formatNumber(entry[1]);
    if (entry.length === 3) {
        result += ', ';
        result += entry[2];
    }

    return result;

}

function scanContact(query, contact) {
    var found = false;
    for (var i = 0; i < contact.length; i++) {
        found = contact[i].includes(query) || found;
    }

    return found;

}

function querySearch(query) {
    var all = query === '*';
    var nothing = (query.trim() === '') || (typeof(query) !== 'string');
    var result = [];
    var found = false;

    if (nothing) {
        return result;
    }

    var keys = Object.keys(phoneBook);
    for (var i = 0; i < keys.length; i++) {
        found = scanContact(query, phoneBook[keys[i]]);
        if (all || found) {
            result.push(phoneBook[keys[i]]);
        }
    }

    return result;

}

function index(element, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === element) {
            return i;
        }
    }
    return -1;
}


/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean} success
 */
exports.add = function (phone, name, email) {
    var checkPhone = /^5{3}([0-9])\1{2}([0-9])\2{1}([0-9])\3{1}$/.test(phone);

    if (!checkPhone || typeof(name) !== 'string' || name.trim() === '') {
        return false;
    }

    var entries = Object.keys(phoneBook);
    for (var i = 0; i < entries.length; i++) {
        if (phone === entries[i]) {
            return false;
        }
    }

    var blank = [];

    blank.push(name);
    blank.push(phone);

    if (typeof(email) === 'string' && email.trim() !== '') {
        blank.push(email);
    }
    phoneBook[phone] = blank;

    return true;

};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean} success
 */
exports.update = function (phone, name, email) {

    var nameCheck = (typeof(name) === 'string') && (name.trim() !== '');
    var entryCheck = Object.keys(phoneBook).indexOf(phone) >= 0;
    var emailRemove = ((typeof(email) === 'string' && email.trim() === '') ||
                        typeof(email) === 'undefined');

    if (!entryCheck || !nameCheck) {
        return false;
    }

    phoneBook[phone][0] = name;

    if (phoneBook[phone].length === 3) {
        if (emailRemove) {
            phoneBook[phone].pop();
        } else {
        phoneBook[phone][2] = email;
        }
    } else if (!emailRemove) {
        phoneBook[phone].push(email);
    }

    return true;

};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {boolean} success
 */
exports.findAndRemove = function (query) {
    var found = querySearch(query);
    var keys = Object.keys(phoneBook);
    var result = 0;
    var newPhoneBook = {};

    for (var i = 0; i < found.length; i++) {
        keys.splice(index(found[i][1], keys), 1);
        result++;
    }

    for (var k = 0; k < keys.length; k++) {
        newPhoneBook[keys[k]] = phoneBook[keys[k]];
    }

    phoneBook = newPhoneBook;

    return result;

};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} entries
 */
exports.find = function (query) {
    var foundEntries = querySearch(query);

    foundEntries.sort(entrySort);

    var result = [];
    for (var k = 0; k < foundEntries.length; k++) {
        result.push(formatContact(foundEntries[k]));
    }

    return result;

};

function entrySort(entryA, entryB) {
    if (entryA[0] < entryB[0]) {
        return -1;
    } else if (entryA[0] > entryB[0]) {
        return 1;
    }
    return 0;
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
    var entries = csv.split('\n');
    var result = 0;
    var updated = false;
    var added = false;

    for (var i = 0; i < entries.length; i++) {
        var parsedContact = entries[i].split(';');
        if (parsedContact.length === 2) {
            added = exports.add(parsedContact[1], parsedContact[0]);
            updated = exports.update(parsedContact[1], parsedContact[0]);
        }

        if (parsedContact.length === 3) {
            added = exports.add(parsedContact[1], parsedContact[0], parsedContact[2]);
            updated = exports.update(parsedContact[1], parsedContact[0], parsedContact[2]);
        }

        if (added || updated) {
            result++;
        }
    }

    return result;

};
