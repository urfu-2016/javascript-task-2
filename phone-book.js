'use strict';

var PHONE_PATTERN = /^\d{10}$/;

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */

function Record(phone, name, email) {
    this.phone = phone;
    this.name = name;
    this.email = email;
}

Record.compare = function (first, second) {
    return first.name.localeCompare(second.name);
};

function formatPhone(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' +
    phone.slice(3, 6) + '-' + phone.slice(6, 8) + '-' + phone.slice(8);
}

function getStringView(record) {
    var res = [record.name, formatPhone(record.phone)];
    if (record.email) {
        res.push(record.email);
    }

    return res.join(', ');
}

function contains(query, record) {
    return query === '*' ||
    record.phone.includes(query) ||
    (record.email && record.email.includes(query)) ||
    record.name.includes(query);
}

var phoneBook = {};

function getValues(obj) {
    return Object.keys(obj).map(function (key) {
        return obj[key];
    });
}

exports.getBook = function () {
    return phoneBook;
};


/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} isAddOrNot
 */
exports.add = function (phone, name, email) {
    if (!PHONE_PATTERN.test(phone) || phone in phoneBook || !name) {
        return false;
    }
    phoneBook[phone] = new Record(phone, name, email);

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} isUpdateOrNot
 */
exports.update = function (phone, name, email) {
    if (!(phone in phoneBook) || !name) {
        return false;
    }

    phoneBook[phone] = new Record(phone, name, email);

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
exports.findAndRemove = function (query) {
    var findResult = findRecords(query);
    findResult.forEach(function (record) {
        delete phoneBook[record.phone];
    });

    return findResult.length;
};

function findRecords(query) {
    return query ? getValues(phoneBook).filter(contains.bind(undefined, query)) : [];
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {[[String]]}
 */
exports.find = function (query) {
    var findResult = findRecords(query);
    findResult.sort(Record.compare);

    return findResult.map(getStringView);
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
    var count = 0;
    csv
    .split('\n')
    .map(function (x) {
        return x.split(';');
    })
    .forEach(function (x) {
        if (exports.add(x[1], x[0], x[2]) || exports.update(x[1], x[0], x[2])) {
            count++;
        }
    });

    return count;
};
