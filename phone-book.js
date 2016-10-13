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

    return regPhone.test(phone) && phone.length === 10;
}

function isValidEmail(email) {
    var regEmail = /((\d|\w)+@\w+.\w{2,})/g;

    return regEmail.test(email) || email === undefined;
}

function isHaveNote(phone) {
    var haveNote = false;
    phoneBook.forEach(function (client) {
        if (client.phone.indexOf(phone) !== -1) {
            haveNote = true;
        }
    });

    return haveNote;
}

exports.add = function (phone, name, email) {
    if (isValidEmail(email) && isValidPhone(phone) &&
        !isHaveNote(phone) && name !== undefined) {
        phoneBook.push({
            name: name,
            phone: phone,
            email: email
        });

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
    var haveNote = false;
    phoneBook.forEach(function (client) {
        if (client.phone === phone) {
            client.name = name;
            if (email === undefined) {
                delete client.email;
            } else {
                client.email = email;
            }

            haveNote = true;
        }
    });

    return haveNote;
};

exports.findAndRemove = function (query) {
    var counter = 0;
    phoneBook.forEach(function (client) {
        for (var data in client) {
            if (client[data].indexOf(query) !== -1) {
                counter++;
                delete phoneBook[client];
                break;
            }
        }
    });

    return counter;
    // Ваша необьяснимая магия здесь
};

function parsePhone(phone) {
    return '+7 (' + phone.substring(0, 3) + ') ' +
            phone.substring(3, 6) + '-' + phone.substring(6, 8) + '-' +
            phone.substring(8, phone.length);
}

exports.find = function (query) {
    var newPhoneBook = [];
    phoneBook.forEach(function (client) {
        if (client.phone.indexOf(query) !== -1 || query === '*') {
            var str = client.name + ', ' + parsePhone(client.phone);
            if (client.email !== undefined) {
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
        exports.add(newClient[0], newClient[1], newClient[2]);
    });
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует


    return csv.split('\n').length;
};
