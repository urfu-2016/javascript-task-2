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
var REG_EXP_PHONE = /^\d{10}$/;
var REG_EXP_NAME = /[а-яА-ЯёЁ]/;
var REG_EXP_EMAIL = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;
exports.add = function (phone, name, email) {
    function checkPhone(phoneTest) {
        for (var i = 0; i < phoneBook.length; i++) {
            if (phoneTest === phoneBook[i].phone) {
                return false;
            }
        }
        if (REG_EXP_PHONE.test(phoneTest)) {
            return true;
        }

        return false;

    }

    function checkName(nameTest) {
        if (REG_EXP_NAME.test(nameTest)) {
            return true;
        }

        return false;
    }

    function checkMail(mailTest) {
        if ((mailTest === undefined) || (REG_EXP_EMAIL.test(mailTest))) {
            return true;
        }

        return false;
    }

    if (checkPhone(phone) && checkName(name) && checkMail(email)) {
        var person = {
            phone: phone,
            name: name,
            email: email || ''
        };
        phoneBook.push(person);

        return true;
    }

    return false;
};

exports.update = function (phone, name, email) {
    var indexToChange = findPhone(phone);

    function findPhone(nphone) {
        for (var i = 0; i < phoneBook.length; i++) {
            if (phoneBook[i].phone === nphone) {
                return i;
            }
        }
    }

    if (indexToChange !== undefined) {
        phoneBook[indexToChange].name = name;
        if (email === undefined) {
            phoneBook[indexToChange].email = '';

            return true;
        }
        phoneBook[indexToChange].email = email;

        return true;
    }

    return false;
};


exports.findAndRemove = function (query) {
    var noFinds = phoneBook.filter(stayPersons);
    var firstLength = phoneBook.length;
    function stayPersons(person) {
        var personName = person.name;
        var personPhone = person.phone;
        var personEmail = person.email;

        if ((personName.indexOf(query) === -1) && (personPhone.indexOf(query) === -1) &&
        (personEmail.indexOf(query) === -1)) {
            return true;
        }
    }
    phoneBook.splice(0, phoneBook.length);
    phoneBook = noFinds.slice();

    return firstLength - noFinds.length;
};
exports.find = function (query) {
    var result;
    if (query === undefined) {
        return '';
    }
    if (query === '*') {
        result = phoneBook.slice();
    } else {
        result = phoneBook.map(findEntry);
    }


    function findEntry(person) {
        var personName = person.name;
        var personPhone = person.phone;
        var personEmail = person.email;

        if ((personName.indexOf(query) !== -1) || (personPhone.indexOf(query) !== -1) ||
        (personEmail.indexOf(query) !== -1)) {
            return person;
        }
    }
    result.sort(function (a, b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }

        return 0;
    });
    function correctPhoneOutput(phone) {
        return '+7 (' + phone.slice(0, 3) + ') ' +
        phone.slice(3, 6) + '-' + phone.slice(6, 8) + '-' +
        phone.slice(8, 10);
    }

    function correctOutput(person) {
        if (person.email !== '') {
            return person.name + ', ' + correctPhoneOutput(person.phone) + ', ' + person.email;
        }

        return person.name + ', ' + correctPhoneOutput(person.phone);
    }

    return result.map(correctOutput);
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
