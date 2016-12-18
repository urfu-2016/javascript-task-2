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
 * @returns {Bool}
 */
exports.add = function (phone, name, email) {
    if (typeof phone !== 'string' || typeof name !== 'string' ||
                phone.match(/^\d{10}$/) === null ||
                exists(phone)) {
        return false;
    }
    phoneBook.push({
        phone: phone,
        name: name,
        email: email
    });

    return true;
};

function exists(phone) {
    var finded = false;
    phoneBook.forEach(function (item) {
        if (typeof item !== 'undefined' &&
                    item.phone === phone) {
            finded = true;
        }
    });

    return finded;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Bool}
 */
exports.update = function (phone, name, email) {
    if (typeof phone !== 'string' ||
                phone.match(/^\d{10}$/) === null ||
                typeof name !== 'string' || !name) {
        return false;
    }
    var finded = false;
    phoneBook.forEach(function (record) {
        if (typeof record !== 'undefined' && record.phone === phone) {
            record.name = name;
            record.email = email;
            finded = true;
        }
    });

    return finded;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
exports.findAndRemove = function (query) {
    if (typeof query !== 'string') {
        return [];
    }
    var count = 0;
    getRecordsByQuery(query).forEach(function (record) {
        delete phoneBook[phoneBook.indexOf(record)];
        count++;
    });

    return count;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {
    if (typeof query !== 'string') {
        return [];
    }
    var result = [];
    getRecordsByQuery(query).forEach(function (record) {
        result.push(record.name + ', ' +
                formatPhone(record.phone) +
                addEmail(record.email));
    });

    return result.sort();
};

function getRecordsByQuery(query) {
    var result = [];
    phoneBook.forEach(function (record) {
        if (typeof record !== 'undefined' &&
                    query !== '' && (query === '*' ||
                    record.phone.indexOf(query) >= 0 ||
                    record.name.indexOf(query) >= 0 ||
                    (typeof record.email !== 'undefined' &&
                        record.email.indexOf(query) >= 0))) {
            result.push(record);
        }
    });

    return result;
}

function formatPhone(phone) {
    return '+7 (' + phone.substring(0, 3) + ') ' +
                phone.substring(3, 6) + '-' +
                phone.substring(6, 8) + '-' +
                phone.substring(8, 10);
}

function addEmail(email) {
    return typeof email === 'undefined' ? '' : ', ' + email;
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
    csv.split('\n').forEach(function (item) {
        var fields = item.split(';');
        if (fields.length >= 2 && fields.length <= 3 &&
                    fields[1].match(/^\d{10}$/) && fields[0]) {
            fields.forEach(function (field) {
                if (field === '') {
                    field = undefined;
                }
            });
            count += addOrUpdate(fields);
        }
    });

    return count;
};


function addOrUpdate(fields) {
    var count = 0;
    if (exists(fields[1])) {
        if (exports.update(fields[1], fields[0], fields[2])) {
            count++;
        }
    } else if (exports.add(fields[1], fields[0], fields[2])) {
        count++;
    }

    return count;
}
