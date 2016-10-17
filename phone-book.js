'use strict';

 function check(phone, name){
    var isEmpty = name === '' || phone === '';
    var isStringP = typeof Number(phone) !== 'number';
    var isString = typeof name !== 'string';
    if (phone.length !== 10 || isString || isEmpty || isStringP){
        return false;
    }
    return true;
 }

exports.isStar = true;

var phoneBook = {
    phone: [],
    name: [],
    email: []
};

function addEmail(email){
    if (typeof email === 'undefined'){
        return '';
    }
    else {
        return email;
    }
}

exports.add = function (phone, name, email) {
    if (check(phone, name)){
        var indexP = phoneBook.phone.indexOf(phone) === -1;
        var indexN = phoneBook.name.indexOf(name) === -1;
        var indexE = phoneBook.email.indexOf(email) === -1;
        if (indexE && indexN && indexP){
            phoneBook.phone.push(phone);
            phoneBook.name.push(name);
            phoneBook.email.push(addEmail(email));
            }
        return true;
    }

    return false;
};

exports.update = function (phone, name, email) {
    if (check(phone, name)){
        var index = phoneBook.phone.indexOf(phone);
        if ( index === -1){
            phoneBook.phone.push(phone);
            phoneBook.name.push(name);
            phoneBook.email.push(addEmail(email));
        }
        if (index !== -1){
            phoneBook.name[index] = name;
            phoneBook.email[index] = addEmail(email);
        }
        return true;
    }

    return false;
};

function addIndexArray(resultIndex){
    var arr = [];
    for (var i = 0; i < resultIndex.length; i++) {
        resultIndex[i].forEach(function(item, i, a) {
            arr.push(item);
        })
    }
    return arr;
}

exports.findAndRemove = function (query) {
    if (typeof query === undefined || query === ''){
        return 0;
    }
    if (query === '*'){
        var len = phoneBook.name.length;
        phoneBook = [];
        return len;
    }
    var resultIndex = [];
    resultIndex.push(findIndex(phoneBook.phone, query));
    resultIndex.push(findIndex(phoneBook.name, query));
    resultIndex.push(findIndex(phoneBook.email, query));
    if (resultIndex !== []){
        var newBook = {
            phone: [],
            name: [],
            email: []
        };
        var arr = addIndexArray(resultIndex);
        phoneBook.name.forEach(function (item, i) {
            if (arr.indexOf(i) === -1) {
                newBook.phone.push(phoneBook.phone[i]);
                newBook.name.push(phoneBook.name[i]);
                newBook.email.push(phoneBook.email[i]);
            }
        })
        phoneBook = newBook;
        return arr.length;
    }
    return 0;
};

function findIndex(arr,str){
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].indexOf(str) !== -1){
            result.push(i);
        }
    }
    return result;
}

function strPhone(phone){
    var str = '+7 '
    str +='('+phone.substring(0,3)+') ';
    str +=phone.substring(3,6)+'-';
    str +=phone.substring(6,8)+'-';
    str +=phone.substring(8);
    return str;
}

function dictionary(arr){
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        arr[i].forEach(function(item, i, a) {
            var strP = strPhone(phoneBook.phone[item])
            if (phoneBook.email[item] === ''){
                res.push(phoneBook.name[item] + ', ' + strP)
            }
            else{
                res.push(phoneBook.name[i] + ', ' + strP + ', ' + phoneBook.email[i])
            }
        })
    }
    return res.sort();
}

exports.find = function (query) {
    if (typeof query === undefined || query === ''){
        return [];
    }
    if (query === '*'){
        var len = phoneBook.name.length;
        var res = [];
        for (var i = 0; i < len; i++){
            var strP = strPhone(phoneBook.phone[i])
            if (phoneBook.email[i] === ''){
                res.push(phoneBook.name[i] + ', ' + strP)
            }
            else{
                res.push(phoneBook.name[i] + ', ' + strP + ', ' + phoneBook.email[i])
            }
        }
        return res.sort();
    }
    var resultIndex = [];
    resultIndex.push(findIndex(phoneBook.phone, query));
    resultIndex.push(findIndex(phoneBook.name, query));
    resultIndex.push(findIndex(phoneBook.email, query));
    if (resultIndex !== []){
        return dictionary(resultIndex);
    }
    return [];
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
