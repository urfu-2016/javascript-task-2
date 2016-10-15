'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */
var phoneBook;

/** Добавлены дополнительные глобальные переменные
* Запись в телефонной книге
*/
var recPhoneBook;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.add = function (phone, name, email) {

    // Телефоны принимаются **только** в формате 5556667788 (без кода)
    if (!(/^\d{10}$/).test(phone)) {
        return false;
    }
    
    if (!correctName(name)) {
        return false;
    }

    /* Объявление переменной newRecPhoneBook
    * Новая запись в телефонной книге (тип: объект)
    * При объявлении заполняем данными, переданными в функцию
    */
    var newRecPhoneBook = {
        phone: phone,
        name: RemoveSpace(name),
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
 */
exports.update = function (phone, name, email) {

    if (!searchInPhoneBook(phone)) {
        return false;
    }

    if (correctName(name)) {
        recPhoneBook.name = RemoveSpace(name);
    }

    // а надо ли возвращать false если имя не дала поменять, а email записала???
    // email надо тоже проверить на правильность
    recPhoneBook.email = email;
    
    return true;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {

    if (typeof(query) !== 'string' || query === '') {
        return;
    }

    // Число удаленных записей (тип: целочисленный)
    var k = 0;
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
 */
exports.find = function (query) {
    // Вывод найденных записей (тип: объект, тип элементов: строка)
    var foundRec = [];

    if (typeof(query) !== 'string' || query === '') {
        return;
    }

    if (query === '*') {
        for (var i = 0; i < phoneBook.length; i++) {
            recPhoneBook = phoneBook[i];
            foundRec.push(recPhoneBook.name + ', ' + formatPhone(recPhoneBook.phone) +
                           ((recPhoneBook.email !== undefined) ? (', ' + recPhoneBook.email) : ('')));
        }
    } else {
        for (var i = 0; i < phoneBook.length; i++) {
            recPhoneBook = phoneBook[i];
            if (findQuery(query)) {
                foundRec.push(recPhoneBook.name + ', ' + formatPhone(recPhoneBook.phone) +
                              ((recPhoneBook.email !== undefined) ? (', ' + recPhoneBook.email) : ('')));
            }
        }
    }

    foundRec.sort(compareName);

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

    if (typeof(csv) !== 'string' || csv === '') {
        return;
    }

    // разбиваем по строкам. в каждой строке новый контакт
    var arrayStr = csv.split('\n');
    // Информация о контакте
    var InfoRec,
        // Количество добавленных/обновленных записей
        k = 0;

    for (var i = 0; i < arrayStr.length; i++) {
        // разбиваем информацию о контакте
        InfoRec = arrayStr[i].split(';');

        if (exports.add(InfoRec[1], InfoRec[0], InfoRec[2])) {
            k++;
        } else {
            if (exports.update(InfoRec[1], InfoRec[0], InfoRec[2])) {
                k++;
            }
        }
    }

    return k;

    //return csv.split('\n').length;
};

// *** *** Добавленные функции *** ***

/**
 * Удаление пробелов из имени (в начале, в конце)
 * между словами по одному пробелу остается
 * @param {String} str
 */
function RemoveSpace(str) {

    return str.replace(/(^\s+)|(\s+$)/g, '').replace(/\s+/g, ' ');
}

/**
 * Проверка корректно заданного имени
 * @param {String} str
 */
function correctName(str) {

    if (str === undefined) {
        return false;
    }
    str = RemoveSpace(str);

    return (str.lenght !== 0);
}

/**
 * Проверка на наличие записи с таким номером в телефонной книге
 * @param {String} phone
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
 */
function findQuery(query) {

    for (var key in recPhoneBook) {
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
 */
function formatPhone(phone) {

    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' + phone.slice(6, 8) + '-' + phone.slice(8);
}

/**
 * Сортировка
 */
function compareName(peopleA, peopleB) {

    return peopleA > peopleB;
}
