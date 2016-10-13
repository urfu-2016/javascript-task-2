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
    var regPhone = /\d{10}/g;

    return phone !== undefined && regPhone.test(phone) && phone.length === 10;
}


function isHaveNote(phone) {
    var haveNote = false;
    phoneBook.forEach(function (client) {
        if (client.phone === phone) {
            haveNote = true;
        }
    });

    return haveNote;
}

function isValidName(name) {

    return name !== undefined && name.length !== 0;
}
exports.add = function (phone, name, email) {
    if (!isValidPhone(phone) || isHaveNote(phone) || !isValidName(name)) {
        return false;
    }

    if (email !== undefined) {
        phoneBook.push({
            name: name,
            phone: phone,
            email: email
        });
    } else {
        phoneBook.push({
            name: name,
            phone: phone
        });
    }

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */

function createClient(phone, name, email) {
    if (email !== undefined) {

        return { name: name, phone: phone, email: email };
    }

    return { name: name, phone: phone };
}


exports.update = function (phone, name, email) {
    if (!isValidPhone(phone) || !isValidName(name)) {

        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            phoneBook[i] = createClient(phone, name, email);

            return true;
        }
    }

    return false;
};

function isEqualsNotes(i, query) {
    if (phoneBook[i].hasOwnProperty('email')) {
        return (phoneBook[i].phone.indexOf(query) !== -1 ||
        phoneBook[i].email.indexOf(query) !== -1 ||
        phoneBook[i].name.indexOf(query) !== -1);
    }

    return (phoneBook[i].phone.indexOf(query) !== -1 ||
    phoneBook[i].name.indexOf(query) !== -1);
}

exports.findAndRemove = function (query) {
    if (!query || query.length === 0) {

        return 0;
    }
    var counter = 0;
    for (var i = 0; i < phoneBook.length; i++) {
        if (isEqualsNotes(i, query)) {
            counter++;
            delete phoneBook[i];
        }

    }

    return counter;
    // Ваша необьяснимая магия здесь
};

function parsePhone(phone) {
    return '+7 (' + phone.substring(0, 3) + ') ' +
        phone.substring(3, 6) + '-' + phone.substring(6, 8) + '-' +
        phone.substring(8, phone.length);
}

exports.find = function (query) {
    if (!query || query.length === 0) {

        return [];
    }
    var newPhoneBook = [];
    phoneBook.forEach(function (client) {
        if (client.phone.indexOf(query) !== -1 || query === '*') {
            var str = client.name + ', ' + parsePhone(client.phone);
            if (client.hasOwnProperty('email')) {
                str += ', ' + client.email;
            }
            newPhoneBook.push(str);
        }

    });

    return newPhoneBook.sort();
};

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */


exports.importFromCsv = function (csv) {
    var clients = csv.split('\n');
    clients.forEach(function (client) {
        var newClient = client.split(';');
        if (newClient.length < 4) {
            exports.add(newClient[0], newClient[1], newClient[2]);
        }
    });
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует


    return phoneBook.length;
};
