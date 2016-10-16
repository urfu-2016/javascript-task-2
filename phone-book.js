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
exports.add = add;

function add(phone, name, email) {
    var row = { phone: phone, name: name, email: email };
    if (!isAddingPossible(row)) {
        return false;
    }
    phoneBook[row.phone] = { name: name, email: email };

    return true;
}

function isAddingPossible(row) {
    return !isRowAlreadyExists(row) && isInputCorrect(row);
}

function isInputCorrect(row) {
    var isPhoneFormatCorrect = /^\d{10}$/.test(row.phone);
    var isNameCorrect = typeof row.name === 'string' && row.name.trim() !== '';
    var isEmailCorrect = row.email === undefined || typeof row.email === 'string';

    return isPhoneFormatCorrect && isNameCorrect && isEmailCorrect;
}

function isRowAlreadyExists(row) {
    return phoneBook[row.phone] !== undefined;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean} - Обновилась ли запись
 */
exports.update = update;

function update(phone, name, email) {
    var row = { phone: phone, name: name, email: email };
    if (!isUpdatingPossible(row)) {
        return false;
    }
    phoneBook[row.phone].name = name;
    phoneBook[row.phone].email = email;

    return true;
}

function isUpdatingPossible(row) {
    return isRowAlreadyExists(row) && isInputCorrect(row);
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} - число удалённых строк
 */
exports.findAndRemove = function (query) {
    var phones = findRowsByQuery(query);
    var rowsDeleted = 0;
    for (var phone in phones) {
        if (phones.hasOwnProperty(phone)) {
            delete phoneBook[phone];
            rowsDeleted++;
        }
    }

    return rowsDeleted;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} - все записи, содержащие query в одном из полей
 */
exports.find = function (query) {
    var result = [];
    var phones = query === '*' ? getAllKeys(phoneBook) : findRowsByQuery(query);
    for (var i = 0; i < phones.length; i++) {
        var currentRow = phoneBook[phones[i]];
        var email = currentRow.email === undefined ? '' : ', ' + currentRow.email;
        result.push(currentRow.name + ', ' + formatPhone(phones[i]) + email);
    }

    return result.sort();
};

function getAllKeys(obj) {
    var result = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            result.push(key);
        }
    }

    return result;
}

function findRowsByQuery(query) {
    if (typeof query !== 'string' || query === '') {
        return [];
    }
    var result = [];
    for (var phone in phoneBook) {
        if (phoneBook.hasOwnProperty(phone)) {
            var row = { phone: phone, name: phoneBook[phone].name, email: phoneBook[phone].email };
            addIfRowContainsQuery(row, query, result);
        }
    }

    return result;
}

function addIfRowContainsQuery(row, query, container) {
    var isPhoneContainsQuery = row.phone.indexOf(query) !== -1;
    var isNameContainsQuery = row.name.indexOf(query) !== -1;
    var isEmailContainsQuery = false;
    if (row.email !== undefined) {
        isEmailContainsQuery = row.email.indexOf(query) !== -1;
    }
    if (isPhoneContainsQuery || isEmailContainsQuery || isNameContainsQuery) {
        container.push(row.phone);
    }
}

function formatPhone(phone) {
    return '+7 (' + (phone.substring(0, 3) + ') ' + phone.substring(3, 6) +
        '-' + phone.substring(6, 8) + '-' + phone.substring(8, 10));
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
    if (typeof csv !== 'string') {
        return 0;
    }
    var rows = csv.split('\n').filter(notEmpty);
    var n = 0;
    for (var i = 0; i < rows.length; i++) {
        if (processString(splitCSVString(rows[i]))) {
            n++;
        }
    }

    return n;
};

function splitCSVString(str) {
    var re = /;\d{10};|;\d{10}$/;
    var match = re.exec(str);
    if (!match) {
        return {};
    }
    var row = {};
    row.name = str.substring(0, match.index);
    row.phone = str.substring(match.index + 1, match.index + 11);
    row.email = str.substring(match.index + 12);

    return row;
}

function notEmpty(x) {
    if (x) {
        return true;
    }
}

function processString(row) {
    if (add(row.phone, row.name, row.email)) {
        return true;
    }

    return update(row.phone, row.name, row.email);
}
