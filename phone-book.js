'use strict';

/**
 * Телефонная книга
 */

var phoneBook = {}; // Здесь вы храните записи как хотите
var phoneRegex = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;

function isValidStrings() {
    for (var _len = arguments.length, strings = Array(_len), _key = 0; _key < _len; _key++) {
        strings[_key] = arguments[_key];
    }

    return strings.every(function (s) {
        return typeof s === 'string' && s !== '';
    });
}

function isCorrectPhone(phone) {
    return phoneRegex.test(phone);
}

function getFormattedPhone(phone) {
    var phonePattern = phone.match(phoneRegex);

    return '+7 (' + phonePattern[1] + ') ' + phonePattern[2] + '-' + phonePattern[3] + '-' + phonePattern[4];
}

function isCorrectInput(phone, name, email) {
    return isValidStrings(name, phone) && isCorrectPhone(phone) && (email === undefined || isValidStrings(email));
}

function entryToKey(entry) {
    return entry.name + entry.phone + (entry.hasOwnProperty('email') ? entry.email : '');
}

function entryToString(entry) {
    return entry.name + ', ' + getFormattedPhone(entry.phone) + (entry.hasOwnProperty('email') ? ', ' + entry.email : '');
}

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {bool}
 */
exports.add = function (phone, name) {
    var email = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

    if (!isCorrectInput(phone, name, email) || exports.find(phone).length !== 0) {
        return false;
    }
    var entry = { name: name, phone: phone };
    if (email !== undefined) {
        entry.email = email;
    }
    phoneBook[entryToKey(entry)] = entry;

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {bool}
 */
exports.update = function (phone, name) {
    var email = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

    if (!isCorrectInput(phone, name, email)) {
        return false;
    }
    var keys = findKeys(phone);
    if (keys.length === 0) {
        return false;
    }
    keys.forEach(function (key) {
        var entry = phoneBook[key];
        Reflect.deleteProperty(phoneBook, key);
        entry.name = name;
        if (email === undefined) {
            Reflect.deleteProperty(entry, 'email');
        } else {
            entry.email = email;
        }
        phoneBook[entryToKey(entry)] = entry;
    });

    return true;
};

function normalizeQuery(query) {
    if (query === '*') {
        return '';
    }
    if (query === '') {
        return '\0';
    }

    return query;
}

function findKeys(query) {
    query = normalizeQuery(query);

    return Object.keys(phoneBook).filter(function (key) {
        return key.indexOf(query) !== -1;
    });
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Integer} Count of removed entries
 */
exports.findAndRemove = function (query) {
    var keys = findKeys(query);
    keys.forEach(function (key) {
        Reflect.deleteProperty(phoneBook, key);
    });

    return keys.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array<String>}
 */
exports.find = function (query) {
    return findKeys(query).map(function (key) {
        return phoneBook[key];
    }).sort(function (x, y) {
        return x.name.localeCompare(y.name);
    }).map(entryToString);
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
    return csv.split('\n').map(function (line) {
        var parts = line.split(';');
        if (parts.length !== 3 && parts.length !== 2) {
            return false;
        }
        return exports.add(parts[1], parts[0], parts[2]) || exports.update(parts[1], parts[0], parts[2]);
    }).reduce(function (acc, value) {
        return acc + value;
    }, 0);
};
