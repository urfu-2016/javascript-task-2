'use strict';

exports.isStar = false;

var phoneBook = [];

exports.add = function (phone, name, email) {
    var phoneRegEx = /^\d{10}$/;
    var currentPhone = new RegExp(phone);
    if ((!phoneRegEx.test(phone)) || (name === '') ||
    (name === undefined) || (currentPhone.exec(phoneBook))) {
        return false;
    }
    phoneBook.push([phone, name, email]);

    return true;
};

exports.update = function (phone, name, email) {
    var phoneRegEx = /^\d{10}$/;
    var currentPhone = new RegExp(phone);
    if ((!phoneRegEx.test(phone)) || (name === '') || (name === undefined)) {
        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (currentPhone.exec(phoneBook[i])) {
            phoneBook.splice(i, 1);
            phoneBook.splice(i, 0, [phone, name, email]);

            return true;
        }
    }

    return false;
};

exports.findAndRemove = function (query) {
    switch (query) {
        case '*':
            phoneBook = [];

            return (phoneBook.length - 1);
        case '':

            return 0;
        default:
            var s = 0;
            var foundRegExp = new RegExp(query);
            for (var i = 0; i < phoneBook.length; i++) {
                if ((foundRegExp.test((phoneBook[i])[0])) ||
                (foundRegExp.test((phoneBook[i])[1])) || (foundRegExp.test((phoneBook[i])[2]))) {
                    phoneBook.splice(i, 1);
                    s++;
                }
            }  

            return s;
        }
};

exports.find = function (query) {
    var arrayOfFounded = [];
    switch (query) {
        case '':
            return null;
        case '*':
            help1();
        default:
        var foundRegExp = new RegExp(query);
        for (var i = 0; i < phoneBook.length; i++) {
            if ((foundRegExp.test((phoneBook[i])[0])) ||
            (foundRegExp.test((phoneBook[i])[1])) || (foundRegExp.test((phoneBook[i])[2]))) {
                var sp = ((phoneBook[i])[0]).split('');
                var phone = '+7 (' + sp[0] + sp[1] + sp[2] + ') ' + sp[3] +
                sp[4] + sp[5] + '-' + sp[6] + sp[7] + '-' + sp[8] + sp[9];
                arrayOfFounded.push([(phoneBook[i])[1], phone, (phoneBook[i])[2]]);
            }
        }
        help2();
    }
};

function help2() {
    var arrayOfFounded = [];
    var sortedArray = arrayOfFounded.sort();
    var sortedArrayOfStrings = [];
    for (var l = 0; l < sortedArray.length; l++) {
        sortedArrayOfStrings.push((sortedArray[l]).join(', '));
    }

    return sortedArrayOfStrings;
}

function help1() {
    var arrayOfFounded = [];
    for (var j = 0; j < phoneBook.length; j++) {
        var sph = ((phoneBook[j])[0]).split('');
        var phoneX = '+7 (' + sph[0] + sph[1] + sph[2] + ') ' + sph[3] +
        sph[4] + sph[5] + '-' + sph[6] + sph[7] + '-' + sph[8] + sph[9];
        arrayOfFounded.push([(phoneBook[j])[1], phoneX, (phoneBook[j])[2]]);
    }
    var sortedArrayX = arrayOfFounded.sort();
    var sortedArrayOfStringsX = [];
    for (var k = 0; k < sortedArrayX.length; k++) {
        sortedArrayOfStringsX.push((sortedArrayX[k]).join(', '));
    }

    return sortedArrayOfStringsX;
}

exports.importFromCsv = function (csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует

    return csv.split('\n').length;
};
