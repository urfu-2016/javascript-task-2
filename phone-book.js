'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = false;


/**
 * Телефонная книга
 */
var phoneBook = [];


function isNonEmptyString(value) {
    return typeof value === 'string' && value !== '';
}


/**
 * Являются ли переданные значения корректными
 * для добавления в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} - корректны ли значения
 */
function areValuesValid(phone, name, email) {
    if (!isNonEmptyString(phone) || !/^\d{10}$/.test(phone)) {
        return false;
    }

    if (!isNonEmptyString(name)) {
        return false;
    }

    if (!isNonEmptyString(email) && typeof email !== 'undefined') {
        return false;
    }

    return true;
}


/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} - завершилась ли операция успешно
 */
exports.add = function (phone, name, email) {
    if (!areValuesValid(phone, name, email)) {
        return false;
    }

    if (phoneBook.hasOwnProperty(phone)) {
        return false;
    }

    phoneBook[phone] = [name, email];

    return true;
};


/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} - завершилась ли операция успешно
 */
exports.update = function (phone, name, email) {
    if (!areValuesValid(phone, name, email)) {
        return false;
    }

    if (!phoneBook.hasOwnProperty(phone)) {
        return false;
    }

    phoneBook[phone] = [name, email];

    return true;
};


/**
 * Вернуть все телефоны, записи о которых подпадают под запрос
 * @param {String} query
 * @returns {Array} - массив телефонов, подходящих под запрос
 */
function findPhones(query) {
    if (query === '') {
        return [];
    }

    var results = [];
    Object.keys(phoneBook).forEach(function (phone) {
        var name = phoneBook[phone][0];
        var email = phoneBook[phone][1];
        if (query === '*' ||
            phone.indexOf(query) !== -1 ||
            name.indexOf(query) !== -1 ||
            email !== undefined && email.indexOf(query) !== -1) {
            results.push(phone);
        }
    });

    return results;
}


/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} - сколько записей было удалено
 */
exports.findAndRemove = function (query) {
    var phonesToRemove = findPhones(query);
    var newPhoneBook = [];
    Object.keys(phoneBook).forEach(function (phone) {
        if (phonesToRemove.indexOf(phone) !== -1) {
            newPhoneBook[phone] = phoneBook[phone];
        }
    });
    phoneBook = newPhoneBook;

    return phonesToRemove.length;
};


/**
 * Оторматировать телефон для вывода
 * @param {String} phone
 * @returns {String} - отформатированный телефон
 */
function formatPhone(phone) {
    return (
        '+7 (' + phone.slice(0, 3) +
        ') ' + phone.slice(3, 6) +
        '-' + phone.slice(6, 8) +
        '-' + phone.slice(8));
}


/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} - список строк, содержащих информацию об искомых записях
 */
exports.find = function (query) {
    var phonesToReturn = findPhones(query);

    var results = [];
    phonesToReturn.forEach(function (phone) {
        var name = phoneBook[phone][0];
        var email = phoneBook[phone][1];
        var result = [name, formatPhone(phone)];
        if (email !== undefined) {
            result.push(email);
        }
        results.push(result);
    });
    results.sort(function (a, b) {
        return a[0].localeCompare(b[0]);
    });
    Object.keys(results).forEach(function (key) {
        results[key] = results[key].join(', ');
    });

    return results;
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
    if (typeof csv !== 'string') {
        return 0;
    }

    var successfulWrites = 0;
    var rows = csv.split('\n');
    rows.forEach(function (row) {
        var values = row.split(';');
        if (values.length !== 2 && values.length !== 3) {
            return;
        }
        var name = values[0];
        var phone = values[1];
        var email = values[2];

        if (!exports.add(phone, name, email) && !exports.update(phone, name, email)) {
            return;
        }
        successfulWrites++;
    });

    return successfulWrites;
};
