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
 */
exports.add = function (phone, name, email) {
    phone = checkNull(phone);
    name = checkNull(name);
    if (checkData(phone)) {
        console.info('addf'+phone+', '+name+', '+email);
        return false;
    }
    if (name === '') {
        console.info('addf'+phone+', '+name+', '+email);
        return false;
    }
    email = checkNull(email);
    var newAccount = Object.create(formAccount);
    newAccount.phone = phone;
    newAccount.name = name;
    newAccount.email = email;
    phoneBook.push(newAccount);
    console.info('add'+phone+', '+name+', '+email);
    return true;
};

function checkData(phone) {
    if (formPhone(phone)) {
        return true;
    }
    if (findAccount(phone) !== 0){
        return true;
    }

    return false;
}

function findAccount(phone) {
    for (var  i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            return i;
        }
    }
    return 0;
}

function formPhone(phone) {
    if (phone.indexOf('(') !== -1) {
        return true;
    }
    if (phone.indexOf('+') !== -1) {
        return true;
    }
    if(phone.indexOf('-') !== -1) {
        return true;
    }
    if (phone.length !== 10) {
        return true;
    }

    return false;
}

function checkNull(str) {
    if (str === null || str === undefined) {
        return '';
    } else {
        return str;
    }
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function (phone, name, email) {
    phone = checkNull(phone);
    name = checkNull(name);
    if (formPhone(phone)) {
        console.info('apdatef1 '+phone+', '+name+', '+email);
        return false;
    }
    var number = findAccount(phone);
    if (number === 0) {
        console.info('apdatef2 '+phone+', '+name+', '+email);
        return false;
    }
    phoneBook[number].phone = phone;
    if (name !== '') {
        phoneBook[number].name = name;
    }
    email = checkNull(email);
    phoneBook[number].email = email;
    console.info('apdate'+phone+', '+name+', '+email);

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var kol = 0;
    if (query === '*') {
        kol = phoneBook.length;
        for (var i = 0 ; i < phoneBook.length; i++) {
            phoneBook.pop;
        }
        console.info(kol+' del* '+query);
        return kol;
    }
    if (query === '') {
        console.info(0+' del0 '+query);
        return 0;
    }
    var t = findAllAccount(query, 'del');
    console.info(t+' deln '+query);
    return t;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    var masOutputAccount = [];
    if (query === '*') {
        for (var i = 0; i < phoneBook.length; i++){
            masOutputAccount.push(output(i));
        }
        masOutputAccount.sort();
        console.info('find* '+query);
        return masOutputAccount;
    }
    if(checkNull(query) === '') {
        return ''+'find0 '+query;
    }

    return findAllAccount(query, '')+'findn '+query;
};

function findAllAccount(query, flag) {
    var masOutputAccount = [];
    var kol = 0;
    if (flag === '') {
        masOutputAccount = findElem(query, flag);
        masOutputAccount.sort;
        if (masOutputAccount.length === 0){
            return '';
        } else {
/*            return out(masOutputAccount);*/
            return masOutputAccount;
        }
    } else {
        masOutputAccount = findElem(query, flag);
        return kol;
    }
}

/*function out(mas) {
    
    for (var i = 0; i < mas.length; i++) {
        
    }
}*/

function findElem(query, flag) {
    var masFindElem = [];
    var kol = 0;
    for (var i = 0; i < phoneBook.length; i++){
        if (phoneBook[i].phone.indexOf(query) !== -1) {
            if (flag !== '') {
                masFindElem.push(output(i));
            } else {
                kol++;
                phoneBook[i].pop;
            }
        }
    }
    if (masFindElem.length !== 0) {
        for (var i = 0; i < phoneBook.length; i++){
            if (phoneBook[i].name.indexOf(query) !== -1) {
                if (flag !== '') {
                masFindElem.push(output(i));
                } else {
                    kol++;
                    phoneBook[i].pop;
                }
            }
        }
    }
    if (masFindElem.length !== 0) {
        for (var i = 0; i < phoneBook.length; i++){
            if (phoneBook[i].email.indexOf(query) !== -1) {
                if (flag !== '') {
                masFindElem.push(output(i));
                } else {
                    kol++;
                    phoneBook[i].pop;
                }
            }
        }
    }
    if (flag === '') {
        return kol;
    }
    
    return masFindElem;
}

function output(i) {
    var strOutput = '';
    var kod = phoneBook[i].phone.slice(0,2);
    var p1 = phoneBook[i].phone.slice(3,5);
    var p2 = phoneBook[i].phone.slice(6,7);
    var p3 = phoneBook[i].phone.slice(8,9);
    strOutput = phoneBook[i].name + '+7 (' + kod + ')' + p1 + '-' + p2 + '-' + p3;
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
