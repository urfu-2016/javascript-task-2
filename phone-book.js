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
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} success
 */
exports.add = function (phone, name, email) {
    if (name === undefined || !isValidPhone(phone) || !isValidEmail(email)) {
        return false;
    }
    if (containsPhone(phone)) {

        return false;
    }
    phoneBook.push({ phone: phone, name: name, email: email === undefined ? '' : email });

    return true;
};

function containsPhone(phone) {

    return phoneBook.some(function (e) {

        return e.phone === phone;
    });
}

function isValidPhone(phone) {

    return /^\d{10}$/.test(phone);
}

function isValidEmail(email) {
    if (email === undefined) {

        return true;
    }

    return /^[a-z0-9_\.-]+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i.test(email);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} success
 */
exports.update = function (phone, name, email) {
    if (name === undefined || !isValidPhone(phone) || !isValidEmail(email)) {

        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            phoneBook[i].name = name;
            phoneBook[i].email = email;

            return true;
        }
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} count
 */
exports.findAndRemove = function (query) {
    var count = 0;
    var searchResult = search(query);
    for (var i = 0; i < searchResult.length; i++) {
        for (var j = 0; j < phoneBook.length; j++) {
            if (searchResult[i].phone === phoneBook[j].phone) {
                phoneBook.splice(j, 1);
                count++;
                break;
            }
        }
    }

    return count;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} records
 */
exports.find = function (query) {
    var searchResult = search(query);

    return sortAndFormat(searchResult);
};

function search(query) {
    if (query === '') {

        return [];
    }
    if (query === '*') {

        return phoneBook.slice();
    }

    return phoneBook.filter(function (value) {

        return value.phone.indexOf(query) !== -1 || value.name.indexOf(query) !== -1 || (value.email !== undefined && value.email.indexOf(query) !== -1);
    });
}

function sortAndFormat(records) {

    return records
                .map(formatRecord)
                .sort(sortRecords)
                .map(toStringRepresentation);
}

function formatRecord(record) {
    var result = [];
    result.push(record.name);
    var newNumber = '+7 (' + record.phone.slice(0, 3) +
     ') ' + record.phone.slice(3, 6) + '-' + record.phone.slice(6, 8) +
     '-' + record.phone.slice(8, 10);
    result.push(newNumber);
    result.push(record.email);

    return result;
}

function sortRecords(a, b) {
    if (a[0] > b[0]) {

        return 1;
    }
    if (a[0] < b[0]) {

        return -1;
    }

    return 0;
}

function toStringRepresentation(record) {
    var result = '';
    result += record[0];
    result += ', ' + record[1];
    if (record[2] !== undefined) {
        result += ', ' + record[2];
    }

    return result;
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
    var count = 0;
    var splitCsv = csv.split('\n');
    for (var i = 0; i < splitCsv.length; i++) {
        var elements = splitCsv[i].split(';');
        var name = elements[0];
        var phone = elements[1];
        var email = elements[2];
        if (exports.update(phone, name, email)) {
            count++;
        } else {
            var success = exports.add(phone, name, email) {
            if (succes) {
                count++;
            }
        }
    }

    return count;
};
