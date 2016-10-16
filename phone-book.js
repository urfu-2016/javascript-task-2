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

var Record = function (phone, name, email) {
    this.phone = phone.toString();
    this.name = name;
    this.email = email === undefined ? '' : email;
    this.update = function (record) {
        this.name = record.name;
        this.email = record.email;
    };
};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} – количество добавленных и обновленных записей
 */
exports.add = function (phone, name, email) {
    var rec = new Record(phone, name, email);
    if (!isValidParametrs(rec.phone, rec.name, rec.email) || isRecordExist(rec.phone)) {
        return false;
    }
    phoneBook[phone] = rec;

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} – количество добавленных и обновленных записей
 */
exports.update = function (phone, name, email) {
    var rec = new Record(phone, name, email);
    if (!isValidParametrs(rec.phone, rec.name, rec.email) || !isRecordExist(rec.phone)) {
        return false;
    }
    phoneBook[phone].update(rec);

    return true;
};

function isValidParametrs(phone, name, email) {
    return !(typeof phone !== 'string' || typeof name !== 'string' || typeof email !== 'string' ||
        !isValidPhone(phone) || !name || !isValidEmail(email));
}

function isRecordExist(phone) {
    return phone in phoneBook;
}

function isValidPhone(phone) {
    var match = phone.match(/^\d{10}$/);

    return match !== null;
}

function isValidEmail(email) {
    var match = email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.\.[a-zA-Z]{2,}$/);

    return match !== null || email === '';
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
exports.findAndRemove = function (query) {
    var result = getRecordsByQuery(query);
    var count = result.length;
    for (var i = 0; i < count; i++) {
        var key = result[i].phone;
        delete phoneBook[key];
    }

    return count;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String}
 */
exports.find = function (query) {
    var result = getRecordsByQuery(query);
    result = result.map(function (item) {
        var email = item.email ? ', ' + item.email : '';

        return item.name + ', ' + getPrettyPhone(item.phone) + email;
    });

    return result;
};

function getRecordsByQuery(query) {
    var result = [];
    if (!query) {
        return result;
    }
    var isGetAll = query === '*';
    var lowerQuery = query.toLowerCase();

    Object.keys(phoneBook).forEach(function (key) {
        var item = phoneBook[key];
        var forPhone = item.phone.toLowerCase().indexOf(lowerQuery) !== -1;
        var forEmail = item.email.toLowerCase().indexOf(lowerQuery) !== -1;
        var forName = item.name.toLowerCase().indexOf(lowerQuery) !== -1;

        if (isGetAll || forPhone || forEmail || forName) {
            result.push(item);
        }
    });
    result.sort(sortByName);

    return result;
}

function sortByName(item1, item2) {
    if (item1.name < item2.name) {
        return -1;
    }
    if (item1.name > item2.name) {
        return 1;
    }

    return 0;
}

function getPrettyPhone(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($1) $2-$3-$4');
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    var countAdded = csv
    .split('\n')
    .map(function (line) {
        var parts = line.split(';');
        if (exports.add(parts[1], parts[0], parts[2])) {
            return 1;
        }
        if (exports.update(parts[1], parts[0], parts[2])) {
            return 1;
        }

        return 0;
    })
    .reduce(function (a, b) {
        return a + b;
    });

    return countAdded;
};
