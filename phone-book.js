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

function isPhoneValid(phone) {
    return /\d{10}/.test(phone);
}

function getEntriesIds(query) {
    return phoneBook.reduce(function (pre, entry, idx) {
        for (var key in entry) {
            if (entry[key] && entry[key].indexOf(query) !== -1) {
                pre.push(idx);
            }
        }

        return pre;
    }, []);
}

function getEntriesById(ids) {
    return phoneBook.filter(function (entry, idx) {
        return idx in ids;
    });
}

function formatPhone(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($1) $2-$3-$4');
}

function formatEntries(ids) {
    return getEntriesById(ids)
        .map(function (entry) {
            var formatted = [entry.name, formatPhone(entry.phone)];
            if (entry.email) {
                formatted.push(entry.email);
            }

            return formatted.join(', ');
        })
        .sort();
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.add = function (phone, name, email) {
    if (!isPhoneValid(phone) || !name) {
        return false;
    }

    var entryAlreadyExists = phoneBook.some(function (entry) {
        return entry.phone === phone;
    });
    if (entryAlreadyExists) {
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
 * @returns {Boolean}
 */
exports.update = function (phone, name, email) {
    var ids = getEntriesIds(phone);
    if (ids.length === 0 || !isPhoneValid(phone)) {
        return false;
    }

    ids.forEach(function (id) {
        phoneBook[id].name = name;
        phoneBook[id].email = email ? email : undefined;
    });

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
exports.findAndRemove = function (query) {
    var toRemove = getEntriesIds(query);

    toRemove.forEach(function (id) {
        delete phoneBook[id];
    });

    return toRemove.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {
    if (query === '') {
        return;
    }
    if (query === '*') {
        return formatEntries(phoneBook);
    }

    var ids = getEntriesIds(query);

    return formatEntries(getEntriesById(ids));
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
    var processed = 0;
    csv.split('\n').forEach(function (record) {
        var fields = record.split(';');
        var name = fields[0];
        var phone = fields[1];
        var email = fields[2];

        var isSuccessful = false;
        var id = getEntriesIds(phone);
        if (id.length === 0) {
            isSuccessful = exports.add(phone, name, email);
        } else {
            isSuccessful = exports.update(phone, name, email);
        }
        if (isSuccessful) {
            processed++;
        }
    });


    return processed;
};
