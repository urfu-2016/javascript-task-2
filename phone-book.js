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
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.add = function (phone, name, email) {
    var phoneRegEx = /^\d{10}$/;
    var currentPhone = new RegExp(phone);
    if ((!phoneRegEx.test(phone)) || (name === '') || (name === undefined) || (currentPhone.exec(phoneBook))){
        return false;
    }
    phoneBook.push([phone, name, email]);
    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function (phone, name, email) {
    var phoneRegEx = /^\d{10}$/;
    var currentPhone = new RegExp(phone);
    if ((!phoneRegEx.test(phone)) || (name === '') || (name === undefined)){
        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (currentPhone.exec(phoneBook[i])){
            phoneBook.splice(i, 1);
            phoneBook.splice(i, 0, [phone, name, email]);
            return true;
        }
    }
    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    if (query === '*'){
        phoneBook = [];
        return (phoneBook.length - 1);
    }
    if (query === ''){
        return 0;
    }
    var s = 0;
    var foundRegExp = new RegExp(query);
    for (var i = 0; i < phoneBook.length; i++) {
        if ((foundRegExp.test((phoneBook[i])[0])) || (foundRegExp.test((phoneBook[i])[1])) || (foundRegExp.test((phoneBook[i])[2]))){            
            phoneBook.splice(i, 1);
            s++;
        }
    }
    return s;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    var arrayOfFounded = [];
    if (query === ''){
        return null;
    }
    if (query === '*'){
        for (var i = 0; i < phoneBook.length; i++) {
            var sp = ((phoneBook[i])[0]).split('');
            var phone = '+7 (' + sp[0] + sp[1] + sp[2] + ') ' + sp[3] + sp[4] + sp[5] + '-' + sp[6] + sp[7] + '-' + sp[8] + sp[9];
            arrayOfFounded.push([(phoneBook[i])[1], phone, (phoneBook[i])[2]]);
        }
        var sortedArray = arrayOfFounded.sort();
        var sortedArrayOfStrings = [];
        for (var i = 0; i < sortedArray.length; i++) {
            sortedArrayOfStrings.push((sortedArray[i]).join(', '));
        }
        return sortedArrayOfStrings;
    }
    var foundRegExp = new RegExp(query);
    for (var i = 0; i < phoneBook.length; i++) {
        if ((foundRegExp.test((phoneBook[i])[0])) || (foundRegExp.test((phoneBook[i])[1])) || (foundRegExp.test((phoneBook[i])[2]))){
            var sp = ((phoneBook[i])[0]).split('');
            var phone = '+7 (' + sp[0] + sp[1] + sp[2] + ') ' + sp[3] + sp[4] + sp[5] + '-' + sp[6] + sp[7] + '-' + sp[8] + sp[9];
            arrayOfFounded.push([(phoneBook[i])[1], phone, (phoneBook[i])[2]]);
        }
    }
    var sortedArray = arrayOfFounded.sort();
    var sortedArrayOfStrings = [];
    for (var i = 0; i < sortedArray.length; i++) {
        sortedArrayOfStrings.push((sortedArray[i]).join(', '));
    }
    return sortedArrayOfStrings;
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
