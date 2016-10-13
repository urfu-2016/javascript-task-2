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
 * @returns {boolean}
 */
exports.add = function (phone, name, email) {
    if (isCorrectPhone(phone) && name) {
        var contains = phoneBook.some(function (record) {
            return record.phone === phone;
        });

        if (!contains) {
            phoneBook.push({ 'phone': phone, 'name': name, 'email': email });

            return true;
        }

        return false;
    }

    return false;
};

function isCorrectPhone(phone) {
    return /^\d{10}$/.test(phone);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean}
 */
exports.update = function (phone, name, email) {
    var recordIndex = -1;
    var contains = phoneBook.some(function (record, index) {
        recordIndex = index;

        return record.phone === phone;
    });

    if (contains && name) {
        phoneBook[recordIndex] = { 'phone': phone, 'name': name, 'email': email };

        return true;
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
exports.findAndRemove = function (query) {
    var matches = exports.find(query);
    if (matches.length !== 0) {
        phoneBook = phoneBook.filter(function (record) {
            return matches.indexOf(formatPhoneBook(record)) === -1;
        });
    }

    return matches.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
  * @returns {Array}
 */
exports.find = function (query) {
    if (query === '*') {
        return sortPhoneBook(phoneBook).map(formatPhoneBook);

    } else if (!query) {

        return [];
    }
    var matches = phoneBook.filter(function (record) {
        if (record.email) {
            return (record.phone.indexOf(query) !== -1 ||
                record.name.indexOf(query) !== -1 ||
                record.email.indexOf(query) !== -1);
        }

        return (record.phone.indexOf(query) !== -1 ||
           record.name.indexOf(query) !== -1);
    });
    matches = sortPhoneBook(matches).map(formatPhoneBook);

    return matches;

};
function formatPhoneBook(record) {

    var phone = record.phone;
    var name = record.name;
    var email = record.email;
    if (email) {
        return name + ', ' + getFormatPhone(phone) + ', ' + email;
    }

    return name + ', ' + getFormatPhone(phone);
}
function sortPhoneBook(telephoneBook) {
    telephoneBook.sort(function (record1, record2) {
        return record1.name.localeCompare(record2.name);
    });

    return telephoneBook;
}

function getFormatPhone(phone) {
    return '+7 (' + phone.slice(0, 3) +
        ') ' + phone.slice(3, 6) + '-' +
        phone.slice(6, 8) + '-' +
        phone.slice(8, 10);
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
    if (!csv) {
        return 0;
    }
    var countRecords = 0;
    var contactDetails = csv.split('\n');
    contactDetails.forEach(function (record) {
        var splitRecord = record.split(';');
        var name = splitRecord[0];
        var phone = splitRecord[1];
        var email = splitRecord[2];
        if (exports.add(phone, name, email) ||
            exports.update(phone, name, email)) {
            countRecords++;
        }
    });

    return countRecords;
};
