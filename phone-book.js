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
    var phoneBookData = {};
    var inputPhone = validateInputPhone(phone);
    var inputName = validateInputName(name);

    if (!inputPhone || !inputName) {
        return false;
    }

    phoneBookData = { phone: phone, name: name, email: email };
    phoneBook.push(phoneBookData);

    return true;
};

function validateInputPhone(phone) {
    var regPhone = /^\b[\d]{10}\b$/m;

    if (!regPhone.test(phone) || typeof phone !== 'string') {
        return false;
    }

    if (!setRecordStatus(phone)) {
        return false;
    }

    return true;
}

function validateInputName(name) {

    if (!name || typeof name !== 'string' || name === undefined) {
        return false;
    }

    return true;
}

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
    if (!regPhone.test(phone) || typeof phone !== 'string') {
        return false;
    }

    if (!validateInputName(name)) {
        return false;
    }
    var count = phoneBook.filter(searchByPhone).length !== 0;
    phoneBook.forEach(searchByPhone);

    // callback функция для проверки существования телефона и обнавления данных
    function searchByPhone(item) {
        if (item.phone === phone && (item.name !== name || item.email !== email)) {
            item.name = name;
            item.email = email;

            return true;
        }

        return false;
    }

    return count;
};

/*
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {

    if (!query || typeof query !== 'string') {
        return 0;
    }

    return findForRemove(query);
};

// callback функция проверяет вхождения запроса для удаления контакта
function findForRemove(query) {
    var deleted = 0;
    for (var i = phoneBook.length - 1; i >= 0; i--) {
        var queryPhone = phoneBook[i].phone;
        var queryName = phoneBook[i].name;
        var queryEmail = phoneBook[i].email;
        if (queryPhone.indexOf(query) !== -1 || queryName.indexOf(query) !== -1 ||
            query === '*' || (queryEmail && queryEmail.indexOf(query) !== -1)) {
            phoneBook.splice(i, 1);
            deleted++;
        }
    }

    return deleted;
}

/*
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {

    if (!query || typeof query !== 'string') {
        return [];
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
            var res = item[objectItem[i]] || '';
            if (res.indexOf(query) !== -1) {
                return true;
            }
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
    if (typeof csv !== 'string') {
        return 0;
    }

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
