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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Bool} add succsess
 */
exports.add = function (phone, name, email) {
    if (!checkInputParameters(phone, name)) {
        return false;
    }
    if (phoneBook[phone] !== undefined) {
        return false;
    }
    phoneBook[phone] = [name, email];

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Bool} update succsess
 */
exports.update = function (phone, name, email) {
    if (!checkInputParameters(phone, name)) {
        return false;
    }
    if (phoneBook[phone] === undefined) {
        return false;
    }
    phoneBook[phone] = [name, email];

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} removed records count
 */
exports.findAndRemove = function (query) {
    var removeArray = findPhoneNumbers(query);
    var removedRecordsCount = 0;
    for (var key in removeArray) {
        if (removeArray.hasOwnProperty(key)) {
            removedRecordsCount++;
            delete phoneBook[key];
        }
    }

    return removedRecordsCount;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]} finded strings
 */
exports.find = function (query) {
    var ansArray = toNameMap(findPhoneNumbers(query));
    var ansStringArray = [];
    ansArray.sort(sortByFirstElement).forEach(function (item) {
        ansStringArray.push(item[0] + ', ' + formatPhoneNumber(item[1]) +
            (item[2] ? (', ' + item[2]) : ''));
    });

    return ansStringArray;
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
    var recordsString = csv.split('\n');
    var addOrUpdatesCount = 0;

    recordsString.forEach(function (item) {
        var record = item.split(';');
        if (exports.add(record[1], record[0], record[2])) {
            addOrUpdatesCount++;
        } else if (exports.update(record[1], record[0], record[2])) {
            addOrUpdatesCount++;
        }
    });

    return addOrUpdatesCount;
};

function checkPhone(phone) {
    var phonRegex = /\d{10}/;

    return phone.search(phonRegex) >= 0;
}

function checkName(name) {
    return name && name.length > 0;
}

function checkInputParameters(phone, name) {
    return (checkName(name) && checkPhone(phone));
}

function toNameMap(map) {
    var ansArray = [];
    for (var key in map) {
        if (map.hasOwnProperty(key)) {
            var elements = map[key];
            ansArray.push([elements[0], key, elements[1]]);
        }
    }

    return ansArray;
}

function findInString(pattern, str) {
    if (!str) {
        return false;
    }

    return str.indexOf(pattern) > -1;
}

function getSelectedRecords(query) {
    var selectedRecords = {};
    for (var key in phoneBook) {
        if (findInString(query, key) || findInString(query, phoneBook[key][0]) ||
            findInString(query, phoneBook[key][1])) {
            selectedRecords[key] = phoneBook[key];
        }
    }

    return selectedRecords;
}

function findPhoneNumbers(query) {
    switch (query) {
        case '*':
            return phoneBook;
        case '':
        case undefined:
            break;
        default:

            return getSelectedRecords(query);
    }
}

function sortByFirstElement(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    if (a[0] < b[0]) {
        return -1;
    }

    return 1;
}

function formatPhoneNumber(phoneNumber) {
    return '+7 (' + phoneNumber.substring(0, 3) + ') ' + phoneNumber.substring(3, 6) + '-' +
    phoneNumber.substring(6, 8) + '-' + phoneNumber.substring(8);
}
