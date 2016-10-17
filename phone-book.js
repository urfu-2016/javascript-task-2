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
 */
exports.add = function (phone, name, email) {
    var object = {
        _phone: phone,
        _name: name,
        _email: email
    };
    if (name === '') {
        return false;
    }
    if (phone.length !== 10) {
        return false;
	}
    for (var i = 0; i < phoneBook.length; i++) {
        if (isConstains(phoneBook[i], object)) {
            return false;
		}
    }
    phoneBook.push(object);
	return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 */
exports.update = function (phone, name, email) {
    if (name === '') {
        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i]._phone === phone) {
            phoneBook[i]._name = name;
            phoneBook[i]._email = email;           
            return true;
		} else {
            return false;
        }
    }
    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 */
exports.findAndRemove = function (query) {
    if (query === '') {
        return 0;
    }
	if (query === '*') {    
        var x = phoneBook.length();
        phoneBook = [];
        return x;
    }
	var t = 0;
    for (var i = 0; i < phoneBook.length; i++) {
		if (isFound(phoneBook[i],query)) {
            phoneBook.splice(i,1);
            t = t + 1;
    }
    return t;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 */
exports.find = function (query) {
    var arr = [];
    var phoneBook1 = phoneBook.sort(compareFunction);
    if (query === '') {
        return '';
    }
	if (query === '*') {    
		for (var i = 0; i < phoneBook1.length; i++) {
			var str = phoneBook1[i]._phone;
			var x1 = str.substring(0,3);
			var x2 = str.substring(3,6);
			var x3 = str.substring(6,8);
			var x4 = str.substring(8,10);
            arr.push(phoneBook1[i]._name + ', ' + '7 (' + x1 + ') ' + x2 + '-' + x3 + '-' + x4 + ', ' + phoneBook[i]._email);
		}
        return arr;
    }
    for (var i = 0; i < phoneBook1.length; i++) {
		if (isFound(phoneBook1[i],query)) {
            var str = phoneBook1[i]._phone;
            var x1 = str.substring(0,3);
            var x2 = str.substring(3,6);
            var x3 = str.substring(6,8);
            var x4 = str.substring(8,10);
            arr.push(phoneBook1[i]._name + ', ' + '7 (' + x1 + ') ' + x2 + '-' + x3 + '-' + x4 + ', ' + phoneBook[i]._email);
        }
    }
    return arr;
    console.log(arr.length);
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

    return csv.split('\n').length;
};
