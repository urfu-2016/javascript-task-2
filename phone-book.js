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

function checkExist(phone) {
    for (var entry = 0; entry < phoneBook.length; entry++) {
        if (phone === phoneBook[entry][1]) {
            return true;
        }
    }

    return false;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */

function testPhone(phone) {
    var regvalidPhone = /\d{10}/;

    return regvalidPhone.test(phone);
}


function testEmail(email) {
    var regvalidEmail = /^[0-9a-zа-яё_-]+@[0-9a-zа-яё_-]+\.[a-zа-яё]{2,6}$/;

    return regvalidEmail.test(email) || email === undefined;
}


function addEntry(name, phone, email) {
    if (email === undefined) {
        phoneBook.push([name, phone]);
    } else {
        phoneBook.push([name, phone, email]);
    }

    return true;
}


exports.add = function (phone, name, email) {
    if (name === undefined || typeof(name) !== 'string' || typeof(phone) !== 'string') {
        return false;
    }
    if (name.length < 1) {
        return false;
    }
    if (testEmail(email) && testPhone(phone) && phoneBook.length === 0) {
        return addEntry(name, phone, email);
    }
    if (testEmail(email) && testPhone(phone) && phoneBook.length !== 0 && !checkExist(phone)) {
        return addEntry(name, phone, email);
    }

    return false;
};


function findEntryByPhone(phone) {
    for (var entry = 0; entry < phoneBook.length; entry++) {
        if (phone === phoneBook[entry][1]) {
            return entry;
        }
    }

    return -1;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Bool} flag
 */
exports.update = function (phone, name, email) {
    if (name === undefined || typeof(name) !== 'string' || typeof(phone) !== 'string') {
        return false;
    }
    if (name.length < 1) {
        return false;
    }
    var entry = findEntryByPhone(phone);
    if (entry !== -1) {
        if (testEmail(email)) {
            phoneBook[entry][0] = name;
            phoneBook[entry][2] = email;
        }
        if (email === undefined) {
            phoneBook[entry] = [name, phone];
        }

        return true;
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Integer} counter
 */
exports.findAndRemove = function (query) {
    if (query === '') {
        return 0;
    }
    var counter = 0;
    for (var entry1 = 0; entry1 < phoneBook.length; entry1++) {
        var foundEntry = findEntry(query, entry1);
        if (foundEntry !== -1) {
            delete phoneBook[entry1];
            counter += 1;
        }
    }
    var newPhoneBook = [];
    for (var entry2 = 0; entry2 < phoneBook.length; entry2++) {
        if (phoneBook[entry2] !== undefined) {
            newPhoneBook.push(phoneBook[entry2]);
        }
    }
    phoneBook = newPhoneBook;

    return counter;
};


function getPhoneForOut(phone) {
    var regvalidPhoneForOut = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;

    return phone.replace(regvalidPhoneForOut, '+7 ($1) $2-$3-$4');
}


function getEntryForOut(entry) {
    if (entry[2] !== undefined) {
        return entry[0] + ', ' + getPhoneForOut(entry[1]) + ', ' + entry[2];
    }

    return entry[0] + ', ' + getPhoneForOut(entry[1]);
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */

function sortArray(array) {
    var sortedResult = [];
    array.sort(function (a, b) {
        return a[0] > b[0];
    });
    for (var entry = 0; entry < array.length; entry++) {
        sortedResult.push(getEntryForOut(array[entry]));
    }

    return sortedResult;
}


function findEntry(query, ent) {
    for (var field = 0; field < phoneBook[ent].length; field++) {
        if (phoneBook[ent][field] !== undefined && phoneBook[ent][field].search(query) !== -1) {
            return ent;
        }
    }

    return -1;
}

exports.find = function (query) {
    var result = [];
    if (query === '*') {
        for (var entry1 = 0; entry1 < phoneBook.length; entry1++) {
            result.push(phoneBook[entry1]);
        }

        return sortArray(result);
    }
    for (var entry2 = 0; entry2 < phoneBook.length; entry2++) {
        var entry = entry2;
        var foundEntry = findEntry(query, entry);
        if (foundEntry !== -1) {
            result.push(phoneBook[entry]);
        }
    }

    return sortArray(result);
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
