var debug = require('debug')('parse')
    , $ = require('jquery')(require('jsdom').jsdom().defaultView)
    , _ = require('lodash')
    , request = require('superagent')
    , config = require('../config.json')
    , phantom = require('phantom')

var phInstance = null;
var sitePage = null;

config.sources.forEach(function(source){
    debug('Downloading from ' + source)
    requestWithPhantom(source)
    //requestWithSuperagent(source)
})

/**
 * WORK IN PROGRESS
 * webscraping with superagent
 * @param source
 */
function requestWithSuperagent(source){
    request.get(source)
        .end(function(err, res){
            if(err)
                return debug('Error:', err)

            debug('got response: ', res.text)
        })
}

/**
 * WORK IN PROGRESS
 * webscraping with phantomjs
 * @param source
 */
function requestWithPhantom(source){
    phantom.create()
        .then(function(instance){
            debug('created phantom instance')
            phInstance = instance
            return instance.createPage()
        })
        .then(function(page){
            debug('created page, opening ' + source)
            sitePage = page
            return page.open(source)
        })
        .then(function(status){
            debug('status: ' + status)
            return sitePage.property('content')
        })
        .then(function(content){
            debug('content:', content)
            return sitePage.property('title')
        })
        .then(function (title) {
            debug('title', title)
        })
        .catch(function(err){
            debug('Error:', err)
        })
}