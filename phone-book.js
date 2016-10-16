'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */
var phoneBook
var phBook  = new Array();

function isPhone(phone){
    var rePhone = /\d{10}/;
    return (rePhone.test(phone) && phone.length === 10);
}

function inPhoneBook(phone){
    for (var i = 0; i < phBook.length; i++) {
        if (phBook[i].phone === phone)
            return false;
    }
    return true;
}


function findInNote(query, note){
    var n = note.phone.indexOf(query);
    n += note.name.indexOf(query);
    n += note.email === undefined ? -1 : note.email.indexOf(query);
    return (n > -3);
    
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.add = function add(phone, name, email) {
    if (!isPhone(phone) || name === undefined || !inPhoneBook(phone))
        return false;
    var note = {
        phone: phone,
        name: name,
        email: email
    };
    phBook.push(note);
    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function update(phone, name, email) {
    if (!inPhoneBook(phone) || name == undefined){
        return false;
    }
    for (var i = 0; i < phBook.length; i++) {
        if (phBook[i].phone === phone){
            phBook[i].name = name;
            phBook[i].email = email;
        }
    }
    
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var nStr = 0;
    for (var i = 0; i < phBook.length; i++) {
            if (findInNote(query, phBook[i])){
                phBook.splice(i,1);
                nStr += 1;
    }}
    return nStr;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function find(query) {
    if (query === undefined) 
        return;
    var allFound = new Array();
    var addnote = (query === "*");  
    for (var i = 0; i < phBook.length; i++) {
            if (findInNote(query, phBook[i] || addnote)){
                var phone = "+7 (" + phBook.phone.slice(0,3) + ") " + phBook.phone.slice(3,6) + "-" + phBook.phone.slice(6,8) + "-" + phBook.phone.slice(8);
                var strValue = phBook[i].name + ", " + phone + ", " + phBook[i].email;
                allFound.pop(strValue);
            }
    }
    allFound.sort();
    return allFound;
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
    var notesCsv = csv.split('\n');
    var n = notesCsv.length;
    for (var i = 0; i < notesCsv.length; i++){
        var name, phone, email = notesCsv[i].split(';');
        var samePhone = csv.search(phone);
        n += 1 - samePhone.length; 
        if (!add(name, phone, email))
            update(name, phone, email);

    } 
    
    
    return csv.split('\n').length;
};
