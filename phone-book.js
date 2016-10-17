'use strict';

exports.isStar = true;

var phoneBook = [];

exports.add = function (phone, name, email) {
    if (argumentsIsValid(phone, name, email) && findPositionByPhone(phone) === -1) {
        var entryToAdd = {
            name: name,
            phone: phone
        };

        if (email !== undefined) {
            entryToAdd.email = email;
        }

        phoneBook.push(entryToAdd);

        return true;
    }

    return false;
};

function phoneIsValid(phone) {
    var phonePattern = /^\d{10}$/;

    return phonePattern.test(phone);
}

function emailIsValid(email) {

    return typeof email === 'string';
}

function nameIsValid(name) {

    return ((typeof name === 'string') && name !== '');
}

function argumentsIsValid(phone, name, email) {
    return nameIsValid(name) && phoneIsValid(phone) &&
    (emailIsValid(email) || email === undefined);
}

function findPositionByPhone(phone) {
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].phone === phone) {

            return i;
        }
    }

    return -1;
}

exports.update = function (phone, name, email) {
    if (!argumentsIsValid(phone, name, email)) {

        return false;
    }
    var position = findPositionByPhone(phone);
    if (position === -1) {
        return false;
    }
    phoneBook[position].name = name;
    if (email !== undefined) {
        phoneBook[position].email = email;
    } else {
        delete phoneBook[position].email;
    }

    return true;
};

exports.findAndRemove = function (query) {
    if (query === '*') {
        var removedCount = phoneBook.length;
        phoneBook = [];

        return removedCount;
    }
    var searchResult = search(query);
    if (searchResult === false) {
        return 0;
    }
    var positionsToRemove = searchResult.slice();
    for (var i = 0; i < searchResult.length; i++) {
        removePosition(positionsToRemove.shift());
        for (var j = 0; j < positionsToRemove.length; j++) {
            positionsToRemove[j]--;
        }
    }

    return searchResult.length;

};

function removePosition(position) {
    if (position === 0) {
        phoneBook.shift();
    }
    if (position === phoneBook.length) {
        phoneBook.pop();
    } else {
        phoneBook.splice(position, 1);
    }
}

exports.find = function (query) {
    if (typeof query !== 'string' || query === '') {

        return [];
    }

    var resultsArray;

    if (query === '*') {
        resultsArray = phoneBook;
    } else {
        var resultsPositions = search(query);
        if (resultsPositions.length === 0) {

            return [];
        }
        resultsArray = compileArrayByPositions(resultsPositions);
    }

    return renderSearchResult(resultsArray);

};

function renderSearchResult(resultsArray) {
    var renderedResult = [];
    var renderedEntry;
    resultsArray = sortArrayByName(resultsArray);
    for (var i = 0; i < resultsArray.length; i++) {
        renderedEntry = renderEntry(resultsArray[i].name,
        resultsArray[i].phone, resultsArray[i].email);
        renderedResult.push(renderedEntry);
    }

    return renderedResult;
}

function renderEntry(name, phone, email) {
    if (email === undefined) {

        return name + ', ' + renderPhone(phone);
    }

    return name + ', ' + renderPhone(phone) + ', ' + email;
}

function renderPhone(phone) {
    return '+7 (' + phone.slice(-10, -7) + ') ' +
    phone.slice(-7, -4) + '-' + phone.slice(-4, -2) + '-' + phone.slice(-2);
}

function search(query) {
    if (query === '' || typeof query !== 'string') {

        return false;
    }
    if (query === '*') {
        return phoneBook.split();
    }
    var postionsArray = [];
    for (var i = 0; i < phoneBook.length; i++) {
        if (findedInEntry(query, i)) {
            postionsArray.push(i);
        }
    }

    return postionsArray;

}

function findedInEntry(query, index) {
    for (var key in phoneBook[index]) {
        if (phoneBook[index][key].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
            return true;
        }
    }

    return false;
}

function compileArrayByPositions(positionsArray) {
    var resultArray = [];
    for (var i = 0; i < positionsArray.length; i++) {
        resultArray.push(phoneBook[i]);
    }

    return resultArray;
}

function sortArrayByName(entriesArray) {
    var resultArray = entriesArray.slice();
    resultArray.sort(compareEntriesByName);

    return resultArray;
}

function compareEntriesByName(entryA, entryB) {
    if (entryA.name > entryB.name) {

        return 1;
    }
    if (entryA.name < entryB.name) {

        return -1;
    }
}

function addOrUpdateEntry(name, phone, email) {
    if (exports.add(phone, name, email)) {

        return true;
    }

    if (exports.update(phone, name, email)) {

        return true;
    }

    return false;
}

exports.importFromCsv = function (csv) {
    if (typeof csv !== 'string' || csv === '') {
        return 0;
    }
    var entriesArray = csv.split('\n');
    var entryFields = [];
    var notChangedCount = 0;
    for (var i = 0; i < entriesArray.length; i++) {
        entryFields = entriesArray[i].split(';');
        if (entryFields.length > 3 ||
        !addOrUpdateEntry (entryFields[0], entryFields[1], entryFields[2])) {
            notChangedCount++;
        }
    }

    return csv.split('\n').length - notChangedCount;
};
