'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();
router.get('/authorize_user', controller.authorize_user);
router.get('/handleauth', controller.handleauth);
router.get('/search/:hashtag', controller.search);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);


module.exports = router;