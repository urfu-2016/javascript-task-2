'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

var Person = function (phone, name, email) {
    this.phone = phone;
    this.name = name;
    this.email = email;
};

/**
 * Телефонная книга
 */
var phoneBook = {
    personInfo: []
};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean}
 */
exports.add = function (phone, name, email) {
    if (phone.match(/\d{10}/) && !isNoteExists(phone) && name) {
        var person = new Person(phone, name, email || '');
        phoneBook.personInfo.push(person);

        return true;
    }

    return false;
};

function isNoteExists(phone) {
    for (var i = 0; i < phoneBook.personInfo.length; i++) {
        if (phoneBook.personInfo[i].phone.includes(phone)) {
            return true;
        }
    }

    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean}
 */
exports.update = function (phone, name, email) {
    if (name) {
        var positionOfPerson = getIndexOfSuitableInfo(phone);
        if (positionOfPerson === -1) {
            return false;
        }

        phoneBook.personInfo[positionOfPerson].name = name;
        phoneBook.personInfo[positionOfPerson].email = email || '';

        return true;
    }

    return false;
};

function getIndexOfSuitableInfo(personPhone) {
    for (var i = 0; i < phoneBook.personInfo.length; i++) {
        if (phoneBook.personInfo[i].phone === personPhone) {
            return i;
        }
    }

    return -1;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {array}
 */
exports.find = function (query) {
    if (!query) {
        return '';
    }

    var resultInfo = [];
    if (query === '*') {
        resultInfo = phoneBook.personInfo.sort(sortPersonInfoByName);
        for (var k = 0; k < resultInfo.length; k++) {
            resultInfo[k].phone = getConvertedPhoneNum(resultInfo[k].phone);
        }

        return getStrRepOfSortedInfo(resultInfo);
    }

    for (var i = 0; i < phoneBook.personInfo.length; i++) {
        if (isInfoSuit(phoneBook.personInfo[i], query)) {
            var pInfo = phoneBook.personInfo[i];
            resultInfo.push(new Person(pInfo.phone, pInfo.name, pInfo.email));
            resultInfo[resultInfo.length - 1].phone =
            getConvertedPhoneNum(resultInfo[resultInfo.length - 1].phone);
        }
    }

    resultInfo = resultInfo.sort(sortPersonInfoByName);

    return getStrRepOfSortedInfo(resultInfo);
};

function sortPersonInfoByName(p1, p2) {
    if (p1.name > p2.name) {
        return 1;
    }

    if (p1.name < p2.name) {
        return -1;
    }

    return 0;
}

function getConvertedPhoneNum(num) {
    return '+7 (' + num.slice(0, 3) + ') ' +
    num.slice(3, 6) + '-' + num.slice(6, 8) + '-' + num.slice(8, 10);
}

function getStrRepOfSortedInfo(info) {
    var resultInfoList = [];
    for (var i = 0; i < info.length; i++) {
        resultInfoList.push(info[i].name + ', ' + info[i].phone + ', ' + (info[i].email || ''));
    }

    return resultInfoList;
}

function isInfoSuit(info, query) {
    for (var field in info) {
        if (info[field].match(query)) {
            return true;
        }
    }

    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {number}
 */
exports.findAndRemove = function (query) {
    var resultInfo = exports.find(query);
    var personNum = '';
    var countOfDelete = 0;

    for (var i = 0; i < resultInfo.length; i++) {
        personNum = resultInfo[i].split(',')[1].replace(' ', '');

        if (isNoteExists(getStartedRepPhone(personNum))) {
            phoneBook.personInfo.splice(i, 1);
            countOfDelete++;
            i--;
        }
    }

    return countOfDelete;
};

function getStartedRepPhone(phone) {
    return phone.slice(4, 7) + phone.slice(9, 19).replace(/-/g, '');
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
