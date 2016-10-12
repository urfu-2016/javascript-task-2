'use strict';

/*
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/*
 * Телефонная книга
 */
var phoneBook = [];

/*
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.add = function (phone, name, email) {
    if (!checkInputAdd(phone, name, email)) {
        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return false;
        }
    }
    var person = {
        name: name,
        phone: phone,
        email: email
    };
    phoneBook.push(person);

    return true;
};

function toCountChar(char, string) {
    if (typeof string === 'undefined') {
        return 1;
    }
    var countChar = 0;
    for (var i = 0; i < string.length; i++) {
        if (string[i] === char) {
            countChar++;
        }
    }

    return countChar;
}


function checkPhone(phone) {
    var regExp = /[^0-9]/;

    return phone.length === 10 && typeof phone === 'string' && !regExp.test(phone);
}

function checkName(name) {
    return typeof name === 'string' && name !== '';
}

function checkEmail(email) {
    return typeof email === 'string' && email !== '' || typeof email === 'undefined';
}

function checkInputAdd(phone, name, email) {
    if (!checkPhone(phone) || !checkName(name) || !checkEmail(email)) {
        return false;
    }

    return true;
}

/*
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function (phone, name, email) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (toUpdateSingleContact(phoneBook[i], phone, name, email)) {

            return true;
        }
    }

    return false;
};

function toUpdateSingleContact(person, phone, name, email) {
    if (person.phone === phone && checkInputAdd(phone, name, email)) {
        person.email = email;
        person.name = name;

        return true;
    }

    return false;
}

/*
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var countDelete = 0;
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone.indexOf(query) !== -1 ||
            phoneBook[i].name.indexOf(query) !== -1 ||
            (phoneBook[i].email && phoneBook[i].email.indexOf(query) !== -1) ||
            query === '*') {
            countDelete++;
            phoneBook.splice(i, 1);
            i--;
        }
    }

    return countDelete;
};

/*
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    var result = [];
    if (!query) {
        return [];
    }
    for (var i = 0; i < phoneBook.length; i++) {
        result = toFindSingleContact(phoneBook[i], query, result);
    }

    return result.sort(
        function (a, b) {
            if (a < b) {
                return -1;
            }

            return 1;
        }
    );
};

function toFindSingleContact(person, query, result) {
    if ((typeof person.email !== 'undefined' &&
        person.email.indexOf(query)) !== -1 ||
        person.phone.indexOf(query) !== -1 ||
        person.name.indexOf(query) !== -1 ||
        query === '*') {
        var phone = '+7 (' + person.phone.slice(0, 3) + ') ' +
        person.phone.slice(3, 6) + '-' + person.phone.slice(6, 8) + '-' +
        person.phone.slice(8, 10);
        result.push(person.name + ', ' + phone);
        if (person.email) {
            result[result.length - 1] += ', ' + person.email;
        }
    }

    return result;
}

/*
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    // Парсим csv
    csv = csv.split('\n');
    var countAdd = 0;
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    for (var i = 0; i < csv.length; i++) {
        if (toCountChar(';', csv[i]) > 0 && exports.add(csv[i].split(';')[1],
            csv[i].split(';')[0], csv[i].split(';')[2])) {
            countAdd++;
        } else if (toCountChar(';', csv[i]) > 0 && exports.update(csv[i].split(';')[1],
            csv[i].split(';')[0], csv[i].split(';')[2])) {
            countAdd++;
        }
    }

    return countAdd;
};
