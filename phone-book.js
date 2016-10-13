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


function isValidPhone(phone) {
    var regPhone = /\d{10}/g;

    return regPhone.test(phone);
}

function isValidEmail(email) {
    var regEmail = /((\d|\w)+@\w+.\w{2,})/g;

    return regEmail.test(email);
}

exports.add = function (phone, name, email) {
    if (isValidEmail(email) && isValidPhone(phone)) {
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
    phoneBook.forEach(function (client) {
        if (client.phone.indexOf(phone) !== -1) {
            client.name = name;
            if (email === undefined) {
                client.email = '';
            } else {
                client.email = email;
            }

            return true;
        }
    });

    return false;
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

function compareClients(client1, client2) {
    if (client1.name > client2.name) {
        return 1;
    }

    return -1;
}

exports.find = function (query) {
    phoneBook.forEach(function (client) {
        for (var data in client) {
            if (client[data].indexOf(query) !== -1 || query === '*') {
                console.info(client.name + ' ' + parsePhone(client.phone) + ' ' + client.email);
            }
        }
    });

    return phoneBook.sort(compareClients);
};

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    csv.forEach(function (client) {
        var newClient = client.split(';');
        exports.add(newClient[0], newClient[1], newClient[2]);
    });
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует

    return csv.split('\n').length;
};
