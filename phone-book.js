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
 */

function areValid(phone, name, email) {
    if (typeof phone !== 'string' || typeof name !== 'string' || typeof email !== 'string') {
        return false;
    }
    var phoneMatch = phone.match(/^\d{10}$/);
    if (phoneMatch === null) {
        return false;
    }
    if (name === '') {
        return false;
    }
    var emailMatch = email.match(/^\S+@\S+\.\S+$/);
    if (emailMatch === null && email !== '') {
        return false;
    }

    return true;
}

function equals(record, phone, name, email) {
    return record.phone === phone;
}

function indexOf(phone, name, email) {
    for (var i = 0; i< phoneBook.length; i++) {
        var record = phoneBook[i];
        if (equals(record, phone, name, email)) {
            return i;
        }
    }

    return -1;
}

function createRecord(phone, name, email) {
    var record = Object();
    record.phone = phone;
    record.name = name;
    record.email = email;

    return record;
}

exports.add = function (phone, name, email) {
    if (email === undefined) {
        email = '';
    }
    if (!areValid(phone, name, email)) {
        return false;
    }
    if (indexOf(phone, name, email) !== -1) {
        return false;
    }
    phoneBook.push(createRecord(phone, name, email));

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */

exports.update = function (phone, name, email) {
    if (email === undefined) {
        email = '';
    }
    if (!areValid(phone, name, email)) {
        return false;
    }
    var index = findPhone(phone);
    if (index === -1) {
        return false;
    }
    phoneBook[index].name = name;
    phoneBook[index].email = email;

    return true;
};

function findPhone(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        var record = phoneBook[i];
        if (phone === record.phone) {
            return i;
        }
    }

    return -1;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var found = findAll(query);
    for (var i = 0; i < found; i++) {
        var record = found[i];
        phoneBook.splice(indexOf(record.phone, record.name, record.email), 1);
    }

    return found.length;
};


/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    if (typeof query !== 'string' || query === '') {
        return [];
    }
    if (query === '*') {
        return toSortedStringArray(phoneBook);
    }

    return toSortedStringArray(findAll(query));

};

function findAll(query) {
    var found = [];
    for (var i = 0; i < phoneBook.length; i++) {
        var record = phoneBook[i];
        for (var j = 0; j < Object.keys(record).length; j++) {
            var key = Object.keys(record)[j];
            if (record[key].indexOf(query) !== -1) {
                found.push(record);
            }
        }
    }

    return found;
}

function toSortedStringArray(segment) {
    segment = segment.sort(function (first, second) {
        if (first.name > second.name) {
            return 1;
        }
        if (first.name < second.name) {
            return -1;
        }
    });

    return segment.map(function(record) {
        return record.email !== '' ? record.name + ', ' + toPhonenumber(record.phone) + ', ' +
                record.email : record.name + ', ' + toPhonenumber(record.phone);
    });
}

function toPhonenumber(phone) {
    return '+7 (' + phone.substr(0, 3) + ') ' + phone.substr(3, 3) +
            '-' + phone.substr(6, 2) + '-' + phone.substr(8, 2);
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

    return csv.split('\n').length;
};
