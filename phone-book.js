'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

var Person = function (phone, name, email) {
    this.phone = phone;
    this.name = name;

    if (email) {
        this.email = email;
    }
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
    if (isInfoCorrect(phone, name)) {
        phoneBook.personInfo.push(new Person(phone, name, email));

        return true;
    }

    return false;
};

function isInfoCorrect(phone, name) {
    if (phone.match(/\d{10}/) && !isNoteExists(phone) && name) {
        return true;
    }

    return false;
}

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
    if (name && phone.match(/\d{10}/)) {
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
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {number}
 */
exports.findAndRemove = function (query) {
    var resultInfo = exports.find(query);
    var personNum = '';
    var indexOfFoundedInfo;

    for (var i = 0; i < resultInfo.length; i++) {
        personNum = resultInfo[i].split(',')[1].replace(' ', '');
        indexOfFoundedInfo = getIndexOfSuitableInfo(getStartedRepPhone(personNum));

        if (indexOfFoundedInfo !== -1) {
            phoneBook.personInfo.splice(indexOfFoundedInfo, 1);
        }
    }

    return resultInfo.length;
};

function getStartedRepPhone(phone) {
    return phone.slice(4, 7) + phone.slice(9, 19).replace(/-/g, '');
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

        return getStrRepOfSortedInfo(resultInfo);
    }

    for (var i = 0; i < phoneBook.personInfo.length; i++) {
        if (isInfoSuitForQuery(phoneBook.personInfo[i], query)) {
            var pInfo = phoneBook.personInfo[i];
            resultInfo.push(new Person(pInfo.phone, pInfo.name, pInfo.email));
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

function getStrRepOfSortedInfo(info) {
    var resultInfoList = [];
    var resultStr = '';

    for (var i = 0; i < info.length; i++) {
        resultStr = info[i].name + ', ' + getConvertedPhoneNum(info[i].phone);

        if (info[i].email) {
            resultStr += ', ' + info[i].email;
        }

        resultInfoList.push(resultStr);
    }

    return resultInfoList;
}

function getConvertedPhoneNum(num) {
    return '+7 (' + num.slice(0, 3) + ') ' +
    num.slice(3, 6) + '-' + num.slice(6, 8) + '-' + num.slice(8, 10);
}

function isInfoSuitForQuery(info, query) {
    for (var field in info) {
        if (info[field].match(query)) {
            return true;
        }
    }

    return false;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    var person;
    var parsedStr;
    var amountOfAddedInfo = 0;
    csv = csv.split('\n');

    for (var i = 0; i < csv.length; i++) {
        parsedStr = csv[i].split(';');
        person = new Person(parsedStr[1], parsedStr[0], parsedStr[2]);

        if (exports.add(person.phone, person.name, person.email) ||
            exports.update(person.phone, person.name, person.email)) {
            amountOfAddedInfo++;
        }
    }

    return amountOfAddedInfo;
};
