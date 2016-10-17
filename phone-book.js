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

function isPhoneValid(phone) {
    return /^\d{10}$/.test(phone);
}

function isArgumentsValid(phone, name) {
    return isPhoneValid(phone) && name;
}

function getEntries(query) {
    if (query === '') {
        return [];
    }
    var entries = Object.keys(phoneBook).map(function (key) {
        return phoneBook[key];
    });
    if (query === '*') {
        return entries;
    }

    // query = new RegExp(query, 'i');

    return entries.filter(function (entry) {
        var take = false;
        for (var key in entry) {
            if ((take = (entry[key].toLowerCase().indexOf(query.toLowerCase()) !== -1))) {
                break;
            }
        }

        return take;
    });
}

function formatPhone(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($1) $2-$3-$4');
}

function formatEntries(entries) {
    return entries
        .sort(function (a, b) {
            return a.name.localeCompare(b.name);
        })
        .map(function (entry) {
            var formatted = [entry.name, formatPhone(entry.phone)];
            if (entry.email) {
                formatted.push(entry.email);
            }

            return formatted.join(', ');
        });
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.add = function (phone, name, email) {
    if (!isArgumentsValid(phone, name) || phone in phoneBook) {
        return false;
    }

    phoneBook[phone] = {
        phone: phone,
        name: name,
        email: email || ''
    };

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.update = function (phone, name, email) {
    if (!isArgumentsValid(phone, name) || !(phone in phoneBook)) {
        return false;
    }
    phoneBook[phone].name = name;
    phoneBook[phone].email = email || '';

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
exports.findAndRemove = function (query) {
    var entriesToRemove = getEntries(query);
    entriesToRemove.forEach(function (entry) {
        delete phoneBook[entry.phone];
    });

    return entriesToRemove.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {
    return formatEntries(getEntries(query));
};

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    return csv.split('\n')
        .filter(function (record) {
            var fields = record.split(';');
            if (fields.length > 3) {
                return false;
            }
            var name = fields[0];
            var phone = fields[1];
            var email = fields[2];

            return exports.add(phone, name, email) || exports.update(phone, name, email);
        })
        .length;
};
