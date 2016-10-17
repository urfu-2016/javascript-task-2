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


function checkToCorrectNumber(phoneNumber) {
    if (typeof phoneNumber !== 'string') {
        return false;
    }
    if (phoneNumber.length !== 10) {
        return false;
    }
    for (var i = 0; i < phoneNumber.length; i++) {
        if (!(phoneNumber[i] >= '0' && phoneNumber[i] <= '9')) {
            return false;
        }
    }

    return true;
}


function createRecord(phone, name, email) {
    var record = {};
    record.phone = phone;
    record.name = name;
    record.email = email;

    return record;
}


function checkToCorrectName(name) {
    return typeof name === 'string' && name.length !== 0;
}


function checkHaveRecordViaPhone(record) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === record.phone) {
            return true;
        }
    }

    return false;
}


/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.add = function (phone, name, email) {

    /*
    Метод add для добавления записей:

    На вход принимает «Телефон», «Имя» и «Электронную почту»
    Возвращает true или false в зависимости от успеха опереации
    Телефоны принимаются только в формате 5556667788 (без кода)
    Не добавляет уже существующую запись
    Не добавляет запись без имени
    */
    var record = createRecord(phone, name, email);
    if (!checkToCorrectNumber(record.phone) || !checkToCorrectName(record.name) ||
        checkHaveRecordViaPhone(record)) {
        return false;
    }
    phoneBook.push(record);

    return true;
};


/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.update = function (phone, name, email) {

    /*
     Метод update для обновления записей:

     На вход принимает «Телефон», «Имя» и «Электронную почту»
     Обновляет «Имя» и «Электронную почту» по заданному «Телефону»
     Возвращает true или false в зависимости от успеха опереации
     «Электронную почту» можно стереть (не передав последний параметр), а «Имя» – нет
     */
    if (!checkToCorrectName(name)) {
        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {
            phoneBook[i].name = name;
            phoneBook[i].email = email;

            return true;
        }
    }

    return false;
};


function bypassingPhoneBook(phoneForRemoval) {
    for (var j = 0; j < phoneBook.length; j++) {
        var phoneFromBook = formatPhoneNumber(phoneBook[j].phone);
        if (phoneForRemoval === phoneFromBook) {
            phoneBook.splice(j, 1);

            return;
        }
    }
}


/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
exports.findAndRemove = function (query) {

    /*
     Метод findAndRemove для удаления записей:

     На вход принимает запрос в виде строки
     Находит (смотри find) и удаляет все найденные записи
     Возвращает число удаленных записей
     В файле index.js вы можете найти примеры использования получившегося скриптика.
     */
    var foundedArrayOfRecords = exports.find(query);
    for (var i = 0; i < foundedArrayOfRecords.length; i++) {
        var phoneForRemoval = foundedArrayOfRecords[i].split(', ')[1];
        bypassingPhoneBook(phoneForRemoval);
    }

    return foundedArrayOfRecords.length;
};


function findSubstringInAllField(record, query) {
    return record.name.indexOf(query) !== -1 || record.phone.indexOf(query) !== -1 ||
        (record.email !== undefined && record.email.indexOf(query) !== -1);
}


function deepCopyPhoneBook() {
    var copyBook = [];
    for (var i = 0; i < phoneBook.length; i++) {
        copyBook.push({ phone: phoneBook[i].phone, name: phoneBook[i].name,
                    email: phoneBook[i].email });
    }

    return copyBook;
}


function findAllSuitableElements(query) {
    if (query === '*') {

        return deepCopyPhoneBook();
    }
    if (query === '') {

        return [];
    }
    var arrayOfRecords = [];
    for (var i = 0; i < phoneBook.length; i++) {
        if (findSubstringInAllField(phoneBook[i], query)) {
            arrayOfRecords.push(phoneBook[i]);
        }
    }

    return arrayOfRecords;
}


function formatPhoneNumber(phone) {
    var goodNumber = '+7 (';
    goodNumber += phone.slice(0, 3);
    goodNumber += ') ';
    goodNumber += phone.slice(3, 6);
    goodNumber += '-';
    goodNumber += phone.slice(6, 8);
    goodNumber += '-';
    goodNumber += phone.slice(8, 10);

    return goodNumber;
}


function formatAllPhoneNumbers(arrayOfRecords) {
    for (var i = 0; i < arrayOfRecords.length; i++) {
        arrayOfRecords[i].phone = formatPhoneNumber(arrayOfRecords[i].phone);
    }
}


function formatObjectToStr(arrayOfRecords) {
    var arrayOfStr = [];
    for (var i = 0; i < arrayOfRecords.length; i++) {
        var recordInStr;
        if (arrayOfRecords[i].email !== undefined) {
            recordInStr = arrayOfRecords[i].name + ', ' + arrayOfRecords[i].phone + ', ' +
                arrayOfRecords[i].email;
        } else {
            recordInStr = arrayOfRecords[i].name + ', ' + arrayOfRecords[i].phone;
        }
        arrayOfStr.push(recordInStr);
    }

    return arrayOfStr;
}


/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Object}
 */
exports.find = function (query) {

    /*
     Метод find для поиска записей:

     На вход принимает запрос в виде строки
     Ищет вхождение этой строки хотя бы в одно из полей «Телефон», «Имя» и «Электронную почту»
     Возвращает отсортированный по «Имени» массив строк в формате name, phone, email
     «Имя» и «Электронную почту» выводит как есть, а «Телефон» в формате +7 (555) 666-77-88
     Пустой запрос не должен ничего находить
     Запрос «*» находит все записи
     */
    var arrayOfRecords = findAllSuitableElements(query);
    arrayOfRecords.sort(function (a, b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }

        return 0;
    });
    formatAllPhoneNumbers(arrayOfRecords);

    return formatObjectToStr(arrayOfRecords);
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
    /*
     По одной добавлять записи в книгу не очень удобно, поэтому будет здорово, если вы добавите
     в решение импорт данных из csv. Для этого реализуйте код метода importFromCsv.

     На вход метод принимает строку в формате csv. Если запись в телефонной книги уже есть –
     обновляет/дополняет её данными из csv строки. На выходе метод возвращает одно число
     добавленных/обновленных записей.

     Пример работы этого метода вы может отыскать в index.js и в тестах.
     */
    var arrayOfRecordInStr = csv.split('\n');
    var counterForChangesRecords = 0;
    for (var i = 0; i < arrayOfRecordInStr.length; i++) {
        var arrayOfFields = arrayOfRecordInStr[i].split(';');
        var name = arrayOfFields[0];
        var phone = arrayOfFields[1];
        var email = arrayOfFields[2];
        if (exports.add(phone, name, email) || exports.update(phone, name, email)) {
            counterForChangesRecords ++;
        }

    }

    return counterForChangesRecords;
};
