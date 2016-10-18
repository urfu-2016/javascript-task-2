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
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.add = function (phone, name, email) {
    if (checkForm(phone, name, email) && !checkContactBusy(phone, name, email)) {
        phoneBook.push({ name: name, phone: phone ? phone : '', email: email ? email : '' });

        return true;
    }

    return false;

};
function checkContactBusy(phone, name, email) {
    var contactRequire = false;
    phoneBook.forEach(function (item) {
        if (item.phone.indexOf(phone) > -1 ||
            item.name.indexOf(name) > -1 ||
            item.email.indexOf(email) > -1) {
            contactRequire = true;
        }
    });

    return contactRequire;
}
function checkForm(phone, name, email) {
    return checkValidName(name) && checkValidPhone(phone) && checkValidMail(email);
}
function checkValidName(name) {
    return typeof name === 'string' && name.replace(/ /g, '').length > 0;
}
function checkValidPhone(phone) {
    if (!phone) {
        return true;
    }
    if (typeof phone === 'string') {
        var regexp = /[^0-9]/g;

        return phone.replace(regexp, '').length === 10;
    }

    return false;
}
function checkValidMail(email) {
    if (typeof email === 'undefined') {
        return true;
    }

    return typeof email === 'string' &&
        email.split('@').length === 2 &&
        email.split('@')[1].indexOf('.') !== -1;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.update = function (phone, name, email) {
    if (checkForm(phone, name, email)) {
        var indexUser = -1;
        phoneBook.forEach(function (item, index) {
            if (item.phone === phone) {
                indexUser = index;
            }
        });
        if (indexUser > -1) {
            var updateData = { name: name, phone: phone };
            updateData.email = email ? email : '';
            phoneBook.splice(indexUser, 1, updateData);

            return true;
        }

        return false;
    }

    return false;

};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Boolean}
 */
exports.findAndRemove = function (query) {
    if (checkValidquery(query)) {
        var count = phoneBook.length;
        phoneBook = phoneBook.filter(function (item) {
            return !checkHasUser(query, item);
        });

        return count - phoneBook.length;
    }

    return 0;

};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Boolean}
 */
exports.find = function (query) {
    if (checkValidquery(query)) {
        var listContacts = [];
        phoneBook.forEach(function (item) {
            if (checkHasUser(query, item)) {
                var contact = generateContact(item);
                listContacts.push(contact);
            }
        });
        listContacts.sort();

        return listContacts;
    }

    return false;
};

function checkValidquery(query) {
    return typeof query === 'string' && query.length > 0;
}
function getFormatPhone(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($1) $2-$3-$4');
}
function generateContact(user) {
    var contact = user.name;
    contact += user.phone ? ', ' + getFormatPhone(user.phone) : '';
    contact += user.email ? ', ' + user.email : '';

    return contact;
}
function checkHasUser(query, user) {
    var userHas = user.name.indexOf(query) > -1 ||
        user.phone.indexOf(query) > -1 ||
        user.email.indexOf(query) > -1;

    return query === '*' || userHas;
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
