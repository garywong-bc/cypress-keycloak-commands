"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
Cypress.Commands.add("kcLogin", function (user) {
    Cypress.log({ name: "Login" });
    cy.fixture("users/" + user).then(function (userData) {
        var authBaseUrl = Cypress.env("auth_base_url");
        var realm = Cypress.env("auth_realm");
        var client_id = Cypress.env("auth_client_id");
        var kc_idp_hint = Cypress.env("auth_idp_hint");
        cy.log('1 authBaseUrl:', authBaseUrl); // GW
        cy.log('1 idpHint:', kc_idp_hint);
        cy.log('1 redirect_uri:', Cypress.config("baseUrl"));
        cy.request({
            url: authBaseUrl + "/realms/" + realm + "/protocol/openid-connect/auth",
            followRedirect: false,
            qs: {
                scope: "openid",
                response_type: "code",
                approval_prompt: "auto",
                redirect_uri: Cypress.config("baseUrl"),
                client_id: client_id,
                kc_idp_hint: kc_idp_hint
            }
        })
            .then(function (response) {
            var html = document.createElement("html");
            html.innerHTML = response.body;
            var form = html.getElementsByTagName("form")[0];
            var url = form.action;
            cy.log('2 html.innerHTML:', html.innerHTML); // GW
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
