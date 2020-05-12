"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
Cypress.Commands.add("kcLogin", function (user) {
    Cypress.log({ name: "Login" });
    cy.fixture("users/" + user).then(function (userData) {
        var authBaseUrl = Cypress.env("auth_base_url");
        var realm = Cypress.env("auth_realm");
        var client_id = Cypress.env("auth_client_id");
        var idpHint = Cypress.env("auth_idp_hint");
        cy.log('1 authBaseUrl: ' + authBaseUrl); // GW
        cy.log('1 idpHint: ' + idpHint);
        cy.log('1 redirect_uri: ' + Cypress.config("baseUrl"));
        cy.request({
            url: authBaseUrl + "/realms/" + realm + "/protocol/openid-connect/auth",
            followRedirect: false,
            qs: {
                response_type: "code",
                client_id: client_id,
                redirect_uri: Cypress.config("baseUrl"),
                kc_idp_hint: idpHint
            }
        })
            .then(function (response) {
            // const html = document.createElement("html");
            // html.innerHTML = response.body;
            // const form = html.getElementsByTagName("form")[0];
            // const url = form.action;
            var redirectURL = response.headers.location;
            var urlParams = new URLSearchParams(redirectURL);
            // const authCode = new URLSearchParams(redirectURL.search.substring(1)).get("session_code");
            var url = 'placeholder';
            cy.log('2 redirectURL: ' + redirectURL); // GW
            cy.log('2 urlParams: ' + urlParams); // GW
            return cy.request({
                method: "POST",
                url: url,
                followRedirect: false,
                form: true,
                body: {
                    username: userData.username,
                    password: userData.password
                }
            });
        })
            .then(function (response) {
            var code = utils_1.getAuthCodeFromLocation(response.headers["location"]);
            cy.log('3 code:', code); // GW
            cy.request({
                method: "post",
                url: authBaseUrl + "/realms/" + realm + "/protocol/openid-connect/token",
                body: {
                    client_id: client_id,
                    redirect_uri: Cypress.config("baseUrl"),
                    code: code,
                    grant_type: "authorization_code"
                },
                form: true,
                followRedirect: false
            }).its("body");
        });
    });
});
