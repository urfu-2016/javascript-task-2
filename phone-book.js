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
 * @returns {Boolean} удалось добавить запись или нет
 */
exports.add = function (phone, name, email) {
    if (isNotCorrectPhone(phone) || isNotCorrectName(name)) {
        return false;
    }
    var isExistPhone = false;
    for (var i = 0; i < phoneBook.length; ++i) {
        if (phoneBook[i].phone === phone) {
            return false;
        }
    }
    if (!isExistPhone) {
        phoneBook.push(
            {
                phone: phone,
                name: name,
                email: email
            }
        );
    }

    return !isExistPhone;
};

function isNotCorrectName(name) {
    return name === undefined || name === '' || name === null;
}
function isNotCorrectPhone(phone) {
    return (phone === undefined || phone === null || phone.search(/\d{10}/) < 0 ||
        phone.length !== 10);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} удалось обновить запись или нет
 */
exports.update = function (phone, name, email) {
    if (isNotCorrectPhone(phone) || isNotCorrectName(name)) {
        return false;
    }

    for (var j = 0; j < phoneBook.length; ++j) {
        if (phoneBook[j].phone === phone) {
          //  changeNote(phoneBook[j], name, email);
            phoneBook[j].name = name;
            phoneBook[j].email = email;

            return true;
        }
    }

    return false;
};


/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} число удаленных записей
 */
exports.findAndRemove = function (query) {
    if (query === undefined || query === '') {
        return 0;
    }
    var countOfDelete = 0;
    var k = 0;
    while (k < phoneBook.length) {
        if (isFoundNote(phoneBook[k], query)) {
            phoneBook.splice(k, 1);
            countOfDelete ++;
        } else {
            k++;
        }
    }

    return countOfDelete;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} result of search
 */
exports.find = function (query) {
    if (query === undefined || query === '') {
        return [];
    }
    var findResult = [];
    for (var k = 0; k < phoneBook.length; ++k) {
        if (isFoundNote(phoneBook[k], query)) {
            findResult.push(phoneBook[k].name + ', ' + getFormatPhone(phoneBook[k].phone) +
                ((phoneBook[k].email !== undefined) ? ', ' + phoneBook[k].email : ''));
        }
    }

    return findResult.sort();
};

function isFoundNote(note, query) {
    return query === '*' || note.phone.indexOf(query) > -1 || note.name.indexOf(query) > -1 ||
        note.email !== undefined && note.email.indexOf(query) > -1;
}

function getFormatPhone(phone) {
    return '+7 (' + phone.substr(0, 3) + ') ' +
    phone.substr(3, 3) + '-' + phone.substr(6, 2) + '-' +
    phone.substr(8, 2);
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
    var csvLines = csv.split('\n');
    var csvPartsOfData = [];
    var countOfAddStrings = 0;
    for (var m = 0; m < csvLines.length; m++) {
        csvPartsOfData = csvLines[m].split(';');

        if (exports.add(csvPartsOfData[1], csvPartsOfData[0], csvPartsOfData[2]) ||
            exports.update(csvPartsOfData[1], csvPartsOfData[0], csvPartsOfData[2])) {
            countOfAddStrings++;
        }
    }

    return countOfAddStrings;
};


