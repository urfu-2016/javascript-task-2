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


function valueOfKey(key) {
    var onePhone = [];
    phoneBook.forEach(function takePhones(point) {
        onePhone.push(point[key]);
    });

    return onePhone;
}

function phoneNotCorrect(phone) {
    return (phone.match(/^\d+$/) === null || phone.length !== 10 || isNaN(Number(phone)));
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.add = function (phone, name, email) {
    if (typeof name !== 'string' || name === '') {
        return false;
    }

    if (phoneNotCorrect(phone)) {
        return false;
    }

    if (valueOfKey('phone').indexOf(phone) === -1) {
        phoneBook.push({ 'phone': phone, 'name': name, 'email': email });

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
    if (typeof name !== 'string' || name === '') {
        return false;
    }
    if (phoneNotCorrect(phone)) {
        return false;
    }

    var index = valueOfKey('phone').indexOf(phone);

    if (index !== -1) {
        phoneBook[index].name = name;
        phoneBook[index].email = email;

        return true;
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var otherIndex = findIndexs(query);
    var temporaryPhoneBook = [];
    phoneBook.forEach(function remove(point, indexNumber) {
        if (otherIndex.indexOf(indexNumber) === -1) {
            temporaryPhoneBook.push(point);
        }
    });
    phoneBook = temporaryPhoneBook;

    return otherIndex.length;
};

function correctFormatPhone(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) +
        '-' + phone.slice(6, 8) + '-' + phone.slice(8, 10);
}
function createFindBook(indexes) {
    var newBook = [];
    var str = '';
    phoneBook.forEach(function choice(point, indexNumber) {
        if (indexes.indexOf(indexNumber) !== -1) {
            var email = phoneBook[indexNumber].email;
            email = typeof email === 'undefined' ? '' : ', ' + email;
            str = phoneBook[indexNumber].name + ', ' +
                correctFormatPhone(phoneBook[indexNumber].phone) + email;
            newBook.push(str);
        }
    });

            return newBook;
            }

function findIndexs(query) {

    if (query === '' || typeof query !== 'string') {
        return [];
    }

    var otherIndex = [];

    if (query === '*') {
        phoneBook.forEach(function generateInd(point, indexNumber) {
            otherIndex.push(indexNumber);
        });
    } else {
        phoneBook.forEach(function findInd(point, indexNumber) {
            var situation = point.phone.indexOf(query) !== -1 || point.name.indexOf(query) !== -1;

            if (typeof point.email !== 'undefined') {
                situation = situation || point.email.indexOf(query) !== -1;
            }
            if (situation) {
                otherIndex.push(indexNumber);
            }
        });
    }

    return otherIndex;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    return createFindBook(findIndexs(query)).sort();
};

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    var count = 0;
    csv = csv.split('\n');
    csv.forEach(function pasre(point) {
        var values = point.split(';');
        var name = values[0];
        var phone = values[1];
        var email = values[2];
        if (!exports.update(phone, name, email)) {
            if (exports.add(phone, name, email)) {
                    count++;
            }
        } else {
            count++;
        }
    });

    return count;
};
