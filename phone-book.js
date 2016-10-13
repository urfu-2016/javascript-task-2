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

function isValidInput(phone, name) {
    return /^\d{10}$/g.test(phone) && name !== undefined && name.length > 0;
}


function getRecordsByQuery(query) {
    if (query === '') {
        return [];
    }
    if (query === '*') {
        return phoneBook;
    }

    query = query.toLowerCase();

    return phoneBook.filter(function (item) {
        return item.phone.indexOf(query) !== -1 ||
               item.name.toLowerCase().indexOf(query) !== -1 ||
               item.email.toLowerCase().indexOf(query) !== -1;
    });
}

function getRecordByPhone(phone) {
    var record;
    for (var i = 0; i < phoneBook.length; ++i) {
        if (phoneBook[i].phone === phone) {
            record = phoneBook[i];
            break;
        }
    }

    return record;
}

function formatPhone(phone) {
    phone = /(\d{3})(\d{3})(\d{2})(\d{2})/.exec(phone);

    return '+7 (' + phone[1] + ') ' + phone[2] + '-' + phone[3] + '-' + phone[4];
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Bool}
 */
exports.add = function (phone, name, email) {
    if (!isValidInput(phone, name)) {
        return false;
    }
    if (getRecordByPhone(phone)) {
        return false;
    }

    phoneBook.push({
        'phone': phone,
        'name': name,
        'email': email ? email : ''
    });

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Bool}
 */
exports.update = function (phone, name, email) {
    if (!isValidInput(phone, name)) {
        return false;
    }

    var record = getRecordByPhone(phone);

    if (record) {
        phoneBook[phoneBook.indexOf(record)] = {
            'phone': phone,
            'name': name,
            'email': email ? email : ''
        };
    } else {
        return false;
    }

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Int}
 */
exports.findAndRemove = function (query) {
    var records = getRecordsByQuery(query);

    records.forEach(function (item) {
        phoneBook.splice(phoneBook.indexOf(item), 1);
    });

    return records.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {
    var records = getRecordsByQuery(query);

    return records.map(function (item) {
        var emailPart = item.email ? ', ' + item.email : '';

        return item.name + ', ' + formatPhone(item.phone) + emailPart;
    }).sort();

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
    var csvSplited = csv ? csv.split('\n') : '';
    var recordsChanged = 0;
    for (var i = 0; i < csvSplited.length; ++i) {
        var record = csvSplited[i].split(';');

        if (record.length > 3) {
            continue;
        }

        if (this.add(record[1], record[0], record[2]) ||
            this.update(record[1], record[0], record[2])) {
            ++recordsChanged;
        }
    }

    return recordsChanged;
};
