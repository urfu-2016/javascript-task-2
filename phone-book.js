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

exports.add = function (phone, name, email) {

    function isInputCorrect() {
        function phoneIsCorrect() {
            if (typeof(phone) === 'number') {
                phone = phone.toString();
            }

            if (typeof(phone) === 'string') {
                phone = phone.trim();
                if (phone.match(/^\d{10}$/gi) !== null) {

                    return true;
                }
            }

            return false;
        }

        function nameIsCorrect() {
            if (typeof(name) !== 'string' || name === '') {

                return false;
            }

            name = name.trim();

            return true;
        }

        function emailIsCorrect() {
            if (typeof(email) === 'string') {
                email = email.trim();

                return (email !== '');
            }

            if (email === null) {
                email = undefined;
            }

            if (email === undefined) {

                return true;
            }

            return false;
        }


        if (phoneIsCorrect() && nameIsCorrect() && emailIsCorrect()) {

            return true;
        }

        return false;
    }

    function phoneIsAlreadyInPhoneBook() {
        function phoneMatch(currentNote) {

            return currentNote.phone === phone;
        }

        return phoneBook.some(phoneMatch);
    }

    if (!isInputCorrect()) {

        return false;
    }

    if (phoneIsAlreadyInPhoneBook()) {

        return false;
    }

    var note = {
        phone: phone,
        name: name,
        email: email
    };

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
    function isInputCorrect() {
        function phoneIsCorrect() {
            if (typeof(phone) === 'number') {
                phone = phone.toString();
            }

            if (typeof(phone) === 'string') {
                phone = phone.trim();
                if (phone.match(/^\d{10}$/gi) !== null) {

                    return true;
                }
            }

            return false;
        }

        function nameIsCorrect() {
            if (typeof(name) !== 'string' || name === '') {

                return false;
            }

            name = name.trim();

            return true;
        }

        function emailIsCorrect() {
            if (typeof(email) === 'string') {
                email = email.trim();

                return (email !== '');
            }

            if (email === null) {
                email = undefined;
            }

            if (email === undefined) {

                return true;
            }

            return false;
        }

        if (phoneIsCorrect() && nameIsCorrect() && emailIsCorrect()) {

            return true;
        }

        return false;
    }

    if (!isInputCorrect()) {

        return false;
    }

    function findNote(note) {

        return note.phone === phone;
    }

    var targetIndex = phoneBook.findIndex(findNote);

    if (targetIndex !== -1) {
        phoneBook[targetIndex].email = email;
        if (name !== undefined) {
            phoneBook[targetIndex].name = name;
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
    var numberOfDeletedNotes;

    function isNoteMatchQuery(note, index) {

        var keys = Object.keys(note);

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = note[key];
            if (value === undefined) {
                continue;
            }
            if (value.indexOf(query) !== -1) {
                indexesOfFindedNotes.push(index);
                break;
            }
        }
    }

    function deleteNotes() {

        for (var i = 0; i < indexesOfFindedNotes.length; i++) {
            var indexToDelete = indexesOfFindedNotes[i];
            phoneBook.splice(indexToDelete, 1);
        }
    }

    if (typeof(query) === 'number') {
        query = query.toString();
    }

    if (typeof(query) !== 'string' || query === '') {

        numberOfDeletedNotes = 0;
    }

    if (query === '*') {
        numberOfDeletedNotes = phoneBook.length;
        phoneBook = [];
    } else {

        phoneBook.forEach(isNoteMatchQuery);
        numberOfDeletedNotes = indexesOfFindedNotes.length;
        deleteNotes();
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
            if (note.email !== undefined) {
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
            if (value.indexOf(query) !== -1) {

                return true;
            }
        }

        return false;
    }


    if (typeof(query) === 'number') {
        query = query.toString();
    }
    if (query === '*') {
        arrayOfFindedNotes = phoneBook.slice();
    } else if (typeof(query) === 'string' && query !== '') {
        arrayOfFindedNotes = phoneBook.filter(isNoteMatchQuery);
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
