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
 * @returns {boolean} - Добавилась ли запись
 */
exports.add = function (phone, name, email) {
    var row = { phone: phone, name: name, email: email };
    if (!isAddingPossible(row)) {
        return false;
    }
    phoneBook[row.phone] = { name: name, email: email };

    return true;
};

function isAddingPossible(row) {
    return isInputCorrect(row) && !isRowAlreadyExists(row);
}

function isInputCorrect(row) {
    return true;
}

function isRowAlreadyExists(row) {
    return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean} - Обновилась ли запись
 */
exports.update = function (phone, name, email) {
    var row = { phone: phone, name: name, email: email };
    if (!isUpdatingPossible(row)) {
        return false;
    }
    phoneBook[row.phone].name = name;
    phoneBook[row.phone].email = email;

    return true;
};

function isUpdatingPossible(row) {
    return isInputCorrect(row) && isRowAlreadyExists(row);
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var phones = findRowsByQuery(query);
    var rowsDeleted = 0;
    for (var phone in phones) {
        if (phoneBook.hasOwnProperty(phone)) {
            delete phoneBook[phone];
        } else {
            throw new Error('Ошибка при составлении списка телефонов для удаления');
        }
        rowsDeleted++;
    }

    return rowsDeleted;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    var result = [];
    var phones = findRowsByQuery(query);
    for (var phone in phones) {
        result.push(phone.name + ', ' + formatPhone(phone) + ', ' + phone.email);
    }
};

function findRowsByQuery(query) {
    var result = [];
    return result;
}

function formatPhone(phone) {
    return '+7 (' + (phone.substring(0, 3) + ') ' + phone.substring(3));
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

    return csv.split('\n').length;
};
