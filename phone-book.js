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
  */
function findByPhone (query) {
    for (var i=0; i<phoneBook.length; i++) {
        if (phoneBook[i].phone == query) {
            return i;
        }
    }
    return -1;
};

/**
 * Проверка номера
 * @param {String} phone
 */
function phoneIsGood (phone) {
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
 * @returns {bool} result
 */
exports.add = function (phone, name, email) {
    if (name === undefined) { return false; }
    if (!phoneIsGood(phone)) {
        return false;
    }
    if (findByPhone(phone)!=-1) { return false; }
    var note = {
        phone: phone,
        name: name,
        email: email
    };
    console.info('add');
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
    if (!phoneIsGood(phone)) { return false; }
    var ind = findByPhone(phone);
    if (ind == -1) { return false; }
    if (name !== undefined) {
        phoneBook[ind].name = name;
    }
    if (email === undefined) {
        phoneBook[ind].email = '';
    }
    else {
        phoneBook[ind].email = email;
    }
    console.info('update');
    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
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
    //console.info(res);
    return res;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    var res = [];
    if (query === undefined) { return res; }
    res = phoneBook;
    res.sort(function (a, b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    });
    if (query == '*') { return res; }
    var i=0;
    while(i < res.length) {
        if (res[i].phone.indexOf(query) != -1) {
            i++;
            continue;
        }
        else if (res[i].name.indexOf(query) != -1){
            i++;
            continue;
        }
        else if (res[i].email !== undefined){
            if (res[i].email.indexOf(query) != -1){
                i++;
                continue;
            }
        }
        res.splice(i, 1);
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
