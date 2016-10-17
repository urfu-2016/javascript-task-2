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
 * Проверка на корректность
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.isCorrect = function (phone, name, email) {
    var cPhone = ((/\d{9}/.test(phone)) && (phone[0] === phone[1]) &&
    (phone[1] === phone[2]) && (phone[3] === phone[4]) &&
    (phone[4] === phone[5]) && (phone[6] === phone[7]) && (phone[8] === phone[9]));
    var cName = (typeof name === 'string' && name.length > 0);
    var cEmail = ((typeof email === 'string') || (typeof email === 'undefined'));

    return (cName && cPhone && cEmail);
};

 /** Проверка на наличие в массиве
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Number} индекс вхождения
 */
exports.indexOf = function (phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        var note = phoneBook[i];
        if (note.phone === phone) {
            return i;
        }
    }

    return -1;
};

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.add = function (phone, name, email) {
    if (exports.indexOf(phone) === -1 && exports.isCorrect(phone, name, email)) {
        if (typeof email === 'undefined') {
            phoneBook.push({ 'phone': phone, 'name': name });
        } else {
            phoneBook.push({ 'phone': phone, 'name': name, 'email': email });
        }

        return true;
    }

    return false;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean}
 */
exports.update = function (phone, name, email) {
    if (name === '') {
        return false;
    }
    if (exports.indexOf(phone) !== -1 && exports.isCorrect(phone, name, email)) {
        var note = phoneBook[exports.indexOf(phone)];
        note.name = name;
        if (typeof email === 'undefined') {
            delete note.email;
        } else {
            note.email = email;
        }

        return true;
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} количество удаленных записей
 */
exports.findAndRemove = function (query) {
    var result = [];
    var deletedNote = phoneBook.length;
    if (query === '') {
        return 0;
    }
    if (query === '*') {
        var j = phoneBook.length;
        phoneBook = [];

        return j;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        var note = phoneBook[i];
        if (!(exports.findInNote (note, query))) {
            result.push({ 'email': note.email, 'name': note.name,
            'phone': exports.phoneToPrint(note.phone) });
            deletedNote--;
        }

    }
    phoneBook = result;

    return deletedNote;
};

/**
 * Поиск по всем аргументам записи
 * @param {Object} note
 * @param {String} query
 * @returns {Boolean}
 */
exports.findInNote = function (note, query) {
    var key = Object.keys(note);
    for (var i = 0; i < key.length; i++) {
        if ((note[key[i]] !== 'underfind') && (note[key[i]].indexOf(query) !== -1)) {
            return true;
        }
    }

    return false;
};

/**
 * Приведение телефона к формату вывода на экран
 * @param {String} phone
 * @returns {String} строка для вывода на экран
 */
exports.phoneToPrint = function (phone) {
    return '+7 (' + phone.substr(0, 3) + ') ' + phone.substr(3, 3) + '-' +
    phone.substr(6, 2) + '-' + phone.substr(8, 2);
};

/**
 * Приведение всей записи к формату вывода на экран
 * @param {Object} note
 * @returns {String} строка для вывода на экран
 */
exports.noteToPrint = function (note) {
    var line = '';
    if (typeof note.email === 'undefined') {
        line = note.name + ', ' + exports.phoneToPrint(note.phone);
    } else {
        line = note.name + ', ' + exports.phoneToPrint(note.phone) + ', ' + note.email;
    }

    return line;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} массив найденных записей
 */
exports.find = function (query) {
    if (query === '') {
        return [];
    }
    var result = [];

    if (query === '*') {
        for (var j = 0; j < phoneBook.length; j++) {
            result.push(exports.noteToPrint(phoneBook[j]));
        }

        return result.sort();
    }
    for (var i = 0; i < phoneBook.length; i++) {
        var note = phoneBook[i];
        if (exports.findInNote (note, query)) {
            result.push(exports.noteToPrint(note));
        }
    }

    return result.sort();
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
    var listOfNotes = csv.split('\n');
    var countNotes = 0;
    for (var i = 0; i < listOfNotes.length; i++) {
        var note = listOfNotes[i].split(';');
        if (exports.update(note[1], note[0], note[2]) ||
        (exports.add(note[1], note[0], note[2]))) {
            countNotes++;
        }
    }

    return countNotes;
};
