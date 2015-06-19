'use strict';

function catchAll(req, res) {
    res.render('empty', {
        catchAll: true
    });
}

function error404(req, res) {
    res.status(404).send("Not Found");
}

// Public API
exports.catchAll = catchAll;
exports.error404 = error404;
