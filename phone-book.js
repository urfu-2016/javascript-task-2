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
    var phoneReg = /^[0-9]{10}$/;
    return phone !== undefined && (phone.search(phoneReg) !== -1);
}

function checkUnique(element) {
    for ( var i = 0; i < phoneBook.length; i++ ) {
        if (element === phoneBook[i].phone)
            return false;
    }
        
    return true;
}
/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */

exports.add = function(phone, name, email) {
    if (correctNumber(phone) && correctData(name) && checkUnique(phone)) {
        if (email === undefined || correctData(email)) {
            phoneBook.push({
                phone: phone,
                name: name,
                email: email
            });
            
            return true;
        }
    }

    return false;
}


/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function(phone, name, email) {
    if (correctNumber(phone) && correctData(name)) {
        for (var i = 0; i < phoneBook.length; i++)
            if (phoneBook[i].phone === phone) {
                phoneBook[i].name = name;
                phoneBook[i].email = email;
                
                return true;
            }

    }

    return false;

};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function(query) {
    var deleteCounter = 0;
    if (correctData(query)) {
        var refreshedBook = phoneBook.filter(function(element) {
            if (query === '*')
                return [];
            var realEmail = emailSugar(element.email);
            return (element.phone.indexOf(query) === -1 && 
                element.name.indexOf(query) === -1 && 
                realEmail.indexOf(query) === -1);
        })

        deleteCounter = phoneBook.length - refreshedBook.length;
        phoneBook = refreshedBook;
    }

    return deleteCounter;

};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
function comfortFormat(phone) {
    return (
        '+7 (' + phone.slice(0, 3) +
        ') ' + phone.slice(3, 6) +
        '-' + phone.slice(6, 8) +
        '-' + phone.slice(8));
}

function emailSugar(email) {
    if (email === undefined)
        return '';
    return ', ' + email;
}

exports.find = function(query) {
    if (correctData(query)) {
        return phoneBook.filter(function(element) {
            if (query === "*") {
                return element;
            }
            return element.phone.indexOf(query) >= 0 || element.name.indexOf(query) >= 0 ||
                (correctData(element.email) && element.email.indexOf(query) >= 0)
        }).sort(function(first, second) {
            return first.name > second.name;
        }).map(function(element) {
            var realEmail = emailSugar(element.email);
            return element.name + ', ' + comfortFormat(element.phone) + realEmail;
        })
    }
    return '';

};

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function(csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует

    return csv.split('\n').length;
};
