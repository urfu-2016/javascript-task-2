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

/*
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.add = function (phone, name, email) {
    var regPhone = /^\b[\d]{10}\b$/m;

    if (!regPhone.test(phone) || name === undefined || !setRecordStatus(phone)) {
        return false;
    }

    var phoneBookData = { phone: phone, name: name, email: email };
    phoneBook.push(phoneBookData);

    return true;
};

// Функция проверяет существование записи в телефонной книге
function setRecordStatus(checkPhone) {

    function compareArguments(item) {

        if (item.phone === checkPhone) {
            return true;
        }

    }

    return phoneBook.filter(compareArguments).length === 0;
}

/*
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function (phone, name, email) {
    var regPhone = /^\b[\d]{10}\b$/m;
    if (name === undefined || !regPhone.test(phone)) {
        return false;
    }

    phoneBook.forEach(searchByPhone);

// callback функция для проверки существования телефона и обнавления данных
    function searchByPhone(item) {
        if (item.phone === phone) {
            item.name = name;
            if (email === undefined) {
                delete item.email;
            } else {
                item.email = email;
            }
        }
    }

    return true;
};

/*
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var count = 0;

    while (findForRemove(query)) {
        count++;
    }

    return count;
};

// callback функция проверяет вхождения запроса для удаления контакта
function findForRemove(query) {
    var indexOfElement = phoneBook.findIndex(findElementIndex);

    function findElementIndex(item, index) {
        var objectItem = Object.keys(item);
        for (var i = 0; i < objectItem.length; i++) {
            var result = item[objectItem[i]].indexOf(query);
            if (result !== -1) {
                phoneBook.splice(index, 1);

                return true;
            }
        }
    }

    return indexOfElement !== -1;
}

/*
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {

    if (!query) {
        return;
    }

    var contactList = searchByContacts(query);

    return contactList;
};

// callback функция сортирует, ищет записи в телефонной книге
function searchByContacts(query) {
    var contactList = phoneBook.filter(searchByQuery)
                                 .map(creatNewList)
                                 .sort();

    function searchByQuery(item) {
        var objectItem = Object.keys(item);

        if (query === '*') {
            return true;
        }

        for (var i = 0; i < objectItem.length; i++) {
            var res = item[objectItem[i]].indexOf(query);

            return res !== -1;
        }
    }

    return contactList;
}

// callback функция формирует отсортированные котнакты в виде строк
function creatNewList(item) {
    var phoneSplit = item.phone.split('');
    var phone = phoneSplit.reduce(rewritePhoneNumber, '');

    if (item.email) {
        return item.name + ', ' + phone + ', ' + item.email;
    }

    return item.name + ', ' + phone;
}

// callback форматирует телефонный номер по шаблону +7 (555) 666-77-88
function rewritePhoneNumber(acc, item, index) {
    var newNumber = '';
    switch (index) {
        case 0:
            newNumber += ('+7 (' + item);
            break;
        case 2:
            newNumber += (item + ') ');
            break;
        case 5:
            newNumber += (item + '-');
            break;
        case 7:
            newNumber += (item + '-');
            break;
        default:
            newNumber += item;
    }

    return acc + newNumber;
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
    var count = 0;
    var newArr = csv.split('\n');

    for (var i = 0; i < newArr.length; i++) {
        var parseItem = newArr[i].split(';');
        var resultAfterAdd = exports.add(parseItem[1], parseItem[0], parseItem[2]);
        var resultAfterUpdate = exports.update(parseItem[1], parseItem[0], parseItem[2]);
        if (resultAfterUpdate || resultAfterAdd) {
            count++;
        }
    }

    return count;
};
