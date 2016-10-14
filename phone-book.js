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
 * @returns {Boolean} result
 */
exports.add = function (phone, name, email) {
    if (!name) {
        return false;
    }
    var record = phoneBook.find(function (element) {
        return element.phone === phone;
    });
    if (record) {
        return false;
    }
    if (!/^\d{10}$/.test(phone)) {
        return false;
    }
    phoneBook.push({
        phone: phone,
        name: name,
        email: email
    });

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} result
 */
exports.update = function (phone, name, email) {
    if (!name) {
        return false;
    }
    var record = phoneBook.find(function (element) {
        return element.phone === phone;
    });
    if (!record) {
        return false;
    }
    record.name = name;
    record.email = email;

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} result
 */
exports.findAndRemove = function (query) {
    if (!query) {
        return 0;
    }
    var length = phoneBook.length;
    if (query === '*') {
        phoneBook = [];

        return length;
    }
    phoneBook = phoneBook.filter(function (element) {
        return element.phone.indexOf(query) + element.name.indexOf(query) + (element.email
            ? element.email.indexOf(query) : -1) === -3;
    });

    return length - phoneBook.length;
};

function filterRecords(query) {
    return phoneBook.filter(function (element) {
        return element.phone.indexOf(query) + element.name.indexOf(query) + (element.email
            ? element.email.indexOf(query) : -1) > -3;
    });
}

function formatNumber(number) {
    return number.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($1) $2-$3-$4');
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} result
 */
exports.find = function (query) {
    if (!query) {
        return [];
    }
    var result = [];
    var filtered = query === '*' ? phoneBook : filterRecords(query);
    for (var i = 0; i < filtered.length; i++) {
        var data = [filtered[i].name, formatNumber(filtered[i].phone)];
        if (filtered[i].email) {
            data.push(filtered[i].email);
        }
        result.push(data.join(', '));
    }

    return result.sort();
};

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    var regex = /^[А-Яа-яA-Za-z]*;\d{10}(;\w*@\w*.\w*)|()$/;
    var count = 0;
    var lines = csv.split('\n');
    for (var i = 0; i < lines.length; i++) {
        if (!regex.test(lines[i])) {
            continue;
        }
        var parsed = lines[i].split(';');
        if (!exports.add(parsed[1], parsed[0], parsed[2])) {
            count += exports.update(parsed[1], parsed[0], parsed[2]);
        } else {
            count += 1;
        }
    }

    return count;
};
