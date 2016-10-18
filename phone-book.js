'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = false;

/**
 * Телефонная книга
 */
var phoneBook = [];

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} if the note was added to phoneBook or not
 */

function phoneIsCorrect(phone) {


    if (typeof(phone) === 'string') {
        phone = phone.trim();

        if (phone.match(/^\d{10}$/gi) !== null) {

            return true;
        }
    }

    return false;
}

function nameIsCorrect(name) {

    return typeof(name) === 'string' && name !== '';
}

function emailIsCorrect(email) {

    if (email === undefined || email === null) {

        return true;
    }

    if (typeof(email) === 'string') {
        email = email.trim();
        if (email.match(/^\S+@\S+\.\S+$/gi) !== null) {

            return true;
        }
    }

    return false;
}

function inputCheck(phone, name, email) {

    if (phoneIsCorrect(phone) && nameIsCorrect(name) && emailIsCorrect(email)) {

        return true;
    }

    return false;
}

function deleteNotes(indexesOfFindedNotes) {

    for (var i = 0; i < indexesOfFindedNotes.length; i++) {
        var indexToDelete = indexesOfFindedNotes[i];
        phoneBook.splice(indexToDelete, 1);
    }

    return;
}


exports.add = function (phone, name, email) {

    function phoneIsAlreadyInPhoneBook() {
        function phoneMatch(currentNote) {

            return currentNote.phone === phone;
        }

        return phoneBook.some(phoneMatch);
    }




    if (!inputCheck(phone, name, email)) {

        return false;
    }

    phone = phone.trim();
    name = name.trim();

    if (phoneIsAlreadyInPhoneBook()) {

        return false;
    }

    var note = {
        phone: phone,
        name: name,
    };

    if (email === null || email === undefined) {
        note.email = undefined;
    } else {
        email = email.trim();
        note.email = email;
    }

    phoneBook.push(note);

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} if the note was updated or not
 */
exports.update = function (phone, name, email) {
    function findNote(note) {

        return note.phone === phone;
    }

    if (!inputCheck(phone, name, email)) {

        return false;
    }

    phone = phone.trim();
    name = name.trim();

    var targetIndex = phoneBook.findIndex(findNote);


    if (targetIndex !== -1) {

        phoneBook[targetIndex].name = name;
        if (email === null || email === undefined) {
            phoneBook[targetIndex].email = undefined;
        } else {
            email = email.trim();
            phoneBook[targetIndex].email = email;

        }

        return true;
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} number of deleted notes
 */
exports.findAndRemove = function (query) {
    var indexesOfFindedNotes = [];
    var numberOfDeletedNotes = 0;

    function isNoteMatchQuery(note, index) {

        var keys = Object.keys(note);

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = note[key];
            if (value === undefined) {
                continue;
            }
            value = value.toLowerCase();
            if (value.indexOf(query.toLowerCase()) !== -1) {
                indexesOfFindedNotes.push(index);
                break;
            }
        }
    }


    if (typeof(query) === 'string') {
        query = query.trim();
        if (query === '*') {
            numberOfDeletedNotes = phoneBook.length;
            phoneBook = phoneBook.splice(0, numberOfDeletedNotes);
        } else if (query === '') {
            numberOfDeletedNotes = 0;
        } else {
            phoneBook.forEach(isNoteMatchQuery);
            numberOfDeletedNotes = indexesOfFindedNotes.length;
            deleteNotes(indexesOfFindedNotes);
        }
    }

    return numberOfDeletedNotes;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Object} array of strings, representing finded notes
 */
exports.find = function (query) {
    var arrayOfFindedNotes = [];

    function createResultStringArray(arrayOfNotes) {
        var resultStringArray = [];

        for (var i = 0; i < arrayOfNotes.length; i++) {
            var note = arrayOfNotes[i];
            var stringPhone = '+7 (' + note.phone.slice(0, 3) +
                ') ' + note.phone.slice(3, 6) + '-' + note.phone.slice(6, 8) +
                '-' + note.phone.slice(8, 10);

            var stringNote = note.name + ', ' + stringPhone;
            if (note.email) {
                stringNote = stringNote + ', ' + note.email;
            }

            resultStringArray.push(stringNote);
        }

        var sortedStringArray = resultStringArray.sort();

        return sortedStringArray;
    }

    function isNoteMatchQuery(note) {

        var keys = Object.keys(note);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = note[key];
            if (value === undefined) {
                continue;
            }
            value = value.toLowerCase();
            if (value.indexOf(query.toLowerCase()) !== -1) {

                return true;
            }
        }

        return false;
    }

    if (typeof(query) === 'string') {
        query = query.trim();
        if (query === '*') {
            arrayOfFindedNotes = phoneBook.slice();
        } else if (query === '') {
            arrayOfFindedNotes = [];
        } else {
            arrayOfFindedNotes = phoneBook.filter(isNoteMatchQuery);
        }
    }

    return createResultStringArray(arrayOfFindedNotes);

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

    return csv.split('\n').length;
};
