'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = false;

/**
 * Телефонная книга
 */
var phoneBook = {};

function _isUniqPhone(phone) {
    var phones = Object.keys(phoneBook);

    return (phones.indexOf(phone) === -1);
}

function _isValidPhone(phone) {
    return (/^\d{10}$/.test(phone));
}

function _isValidPhoneAndName(phone, name) {
    return (_isValidPhone(phone) && name);
}

function _reformatPhone(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($1) $2-$3-$4');
}

function _recordToString(key) {
    var rec = phoneBook[key];
    var arr = [rec.name, _reformatPhone(key)];

    if (rec.email) {
        arr.push(rec.email);
    }

    return arr.join(', ');
}

function _isIlike(str, query) {
    return (query !== '' && str && str.indexOf(query) !== -1);
}

function _isSuitableRecord(key, query) {
    return (_isIlike(key, query) ||
        _isIlike(phoneBook[key].name, query) ||
        _isIlike(phoneBook[key].email, query));
}

function _findSuitableKeys(query) {
    var keys = Object.keys(phoneBook);

    if (query !== '*') {
        keys = keys.filter(function (key) {
            return _isSuitableRecord(key, query);
        });
    }

    return keys;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.add = function (phone, name, email) {
    if (!(_isValidPhoneAndName(phone, name) && _isUniqPhone(phone))) {
        return false;
    }

    phoneBook[phone] = {
        name: name,
        email: email
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
    var record = phoneBook[phone];

    if (record && name) {
        record.name = name;
        record.email = email;

        return true;
    }

    return false;
};


/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {
    var filtered = _findSuitableKeys(query).map(function (key) {
        return _recordToString(key);
    });

    return filtered.sort();
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
exports.findAndRemove = function (query) {
    var keys = _findSuitableKeys(query);

    keys.forEach(function (key) {
        delete phoneBook[key];
    });

    return keys.length;
};

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
// exports.importFromCsv = function (csv) {
//     // Парсим csv
//     // Добавляем в телефонную книгу
//     // Либо обновляем, если запись с таким телефоном уже существует

//     return csv.split('\n').length;
// };
