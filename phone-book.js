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

function isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
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
    return '+7 (' + phone.slice(0, 3) +') ' +
           phone.slice(3, 3) + '-' + phone.slice(6, 2) + '-' + phone.slice(8, 2);
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.add = function (phone, name, email) {
    if (!isValidPhone(phone)) {
        return false;
    }
    if (getRecordByPhone(phone).length !== 0) {
        return false;
    }

    phoneBook.push({
        "phone": phone,
        "name": name,
        "email": email
    })

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function (phone, name, email) {
    if (!isValidPhone(phone) || !name) {
        return false;
    }

    var record = getRecordByPhone(phone);

    if (record) {
        phoneBook[phoneBook.indexOf(records[0])] = {
            "phone": phone,
            "name": name,
            "email": email
        }
    }
    else {
        return false;
    }
    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var records = getRecords(query);

    records.forEach(function (item) {
        phoneBook.splice(phoneBook.indexOf(item), 1);
    });

    return records.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    var records = getRecords(query);

    return records.map(function (item) {
        return item.name + ', ' + formatPhone(item.phone) + ', ' + item.email
    });

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
    var csvSplited = csv.split('\n');
    var recordsChanged = 0;
    for (var i = 0; i < csvSplited.length; ++i) {
        var record = csvSplited[i].split(';');
        if (this.add(record[1], record[0], record[2]) ||
            this.update(record[1], record[0], record[2])) {
            ++recordsChanged;
        }
    }

    return recordsChanged;
};
