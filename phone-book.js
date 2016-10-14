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

function isValidEmail(email) {
    var emailMatch = email.match(/^\S+@\S+\.\S+$/);

    return !(emailMatch === null && email !== '');
}

function isValidPhone(phone) {
    var phoneMatch = phone.match(/^\d{10}$/);

    return phoneMatch !== null;
}

function areValid(phone, name, email) {
    return !(typeof phone !== 'string' || typeof name !== 'string' ||
        typeof email !== 'string' ||
        !isValidPhone(phone) || name === '' || !isValidEmail(email));
}

function equals(recordFirst, recordSecond) {
    return recordFirst.phone === recordSecond.phone;
}

function indexOf(phone, name, email) {
    for (var i = 0; i < phoneBook.length; i++) {
        var record = phoneBook[i];
        if (equals(record, createRecord(phone, name, email))) {
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


function add(phone, name, email) {
    if (email === undefined) {
        email = '';
    }
    phone = phone.toString();
    if (!areValid(phone, name, email)) {
        return false;
    }
    if (indexOf(phone, name, email) !== -1) {
        return false;
    }
    phoneBook.push(createRecord(phone, name, email));

    return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */

function update(phone, name, email) {
    if (email === undefined) {
        email = '';
    }
    phone = phone.toString();
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
}

function findPhone(phone) {
    phone = phone.toString();
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
 * @returns {int} length
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
 * @returns {Array} sortedStringArray
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
    return phoneBook.filter(function (record) {
        var keys = Object.keys(record);
        for (var i = 0; i < keys.length; i++) {
            if (record[keys[i]].indexOf(query) !== -1) {
                return true;
            }
        }

        return false;
    });
}

function toSortedStringArray(segment) {
    var sorted = segment.sort(function (first, second) {
        if (first.name > second.name) {
            return 1;
        }
        if (first.name < second.name) {
            return -1;
        }

        return 0;
    });

    return sorted.map(function (record) {
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
    var strings = csv.split('\n');
    var countChanges = 0;
    for (var i = 0; i < strings.length; i++) {
        var values = strings[i].split(';');
        var name = values[0];
        var phone = values[1];
        var email = values[2];
        if (add(phone, name, email) || update(phone, name, email)) {
            countChanges++;
        }
    }

    return countChanges;
};

exports.add = function (phone, name, email) {
    return add(phone, name, email);
};

exports.update = function (phone, name, email) {
    return update(phone, name, email);
};
