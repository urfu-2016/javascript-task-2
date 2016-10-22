'use strict';

/**
 * неСделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = false;

/**
 * Телефонная книга
 */
var phoneBook = [];
var formAccount = {
    phone: undefined,
    name: undefined,
    email: undefined
};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.add = function (phone, name, email) {
    phone = checkNull(phone);
    phone = phone.trim();
    name = checkNull(name);
    name = name.trim();
    if (checkData(phone)) {
        return false;
    }
    if (name === '') {
        return false;
    }
    email = checkNull(email);
    email = email.trim();
    var newAccount = Object.create(formAccount);
    newAccount.phone = phone;
    newAccount.name = name;
    newAccount.email = email;
    phoneBook.push(newAccount);

    return true;
};

function checkData(phone) {
    if (!formPhone(phone)) {
        return true;
    }
    if (findAccount(phone) !== 0) {
        return true;
    }

    return false;
}

function findAccount(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return i;
        }
    }

    return 0;
}

function formPhone(phone) {
    var reg = /^\d{10}$/;

    return reg.test(phone);
}

function checkNull(str) {
    if (str === null || str === undefined) {
        return '';
    }

    return str;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.update = function (phone, name, email) {
    phone = checkNull(phone);
    phone = phone.trim();
    name = checkNull(name);
    name = name.trim();
    if (!formPhone(phone)) {
        return false;
    }
    var number = findAccount(phone);
    if (number === 0) {
        return false;
    }
    phoneBook[number].phone = phone;
    if (name !== '') {
        phoneBook[number].name = name;
    }
    email = checkNull(email);
    email = email.trim();
    phoneBook[number].email = email;

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
exports.findAndRemove = function (query) {
    var kol = 0;
    if (query === '*') {
        kol = phoneBook.length;
        phoneBook.splice(0, kol);

        return kol;
    }
    if (query === '') {
        return 0;
    }
    var t = findAllAccount(query, 'del') + 1;

    return t;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Object}
 */
exports.find = function (query) {
    var masOutputAccount = [];
    if (query === '*') {
        for (var i = 0; i < phoneBook.length; i++) {
            masOutputAccount.push(output(i));
        }
        masOutputAccount.sort();

        return masOutputAccount;
    }
    if (checkNull(query) === '') {
        return masOutputAccount;
    }

    return findAllAccount(query, '');
};

function findAllAccount(query, flag) {
    var masOutputAccount = [];
    var kol = 0;
    if (flag === '') {
        masOutputAccount = findElem(query, flag);
        masOutputAccount.sort();
        if (masOutputAccount.length === 0) {
            return '';
        }

        return masOutputAccount;
    }
    kol = findElem(query, flag);

    return kol;
}

function findQueryInAccounts(query, element) {
    query = query.toLowerCase();
    var keys = Object.keys(element);
    for (var i = 0; i < keys.length; i++) {
        if (element[keys[i]].toLowerCase().indexOf(query) !== -1) {
            return true;
        }
    }

    return false;
}

function findElem(query, flag) {
    var masFindElem = [];
    var kol = 0;
    for (var i = 0; i < phoneBook.length; i++) {
        if (findQueryInAccounts(query, phoneBook[i])) {
            kol++;
            i = findOrDeletAccount(i, masFindElem, flag);
        }
    }
    if (flag === 'del') {
        return kol;
    }

    return masFindElem;
}

function findOrDeletAccount(i, masFindElem, flag) {
    if (flag === '') {
        masFindElem.push(output(i));
    } else {
        phoneBook.splice(i, 1);
        i--;
    }

    return i;
}

function output(i) {
    var strOutput = '';
    var kod = phoneBook[i].phone.slice(0, 3);
    var p1 = phoneBook[i].phone.slice(3, 6);
    var p2 = phoneBook[i].phone.slice(6, 8);
    var p3 = phoneBook[i].phone.slice(8, 10);
    var phone = ', +7 (' + kod + ') ' + p1 + '-' + p2 + '-' + p3;
    strOutput = phoneBook[i].name + phone;
    if (phoneBook[i].email !== '') {
        strOutput += ', ' + phoneBook[i].email;
    }

    return strOutput;
}

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
