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

function checkInput(phone, name, email) {
    return typeof phone === 'string' &&
           /^\d{10}$/.test(phone) &&
           typeof name === 'string' &&
           (email === undefined ||
            typeof email === 'string');
}

function formatPhone(phone) {
    return '+7 (' + phone.substring(0, 3) +
           ') ' + phone.substring(3, 6) +
           '-' + phone.substring(6, 8) +
           '-' + phone.substring(8, 10);
}

function getContactByPhone(phone) {
    return phoneBook.find(
        function (element) {
            return element.phone === phone;
        }
    );
}

function formatContact(contact) {
    var result = contact.name + ', ' + formatPhone(contact.phone);
    if (contact.email !== undefined) {
        result += ', ' + contact.email;
    }

    return result;
}

function isStringInContact(contact, string) {
    return contact.phone.indexOf(string) !== -1 ||
           contact.name.indexOf(string) !== -1 ||
           contact.email !== undefined &&
           contact.email.indexOf(string) !== -1;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.add = function (phone, name, email) {
    if (!checkInput(phone, name, email) ||
        getContactByPhone(phone) !== undefined) {
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
 */
exports.update = function (phone, name, email) {
    if (!checkInput(phone, name, email)) {
        return false;
    }

    var contact = getContactByPhone(phone);
    if (contact === undefined) {
        return false;
    }

    contact.name = name;
    contact.email = email;

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    if (query === '*' || query === '') {
        var result = phoneBook.length;
        phoneBook = [];

        return result;
    }
    if (typeof query !== 'string') {
        return 0;
    }

    var originalLength = phoneBook.length;
    phoneBook = phoneBook.filter(
        function (element) {
            return !isStringInContact(element, query);
        }
    );

    return originalLength - phoneBook.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    if (query === '*' || query === '') {
        return phoneBook.map(formatContact).sort();
    }
    if (typeof query !== 'string') {
        return [];
    }

    return phoneBook
        .filter(
            function (element) {
                return isStringInContact(element, query);
            }
        )
        .map(formatContact)
        .sort();
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

    return csv.split('\n').length;
};
