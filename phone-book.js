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

function transformPhone(phone) {
    if (phone === '') {
        return '';
    }
    var parts = /^(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(phone);
    if (parts === null) {
        return '';
    }

    return '+7 (' + parts[1] + ') ' + parts[2] + '-' + parts[3] + '-' + parts[4];
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {bool}
 */
exports.add = function (phone, name, email) {
    if (!isValidData(phone, name)) {
        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return false;
        }
    }
    var newRecord = {
        name: name,
        phone: phone,
        email: ''
    };
    if (email !== undefined && email !== '') {
        newRecord.email = email;
    }
    phoneBook.push(newRecord);

    return true;
};

function isValidData(phone, name) {
    if (phone === undefined || transformPhone(phone) === '') {
        return false;
    }
    if (name === undefined || name === '') {
        return false;
    }

    return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {bool}
 */
exports.update = function (phone, name, email) {
    if (!isValidData(phone, name)) {
        return false;
    }
    var indexOfNeedRecords = findIndexsOfRecords(phone);
    if (indexOfNeedRecords.length !== 1) {
        return false;
    }
    // if (name !== undefined && name.length !== 0) {
        // phoneBook[indexOfNeedRecords[0]].name = name;
    // } else {
        // return false;
    // }
    phoneBook[indexOfNeedRecords[0]].name = name;
    if (email === undefined) {
        phoneBook[indexOfNeedRecords[0]].email = '';
    }
    if (email !== undefined && email !== '') {
        phoneBook[indexOfNeedRecords[0]].email = email;
    }

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {int}
 */
exports.findAndRemove = function (query) {
    if (query === undefined || query === '') {
        return 0;
    }
    var countRecordsForRemove;
    if (query === '*') {
        countRecordsForRemove = phoneBook.length;
        phoneBook = [];

        return countRecordsForRemove;
    }
    var indexsRecordsForRemove = findIndexsOfRecords(query);
    countRecordsForRemove = indexsRecordsForRemove.length;
    removeRecords(indexsRecordsForRemove);

    return countRecordsForRemove;
};

function removeRecords(indexs) {
    for (var i = 0; i < indexs.length; i++) {
        delete phoneBook[indexs[i]];
    }
    for (var k = 0; k < phoneBook.length; k++) {
        if (phoneBook[k] === undefined) {
            phoneBook.splice(k, 1);
            k--;
        }
    }
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String}
 */
exports.find = function (query) {
    if (query === undefined || query === '') {
        return [];
    }
    if (query === '*') {
        return transformBook(phoneBook).sort();
    }
    var indexsOfRecords = findIndexsOfRecords(query);
    var resultBook = [];
    for (var i = 0; i < indexsOfRecords.length; i++) {
        resultBook.push(phoneBook[indexsOfRecords[i]]);
    }

    return transformBook(resultBook).sort();
};

function transformBook(book) {
    var recordsAsStrings = [];
    for (var i = 0; i < book.length; i++) {
        var record = book[i].name + ', ' + transformPhone(book[i].phone);
        if (book[i].email !== '') {
            record += ', ' + book[i].email;
        }
        recordsAsStrings.push(record);
    }

    return recordsAsStrings;
}

function findIndexsOfRecords(query) {
    var indexsOfRecords = [];
    for (var i = 0; i < phoneBook.length; i++) {
        var reg = new RegExp(query, 'i');
        var execName = reg.exec(phoneBook[i].name);
        var execPhone = reg.exec(phoneBook[i].phone);
        var execEmail = phoneBook[i].email !== '' && reg.exec(phoneBook[i].email);
        if (execName || execPhone || execEmail) {
            indexsOfRecords.push(i);
        }
    }

    return indexsOfRecords;
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
    var strings = csv.split('\n');
    var countRecords = 0;
    for (var i = 0; i < strings.length; i++) {
        var oneString = strings[i].split(';');
        if (oneString.length !== 2 && oneString.length !== 3) {
            continue;
        }
        var resultAdd = exports.add(oneString[1], oneString[0], oneString[2]);
        if (resultAdd) {
            countRecords++;
            continue;
        }
        var resultUpdate = exports.update(oneString[1], oneString[0], oneString[2]);
        if (resultUpdate) {
            countRecords++;
        }
    }

    return countRecords;
};
