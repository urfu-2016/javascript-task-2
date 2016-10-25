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

/*var phoneBook = {
 phone: {
 name: 'gg',
 email: 'ggl'
 }
 };*/

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.add = function (phone, name, email) {

//    var keys = Object.keys(phoneBook);
    if (phoneBook.hasOwnProperty(phone)) {
        return false;
    }

    if (isPhoneValid(phone) && isNameValid(name) && isEmailValid(email)) {

        phoneBook[phone] = {};
        phoneBook[phone].name = name;
        phoneBook[phone].email = email;

        /*
         console.info(phone);
         console.info(phoneBook[phone].name);
         console.info(phoneBook[phone].email);
         */

        return true;
    }


    return false;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function (phone, name, email) {

    if (phoneBook.hasOwnProperty(phone) && isNameValid(name) && isEmailValid(email)) {
        phoneBook[phone].name = name;
        phoneBook[phone].email = email;
        return true;
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {

    var countRemovedRecotds = 0;

    if (phoneBook.hasOwnProperty(query)) {
        delete phoneBook[query];
        countRemovedRecotds++;
    }

    return countRemovedRecotds;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {

    //  var arr = [][];
    //  query1111111.search(query);

    //  return arr;

}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {

    // Парсим csv
    var recordStrings = [];
    recordStrings = csv.split('\n');
    var parts = [];

    recordStrings.forEach(parts = recordStrings.split(';'));

    for (var i = 0; i < recordStrings.length; i++) {
        //
    }


    if (!isRecordExists()) {
        // Добавляем в телефонную книгу
        add(phone, name, email);
    } else {
        // Либо обновляем, если запись с таким телефоном уже существует
        update(phone, name, email);
    }

    return csv.split('\n').length;
};


function isRecordValid() {

    if (isPhoneValid && isNameValid && isEmailValid) {
        return true;
    }


    return true;
}

// Валидация поля phone
function isPhoneValid(phone) {

    var mask = /^\d{10}$/;
    if (mask.test(phone)) {
        return true;
    }

    return false;
}

// Валидация поля name
function isNameValid(name) {

    if (name !== undefined && name !== '' && name !== null) {
        return true;
    }

    return false;
}

// Валидация поля email
function isEmailValid(email) {

    var mask = /.+@.+\..+/i;
    if (email = '' || email === undefined || mask.test(email)) {
        return true;
    }

    return false;
}

function formatPhoneNumber(phone) {
    var phoneNumber = '+7' + '{' + phone.slice(1, 3) + ')' + phone.slice(4, 6) + '-' + phone.slice(7, 8) + '-' + phone.slice(9, 10);
}


