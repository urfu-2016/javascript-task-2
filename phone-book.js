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
function validation(name, phone, email) {
    function checkPhone() {
        return ((phone) && (typeof(phone) === 'string') && (/^\d{10}$/.test(phone)));
    }

    function checkName() {
        return ((name) && (typeof(name) === 'string') &&
    (name.length > 0));
    }

    function correctMail() {
        return ((typeof(email) === 'undefined') || ((typeof(email) === 'string') && (name !== '')));
    }

    return (checkPhone() && checkName() && correctMail());
}

exports.add = function (phone, name, email) {
    if ((validation(name, phone, email)) &&
    (uniquePhone(phone) === -1)) {
        if (typeof(email) === 'undefined') {
            phoneBook.push({ phone: phone, name: name });

            return true;
        }
        phoneBook.push({ phone: phone, name: name, email: email });

        return true;
    }

    return false;
};

function uniquePhone(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return i;
        }
    }

    return -1;
}

exports.update = function (phone, name, email) {
    var indexToChange = uniquePhone(phone);
    if ((validation(name, phone, email)) &&
    (indexToChange > -1)) {
        phoneBook[indexToChange].name = name;
        if (typeof(email) !== 'undefined') {
            phoneBook[indexToChange].email = email;
        } else {
            delete phoneBook[indexToChange].email;
        }

        return true;
    }

    return false;
};


exports.findAndRemove = function (query) {
    var result = 0;
    if ((!query) || (typeof(query) !== 'string')) {
        return result;
    }
    var finds = exports.find(query);
    phoneBook = phoneBook.filter(isMatch);
    function isMatch(person) {
        for (var i = 0; i < finds.length; i++) {
            if (person.phone === finds[i].phone) {
                return false;
            }
        }

        return true;
    }
    result = finds.length;

    return result;
};
exports.find = function (query) {
    var result = [];
    if ((!query) || (typeof(query) !== 'string')) {
        return result;
    }
    if (query === '*') {
        return phoneBook.sort(bookSort).map(correctOutput);
    }
    result = phoneBook.filter(findEntry).sort(bookSort)
    .map(correctOutput);

    function findEntry(person) {
        if (person.email !== undefined) {
            return (person.name.indexOf(query) !== -1) ||
        (person.phone.indexOf(query) !== -1) ||
        (person.email.indexOf(query) !== -1);
        }

        return ((person.name.indexOf(query) !== -1) ||
        (person.phone.indexOf(query) !== -1));
    }
    function bookSort(a, b) {
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        }
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
        }

        return 0;
    }
    function correctPhoneOutput(phone) {
        return '+7 (' + phone.slice(0, 3) + ') ' +
        phone.slice(3, 6) + '-' + phone.slice(6, 8) + '-' +
        phone.slice(8, 10);
    }

    function correctOutput(person) {
        if (person.email !== undefined) {
            return person.name + ', ' + correctPhoneOutput(person.phone) + ', ' + person.email;
        }

        return person.name + ', ' + correctPhoneOutput(person.phone);
    }

    return result;
};

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    if (!csv) {
        return 0;
    }
    var added = 0;
    csv.split('\n').forEach(function (person) {
        person = person.split(';');
        if (exports.add(person[1], person[0], person[2]) ||
        (exports.update(person[1], person[0], person[2]))) {
            added++;
        }
    });

    return added;
};
