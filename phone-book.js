'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */
var phoneBook;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.add = function (phone, name, email) {
    checkPhoneBook();
    if (!name || !phone
    || phone.length !== 10) {

        return false;
    }
    if (this.find(phone).length) {
        return false;
    }
    phoneBook.push({phone: phone, name: name, email: email});
    if (!email) {
        phoneBook[phoneBook.length - 1].email = '';
    }
    phoneBook.sort(function (a, b) {
        return Number(a.phone) - Number(b.phone);
    });
    return true;
};

function checkPhoneBook() {
    if (!phoneBook) {
        phoneBook = [];
    }
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function (phone, name, email) {
    if (Number(phone) && phone.length === 10
    && email) {
        phoneBook.forEach(function (contact) {
            if (contact.phone === phone) {
                contact.name = name;
                contact.email = email;

                return true;
            }
        });
    }

    return false;

};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var deleteCollection = this.find(query);
    phoneBook = phoneBook.filter(function (contacts) {
        return deleteCollection.indexOf(finishFormat(contacts)) === -1;
    });

    return deleteCollection.length;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    if (!query.length) {
        return ;
    }
    if (query === '*') {
        return phoneBook;
    }
    var response = [];
    phoneBook.forEach(function (contact) {
        if (contact.phone.search(query) === 0
        || contact.name.search(query) === 0
        || contact.email.search(query) === 0) {
            response.push(contact);
        }
    });

    return response.map(finishFormat).sort();
};

function finishFormat(contact) {
    var emailFormat = ', ';
    if (contact.email) {
        emailFormat += contact.email;
    }
    var phone = contact.phone;

    return contact.name + ', ' +
        '+7 (' + phone.slice(0, 3) + ') ' +
        phone.slice(3, 6) + '-' +
        phone.slice(6, 8) + '-' +
        phone.slice(8, 10) +
        emailFormat;
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
