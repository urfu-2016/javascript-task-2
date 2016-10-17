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


function correctData(value) {
    return value !== undefined && (typeof value === 'string') && value !== '';

}

function correctNumber(phone) {
    var phoneReg = /^\d{10}$/;

    return phone !== undefined && phoneReg.test(phone);
}

function validEmail(email) {

    return (email !== undefined && correctData(email)) ? email : undefined;

}


function checkUnique(element) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (element === phoneBook[i].phone) {

            return false;
        }
    }

    return true;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Bool} – успех или не успех операции
 */
exports.add = function (phone, name, email) {
    if (correctNumber(phone) && correctData(name) && checkUnique(phone)) {
        if (email === undefined || correctData(email)) {
            phoneBook.push({
                phone: phone,
                name: name,
                email: validEmail(email)
            });

            return true;
        }
    }

    return false;
};

function traverseNoteAndFind(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {

            return phoneBook[i];
        }
    }

    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Bool} – успех или не успех операции
 */
exports.update = function (phone, name, email) {
    if (correctNumber(phone) && correctData(name) && correctData(email)) {
        var probableUpdate = traverseNoteAndFind(phone);
        if (probableUpdate !== false) {
            probableUpdate.name = name;
            probableUpdate.email = validEmail(email);

            return true;
        }

    }

    return false;

};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} – кол-во удалённых записей
 */
exports.findAndRemove = function (query) {
    var deleteCounter = 0;
    if (correctData(query)) {
        var refreshedBook = phoneBook.filter(function (element) {
            var realEmail = emailSugar(element.email);
            var lowQuery = query.toLowerCase();

            return (element.phone.indexOf(LowQuery) === -1 &&
                element.name.toLowerCase().indexOf(lowQuery) === -1 &&
                realEmail.toLowerCase().indexOf(lowQuery) === -1);

        });
        if (query === '*') {
            deleteCounter = phoneBook.length;
            phoneBook = [];
            return deleteCounter;

        }
    
        deleteCounter = phoneBook.length - refreshedBook.length;
        phoneBook = refreshedBook;
        
    }

    return deleteCounter;

};

function comfortFormat(phone) {
    return (
        '+7 (' + phone.slice(0, 3) +
        ') ' + phone.slice(3, 6) +
        '-' + phone.slice(6, 8) +
        '-' + phone.slice(8));
}

function emailSugar(email) {
    if (email === undefined) {

        return '';
    }

    return ', ' + email;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Number} – записи, удовлетворяющие условию
 */
exports.find = function (query) {
    if (correctData(query)) {

        return phoneBook.filter(function (element) {
            if (query === '*') {
                return element;
            }
            var lowQuery = query.toLowerCase();

            return element.phone.indexOf(lowQuery) >= 0 ||
             element.name.toLowerCase().indexOf(lowQuery) >= 0 ||
                (correctData(element.email) &&
                    element.email.toLowerCase().indexOf(lowQuery) >= 0);
        })
        .sort(function (first, second) {
            if (first.name.toLowerCase() < second.name.toLowerCase()) {

                return -1;
            }
            if (first.name.toLowerCase() > second.name.toLowerCase()) {

                return 1;
            }

            return 0;

        })
        .map(function (element) {
            var realEmail = emailSugar(element.email);

            return element.name + ', ' + comfortFormat(element.phone) + realEmail;
        });
    }

    return [];

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
