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

/**
 * Добавление записи в телефонную книгу
 * @param {String} str
 * @returns {boolean}
 */
exports.isNotEmpty = function (str) {
    if ((typeof str === 'string') && str !== '') {

        return true;
    }
};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @returns {boolean}
 * @param {String} name
 * @returns {boolean}
 * @param {String} email
 * @returns {boolean}
 */
exports.add = function (phone, name, email) {
    var exist = function (phoneName) {
        if (phoneName.phone === phone || phoneName.name === name || phoneName.email === email) {

            return true;
        }
    };
    var regExPhone = /^\d{10}$/;
    if (phoneBook.some(exist)) {

        return false;
    }
    if (regExPhone.test(phone) && exports.isNotEmpty(name) && (email === undefined)) {
        phoneBook.push({ phone: phone, name: name });

        return true;
    }
    if (regExPhone.test(phone) && exports.isNotEmpty(name)) {
        phoneBook.push({ phone: phone, name: name, email: email });

        return true;
    }

    return false;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean}
 */
exports.update = function (phone, name, email) {
    if (exports.isNotEmpty(phone) && exports.isNotEmpty(name)) {
        phoneBook.forEach(function (contact) {
            if (contact.phone === phone) {
                contact.name = name;
                if (email !== undefined) {
                    contact.email = email;
                }
                if (email === undefined) {
                    delete contact.email;
                }
            }
        });

        return true;
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 *@returns {Number}
 */
exports.findAndRemove = function (query) {
    var newphoneBook = [];
    var deletedCount = 0;
    var phoneL = phoneBook.length;
    for (var i = 0; i < phoneL; i++) {
        phoneBook[i].email = phoneBook[i].email || '';
        if (query !== '*' && phoneBook[i].name.indexOf(query) === -1 &&
            phoneBook[i].phone.indexOf(query) === -1 &&
            phoneBook[i].email.indexOf(query) === -1) {
            newphoneBook.push(phoneBook[i]);
            deletedCount += 1;
        }
    }
    phoneBook = newphoneBook;

    return phoneL - deletedCount;
};

exports.changePhone = function (phone) {
    var newPhone = '+7 (' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) +
    '-' + phone.substring(6, 8) + '-' + phone.substring(8, 10);

    return newPhone;
};

exports.deletelast = function (str) {
    var a = str.length;
    if (str[a - 1] === ' ') {
        var str1 = str.slice(0, a - 2);

        return str1;
    }

    return str;
};


/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 *@returns {Array}
 */
exports.find = function (query) {
    var asc = function (field) { // функция для сортировки в прямом порядке (по возрастанию)
        return function (x, y) {
            return x[field] > y[field];
        };
    };
    var resultBook = [];
    phoneBook.sort(asc('name'));

    phoneBook.forEach(function (contact) {
        if (query === '*' || contact.name.indexOf(query) > -1 ||
            contact.phone.indexOf(query) > -1 || contact.email.indexOf(query) > -1) {
            var newphone = contact.phone;
            var newContact = contact.name + ', ' + exports.changePhone(newphone) +
            ', ' + (contact.email || '');
            var newContact1 = exports.deletelast(newContact);
            resultBook.push(newContact1);
        }
    });

    return resultBook;
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

    var records = csv.split('\n');
    var record;
    var countUpdate = 0;
    for (var i = 0; i < records.length; i++) {
        record = records[i].split(';');
        if (exports.update(record[1], record[0], record[2]) ||
        (exports.add(record[1], record[0], record[2]))) {
            countUpdate++;
        }
    }

    return countUpdate;
};
