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

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.add = function (phone, name, email) {
    if (!isCorrectData(phone, name)) {
        return false;
    }
    if (email === undefined) {
        email = '';
    }
    phoneBook.push({
        phone: phone,
        name: name,
        email: email
    });

    return true;
};

function isCorrectData(phone, name) {
    var i;
    if (name === undefined || phone.match(/\d/g).length !== 10) {
        return false;
    }
    for (i = 0; i < phoneBook.length; i++) {
        if (phone === phoneBook[i].phone) {
            return false;
        }
    }

    return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function (phone, name, email) {
    var i;
    if (name === undefined) {
        return false;
    }
    for (i = 0; i < phoneBook.length; i++) {
        if (phone === phoneBook[i].phone) {
            phoneBook[i].name = name;
            phoneBook[i].email = email;
            return true;
        }
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    var i;
    var counter = 0;
    var entries = entriesToString();
    for (i = 0; i < phoneBook.length; i++) {
        if (entries[i].indexOf(query) !== -1 && query !== '') {
            entries.splice(i,1);
            phoneBook.splice(i,1);
            i--;
            counter++;
        }
    }

    return counter;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    var result = [];
    var i;
    var entries = entriesToString();
    if (query === '*') {
        return allEntries();
    }
    for (i = 0; i < entries.length; i++) {
        if (entries[i].indexOf(query) !== -1 && query !== '') {
            result.push(phoneToFormat(entries[i]));
        }
    }

    return result;
};

 function entriesToString() {
    var result = [];
    var entry;
    var i;
    for(i = 0; i < phoneBook.length; i++) {
        entry = phoneBook[i].phone + ' ' + phoneBook[i].name;
        if (phoneBook[i].email !== '' && phoneBook[i].email !== undefined) {
            entry += ' ' + phoneBook[i].email;
        }
        result.push(entry);
    }

    return result;
 }

 function phoneToFormat(entry) {
     var phoneFormat;
     var p = entry.slice(0,10);
     phoneFormat = '+7 (' + p.slice(0,3) + ') ' + p.slice(3,6) + ' ' + p.slice(6,8) + ' ' +  p.slice(8,10);

     return phoneFormat + entry.slice(10);
 }

 function allEntries() {
     var i;
     var result = [];
     var entries = entriesToString();
     for (i = 0; i < entries.length; i++) {
         result.push(phoneToFormat(entries[i]));
     }

     return result;
 }

 function isEntryExist(csvArray) {
     var i;
     for (i = 0; i < phoneBook.length; i++) {
         if (csvArray[1] === phoneBook[i].phone) {
             phoneBook[i].phone = csvArray[1];
             phoneBook[i].name = csvArray[0];
             phoneBook[i].email = csvArray[2];
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
    var i;
    var parseCSV = csv.split(/\s/g);
    var counter = parseCSV.length;
    for (i = 0; i < parseCSV.length; i++) {
        parseCSV[i] = parseCSV[i].split(';');
        if (parseCSV[i][0] === undefined || parseCSV[i][1].match(/\d/g).length !== 10) {
            counter--;
            break;
        }
        if (!isEntryExist(parseCSV[i])) {
            phoneBook.push({
                phone: parseCSV[i][1],
                name: parseCSV[i][0],
                email: parseCSV[i][2]
            });
        }
    }

    return counter;
};
