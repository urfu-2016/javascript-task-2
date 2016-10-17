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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} Возвращает true или false в зависимости от успеха операции
 */
exports.add = function (phone, name, email) {
    if (!validate(phone, name, email) || exists(phone)) {
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
 * @returns {Boolean} Возвращает true или false в зависимости от успеха операции
 */
exports.update = function (phone, name, email) {
    if (!validate(phone, name, email) || !exists(phone)) {
        return false;
    }

    phoneBook[phone] = {
        name: name,
        email: email
    };

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} Количество удалённых записей
 */
exports.findAndRemove = function (query) {
    var result = findItems(query);
    result.forEach(function (phone) {
        delete phoneBook[phone];
    });

    return result.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} Массив отформатированных найденных записей, отсортированный по имени
 */
exports.find = function (query) {
    return findItems(query)
        .sort(function (a, b) {
            return phoneBook[a].name.localeCompare(phoneBook[b].name);
        })
        .map(function (phone) {
            var item = phoneBook[phone];
            var result = item.name + ', ' + formatPhone(phone);
            if (item.email !== undefined && item.email !== '') {
                result += ', ' + item.email;
            }

            return result;
        });
};

function formatPhone(phone) {
    var match = phone.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match === null) {
        throw new TypeError(phone + ' is not a valid phone');
    }

    return '+7 (' + match[1] + ') ' + match[2] + '-' + match[3] + '-' + match[4];
}

function findItems(query) {
    if (query === '') {
        return [];
    }

    var result = [];
    Object.getOwnPropertyNames(phoneBook).forEach(function (phone) {
        var item = phoneBook[phone];
        if (query === '*' ||
                phone.indexOf(query) !== -1 || item.name.indexOf(query) !== -1 ||
                (item.email !== undefined && item.email.indexOf(query) !== -1)) {
            result.push(phone);
        }
    });

    return result;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    var total = 0;
    csv.split('\n').forEach(function (line) {
        var chunks = line.split(';');
        if (chunks.length > 3) {
            return;
        }

        var name = chunks[0];
        var phone = chunks[1];
        var email = chunks[2];
        if (exists(phone)) {
            total += exports.update(phone, name, email);
        } else {
            total += exports.add(phone, name, email);
        }
    });

    return total;
};

function validate(phone, name, email) {
    return typeof phone === 'string' && /^\d{10}$/.test(phone) &&
        typeof name === 'string' && name !== '' &&
        (email === undefined || (typeof email === 'string' &&
            /^[\w.+-]+@[\w.+-]+\.[\w.+-]+$/.test(email)));
}

function exists(phone) {
    return Object.prototype.hasOwnProperty.call(phoneBook, phone);
}
