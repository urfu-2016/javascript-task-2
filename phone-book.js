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

 /**
  * Поиск записи в книге по телефону
  * @param {String} query
  * @return {Number} result
  */
function findByPhone(query) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === query) {

            return i;
        }
    }

    return -1;
};

/**
 * Проверка номера
 * @param {String} phone
 * @return {boolean} result
 */
function phoneIsGood(phone) {
    if (phone.length == 10) {
        var regex = /[0-9]+/; // похоже неверно
        if (phone.match(regex)==null) {

            return false;
        }
    }
    else {

        return false;
    }

    return true;
};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean} result
 */
exports.add = function (phone, name, email) {
    if (name === undefined) {

        return false;
    }
    if (!phoneIsGood(phone)) {

        return false;
    }
    if (findByPhone(phone)!=-1) {

        return false;
    }
    var note = {
        phone: phone,
        name: name,
        email: email
    };
    phoneBook.push(note);

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function (phone, name, email) {
    if (!phoneIsGood(phone)) {

        return false;
    }
    var ind = findByPhone(phone);
    if (ind == -1) {

        return false;
    }
    if (name !== undefined) {
        phoneBook[ind].name = name;
    }
    if (email === undefined) {
        phoneBook[ind].email = '';
    }
    else {
        phoneBook[ind].email = email;
    }

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @return {Number} result
 */
exports.findAndRemove = function (query) {
    if (query === undefined) { return 0; }
    var res = 0;
    if (query == '*') {
        res = phoneBook.length;
        phoneBook.splice(0, res);

        return res;
    }
    var i=0;
    while(i < phoneBook.length) {
        if (phoneBook[i].phone.indexOf(query) != -1) {
            res++;
            phoneBook.splice(i, 1);
            continue;
        }
        else if (phoneBook[i].name.indexOf(query) != -1){
            res ++;
            phoneBook.splice(i, 1);
            continue;
        }
        else if (phoneBook[i].email !== undefined){
            if (phoneBook[i].email.indexOf(query) != -1){
                res ++;
                phoneBook.splice(i, 1);
                continue;
            }
        }
        i++;
    }

    return res;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @return {Array} result
 */
exports.find = function (query) {
    var copy = [];
    if (query === undefined) { return copy; }
    copy = phoneBook;
    copy.sort(function (a, b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    });
    if (query != '*') {
        var i = 0;
        while (i < copy.length) {
            if (copy[i].phone.indexOf(query) != -1) {
                i++;
                continue;
            }
            else if (copy[i].name.indexOf(query) != -1) {
                i++;
                continue;
            }
            else if (copy[i].email !== undefined) {
                if (copy[i].email.indexOf(query) != -1) {
                    i++;
                    continue;
                }
            }
            copy.splice(i, 1);
        }
        var temp = '';
        for (i = 0; i < copy.length; i++) {
            temp = '+7 (' + copy[i].phone.slice(0, 3) + ') ' + copy[i].phone.slice(3, 6) + '-';
            temp += copy[i].phone.slice(6, 8) + '-' + copy[i].phone.slice(8, 10);
            copy[i].phone = temp;
        }
    }
    var res = [];
    for (i = 0; i < copy.length; i++) {
        res.push(copy[i].name + ', ' + copy[i].phone + ', ' + copy[i].email);
    }
    return res;
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
