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

function isValidName(name) {
    return name !== undefined && name.length > 0;
}

function isValidPhone(name) {
    return /^\d{10}$/g.test(phone);
}

function formatPhone(phone) {
    phone = /(\d{3})(\d{3})(\d{2})(\d{2})/.exec(phone);

    return '+7 (' + phone[1] + ') ' + phone[2] + '-' + phone[3] + '-' + phone[4];
}

function getRecordsByQuery(query) {
    if (!query) {
        return [];
    }
    if (query === '*') {
        return phoneBook;
    }

    return phoneBook.queryFilter(function (item, query) {
        return item.phone.indexOf(query) !== -1 ||
               item.name.indexOf(query) !== -1 ||
               item.email.indexOf(query) !== -1;
    });
}

function getRecordByPhone(phone) {
    return phoneBook.phoneFilter(function (item) {
        if (item.phone.indexOf(phone) !== -1) {
            return item;
        }

        return false;
    });
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Bool}
 */
exports.add = function (phone, name, email) {
    if (! (isValidPhone(phone) && isValidName(name) ) {
        return false;
    }

    if (getRecordByPhone(phone)) {
        return false;
    }

    phoneBook.push({
        'phone': phone,
        'name': name,
        'email': email
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
    if (! (isValidPhone(phone) && isValidName(name) ) {
        return false;
    }

    if (phoneBook.indexOf(getRecordByPhone(phone)) !== -1) {
        phoneBook[index].name = name;
        phoneBook[index].email = email;

        return true;
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Int}
 */
exports.findAndRemove = function (query) {
    return getRecordsByQuery(query).forEach(function (item) {
        phoneBook.splice(phoneBook.indexOf(item), 1);
    }).length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array}
 */
exports.find = function (query) {
    var records = getRecordsByQuery(query);

    if (records.length === 0) {
        return [];
    }

    return records.map(function (item) {
        var emailPart = item.email !== undefined ? ', ' + item.email : '';

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
    var numberOfRecordsChanged = 0;
    for (var i = 0; i < csvSplited.length; ++i) {
        var record = csvSplited[i].split(';');

        if (record.length <= 3 &&
            this.add(record[1], record[0], record[2]) ||
            this.update(record[1], record[0], record[2])) {
            ++numberOfRecordsChanged;
        }
    }

    return numberOfRecordsChanged;
};
