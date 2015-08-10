/*jslint node: true*/
"use strict";

var webid = require('webid');
var debug = require('debug')('ldnode:webid');

function expressWebID(type, settings) {
    // at the moment we only support TLS
    // a switch will substitute this
    return TLS;
}

function TLS(req, res, next) {

    // User already logged in? skip
    if (req.session.webid && req.session.webid.uri && req.session.webid.identified) {
        debug("User: " + req.session.webid.uri);
        res.set('User', req.session.webid.uri);
        return next();
    }

    var certificate = req.connection.getPeerCertificate();
    // Certificate is empty? skip
    if (certificate === null || Object.keys(certificate).length === 0)  {
        debug("No client certificate found in the request. Did the user click on a cert?");
        setEmptySession(req);
        return next();
    }

    // Verify webid
    var verifAgent = new webid.VerificationAgent(certificate);
    verifAgent.verify(function(err, result) {
        if (err) {
            debug("Error processing certificate: " + err);
            setEmptySession(req);
            var authError = new Error();
            authError.status = 403;
            authError.message = err;
            return next(authError);
        }
        req.session.webid = {
            uri: result,
            identified: true
        };

        debug("Identified user: " + req.session.webid.uri);
        res.set('User', req.session.webid.uri);
        return next();
    });
}

function setEmptySession(req) {
    req.session.webid = {
        uri: '',
        identified: false
    };
}
module.exports = expressWebID;
