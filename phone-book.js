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
function checkPhone(phoneTest) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phoneTest) {
            return false;
        }
    }
    if (/^\d{10}$/.test(phoneTest) && typeof(phoneTest) === 'string') {
        return true;
    }

    return false;

}

function checkName(testName) {
    if ((typeof(testName) !== 'undefined') && (typeof(testName) === 'string') &&
    (testName.length > 0)) {
        return true;
    }

    return false;
}

exports.add = function (phone, name, email) {
    if (checkPhone(phone) && checkName(name)) {
        phoneBook.push({ phone: phone, name: name, email: email });

        return true;
    }

    return false;
};

exports.update = function (phone, name, email) {
    if ((!checkName(name))) {
        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            phoneBook[i].name = name;
            phoneBook[i].email = email;

            return true;
        }
    }

    return false;
};


exports.findAndRemove = function (query) {
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

    return finds.length;
};
exports.find = function (query) {
    var result = [];
    if ((typeof(query) !== 'string') || (query.length <= 0)) {
        return [];
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
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
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
