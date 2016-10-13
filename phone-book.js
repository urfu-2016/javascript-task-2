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


 // Добавление записи в телефонную книгу
 // @param {String} phone
 // @param {String} name
 // @param {String} email

exports.add = function (phone, name, email) {
    if (phone.length !== 10 || isNaN(Number(phone)) || typeof name !== 'string' || name === '') {
        return false;
    }
    if (takevalueOnKey('phone').indexOf(phone) === -1) {
        phoneBook.push({ 'phone': phone, 'name': name, 'email': email });

        return true;
    }

    return false;
};
function takevalueOnKey(key) {
    var phones = [];
    phoneBook.forEach(function takePhones(item) {
        phones.push(item[key]);
    });

    return phones;
}


 // Обновление записи в телефонной книге
 // @param {String} phone
 // @param {String} name
 // @param {String} email
exports.update = function (phone, name, email) {
    if (typeof name !== 'string' || name === '') {
        return false;
    }
    if (phone.length !== 10 || isNaN(Number(phone))) {
        return false;
    }

    var index = takevalueOnKey('phone').indexOf(phone);
    if (index !== -1) {
        phoneBook[index].name = name;
        phoneBook[index].email = email;

        return true;
    }

    return false;
};


 // Удаление записей по запросу из телефонной книги
 // @param {String} query

exports.findAndRemove = function (query) {
    var indexs = findIndexs(query);
    var newBookPhone = [];
    phoneBook.forEach(function remove(item, ind) {
        if (indexs.indexOf(ind) === -1) {
            newBookPhone.push(item);
        }
    });
    phoneBook = newBookPhone;

    return indexs.length;
};


 // Поиск записей по запросу в телефонной книге
 // @param {String} query

function createFindBook(indexes) {
    var newBook = [];
    var str = '';
    var phone = '';
    phoneBook.forEach(function choise(item, index) {
        if (indexes.indexOf(index) !== -1) {
            phone = phoneBook[index].phone;
            var temp = '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6);
            temp += '-' + phone.slice(6, 8) + '-' + phone.slice(8, 10);
            var email = phoneBook[index].email;
            email = typeof email === 'undefined' ? '' : ', ' + email;
            str = phoneBook[index].name + ', ' + temp + email;
            newBook.push(str);
        }
    });

    return newBook;
}

function findIndexs(query) {
    if (query === '' || typeof query !== 'string') {
        return [];
    }
    var indexs = [];
    if (query === '*') {
        phoneBook.forEach(function generateInd(item, ind) {
            indexs.push(ind);
        });
    } else {
        phoneBook.forEach(function findInd(item, ind) {
            var сondition = item.phone.indexOf(query) !== -1 || item.name.indexOf(query) !== -1;
            if (typeof item.email !== 'undefined') {
                сondition = сondition || item.email.indexOf(query) !== -1;
            }
            if (сondition) {
                indexs.push(ind);
            }
        });
    }

    return indexs;
}


exports.find = function (query) {

    return createFindBook(findIndexs(query)).sort();
};

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    var count = 0;
    csv = csv.split('\n');
    csv.forEach(function pasre(item) {
        var values = item.split(';');
        var name = values[0];
        var phone = values[1];
        var email = values[2];
        if (!exports.update(phone, name, email)) {
            if (exports.add(phone, name, email)) {
                count++;
            }
        } else {
            count++;
        }
    });

    return count;
};
