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
 * Добавлены дополнительные глобальные переменные
 * Запись в телефонной книге
 */
var recPhoneBook;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.add = function (phone, name, email) {

    // Телефоны принимаются **только** в формате 5556667788 (без кода) // было /^\d{10}$/
    if (!(phone !== undefined && !isNaN(Number(phone)) &&
        typeof(phone) === 'string' && (/^\d{10}$/).test(phone))) {
        return false;
    }

    if (!correctName(name)) {
        return false;
    }

    if (!correctEmail(email)) {
        email = '';
    }

    /**
    * Объявление переменной newRecPhoneBook
    * Новая запись в телефонной книге (тип: объект)
    * При объявлении заполняем данными, переданными в функцию
    */
    var newRecPhoneBook = {
        phone: phone,
        name: removeSpace(name),
        email: email
    };

    // Не добавляет **уже существующую** запись
    if (searchInPhoneBook(phone)) {
        return false;
    }

    // Добавление в телефонную книгу
    phoneBook.push(newRecPhoneBook);

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

    if (!searchInPhoneBook(phone)) {
        return false;
    }

    if (correctName(name)) {
        recPhoneBook.name = removeSpace(name);
    }

    if (correctEmail(email)) {
        recPhoneBook.email = email;
    } else {
        recPhoneBook.email = '';
    }

    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} - количество удаленных записей
 */
exports.findAndRemove = function (query) {

    // if (typeof(query) !== 'string' || query === '') {
    if (!(typeof(query) === 'string' && query.length > 0)) {
        return 0;
    }

    // Число удаленных записей (тип: целочисленный)
    var k = 0;
    if (query === '*') {
        k = phoneBook.length;
        phoneBook = [];

        return k;
    }

    for (var i = 0; i < phoneBook.length; i++) {
        recPhoneBook = phoneBook[i];
        if (findQuery(query)) {
            phoneBook.splice(i, 1);
            k++;
            i--;
        }
    }

    // Возвращает число удаленных записей
    return k;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} foundRec
 */
exports.find = function (query) {
    // Вывод найденных записей (тип: объект, тип элементов: строка)
    var foundRec = [];
    var i;

    // if (typeof(query) !== 'string' || query === '') {
    if (!(typeof(query) === 'string' && query.length > 0)) {
        return [];
    }

    for (i = 0; i < phoneBook.length; i++) {
        recPhoneBook = phoneBook[i];
        if (query === '*') {
            foundRec.push(returnRec());
        } else if (findQuery(query)) {
            foundRec.push(returnRec());
        }
    }

    foundRec.sort(); // foundRec.sort(compareName);

    // а что, если не найдено ничего??
    return foundRec;
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

    // if (typeof(csv) !== 'string' || csv === '') {
    //    return 0;
    // }

    // разбиваем по строкам. в каждой строке новый контакт
    var arrayStr;
    // Информация о контакте
    var InfoRec;
    // Количество добавленных/обновленных записей
    var k = 0;

    arrayStr = csv.split('\n');

    for (var i = 0; i < arrayStr.length; i++) {
        // разбиваем информацию о контакте
        InfoRec = arrayStr[i].split(';');

        if (exports.add(InfoRec[1], InfoRec[0], InfoRec[2])) {
            k++;
        } else if (exports.update(InfoRec[1], InfoRec[0], InfoRec[2])) {
            k++;
        }
    }

    return k;

    // return csv.split('\n').length;
};

/**
 * Удаление пробелов из имени (в начале, в конце)
 * между словами по одному пробелу остается
 * @param {String} str
 * @returns {String}
 */
function removeSpace(str) {

    return str.replace(/(^\s+)|(\s+$)/g, ''); // .replace(/\s+/g, ' ');
}

/**
 * Проверка корректно заданного имени
 * @param {String} str
 * @returns {Boolean}
 */
function correctName(str) {

    if (str === undefined) {
        return false;
    }
    str = removeSpace(str);

    return (str.length !== 0);
}

/**
 * Проверка корректно заданной электронной почты
 * @param {String} str
 * @returns {Boolean}
 */
function correctEmail(str) {

    if (str === undefined || typeof(str) !== 'string') {
        return false;
    }
    // str = /^[a-z0-9_\.-]+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i.test(str);
    str = str.trim();

    return (str.length !== 0  && str.indexOf('@') !== -1);
    // str = str.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.\.[a-zA-Z]{2,}$/);

    // return str !== null || str !== '';
}

/**
 * Проверка на наличие записи с таким номером в телефонной книге
 * @param {String} phone
 * @returns {Boolean}
 */
function searchInPhoneBook(phone) {

    for (var i = 0; i < phoneBook.length; i++) {
        recPhoneBook = phoneBook[i];
        if (recPhoneBook.phone === phone) {
            return true;
        }
    }

    return false;
}

/**
 * Поиск по значениям ключа объекта
 * Ищет вхождение этой строки хотя бы в одно из полей «Телефон», «Имя» и «Электронную почту»
 * @param {String} query
 * @returns {Boolean}
 */
function findQuery(query) {

    for (var key in recPhoneBook) {
        // проверяю на undefined, потому что почта может быть не задана
        if (recPhoneBook[key] !== undefined &&
            (recPhoneBook[key].toLowerCase()).indexOf(query.toLowerCase()) > -1) {
            return true;
        }
    }

    return false;
}

/**
 * Возврат формата телефона
 * @param {String} phone
 * @returns {String}
 */
function formatPhone(phone) {

    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) +
        '-' + phone.slice(6, 8) + '-' + phone.slice(8);
}

// Сортировка
// function compareName(peopleA, peopleB) {

//    return peopleA > peopleB;
// }

/**
 * Возврат записи телефонной книги по образцу
 * @returns {String}
 */
function returnRec() {

    return recPhoneBook.name + ', ' + formatPhone(recPhoneBook.phone) +
        ((recPhoneBook.email !== '') ? (', ' + recPhoneBook.email) : (''));
}
