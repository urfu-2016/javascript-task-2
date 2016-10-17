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
    if (!checkPhoneFormat(phone) || !name) {
        return false;
    }

    var phoneContains = phoneBook.some(function (bookPhone) {
        return bookPhone.phone === phone;
    });

    if (!phoneContains) {
        phoneBook.push({ 'phone': phone, 'name': name, 'email': email });

        return true;
    }

    return false;
};

function checkPhoneFormat(phone) {
    return phone && phone.length === 10 && !phone.match(/[^0-9]/gi);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean}
 */
exports.update = function (phone, name, email) {
    var findingRecord = -1;
    var containsPhone = phoneBook.some(function (bookPhone, index) {
        findingRecord = index;

        return bookPhone.phone === phone;
    });
    if (containsPhone && name) {
        phoneBook[findingRecord] = { 'phone': phone, 'name': name, 'email': email };

        return true;
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Integer}
 */
exports.findAndRemove = function (query) {
    if (!query) {
        return 0;
    }
    if (query === '*') {
        var countPhones = phoneBook.length;
        phoneBook = [];

        return countPhones;
    }
    var foundPhones = getFoundPhones(query).map(function (record) {
        return record.phone;
    });
    phoneBook = phoneBook.filter(function (record) {
        return (record.phone in foundPhones);
    });

    return foundPhones.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {
    if (!query) {
        return [];
    }

    if (query === '*') {
        return phoneBook.sort(function (a, b) {
            return a.name > b.name;
        }).map(formatPhoneRecord);
    }

    var foundPhones = getFoundPhones(query);

    return foundPhones.sort(function (a, b) {
        return a.name > b.name;
    }).map(formatPhoneRecord);
};

function getFoundPhones(query) {
    return phoneBook.filter(function (phoneRecord) {
        return (phoneRecord.name.indexOf(query) !== -1 ||
        phoneRecord.phone.indexOf(query) !== -1 ||
        (phoneRecord.email
            ? phoneRecord.email.indexOf(query) !== -1
            : false));
    });
}

function formatPhoneRecord(record) {
    var formattedRecord = record.name + ', ' + getFormattedPhone(record.phone);

    return record.email ? formattedRecord + ', ' + record.email : formattedRecord;
}

function getFormattedPhone(phone) {
    var formattedPhone = '+7 (' + phone.substring(0, 3) + ') ';
    formattedPhone += [phone.substring(3, 6), phone.substring(6, 8), phone.substring(8, 10)]
        .join('-');

    return formattedPhone;
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
    var countAddedRecords = 0;
    csv.split('\n').forEach(function (record) {
        var phoneRecord = record.split(';');
        var name = phoneRecord[0];
        var phone = phoneRecord[1];
        var email = phoneRecord[2];
        if (exports.add(phone, name, email) ||
            exports.update(phone, name, email)) {
            countAddedRecords++;
        }
    });

    return countAddedRecords;
};
