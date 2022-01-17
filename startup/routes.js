const express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');

var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
const authRouter = require('../routes/auth');
const calendarRouter = require('../routes/calendar');

module.exports = function(app){
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', indexRouter);
    app.use('/auth', authRouter);
    app.use('/calendar', calendarRouter);
    app.use('/users', usersRouter);
}