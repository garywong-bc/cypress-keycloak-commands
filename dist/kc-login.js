"use strict";
Cypress.Commands.add("kcLogin", function () {
    Cypress.log({ name: "Login" });
    var authBaseUrl = Cypress.env('auth_base_url');
    var realm = Cypress.env('auth_realm');
    var client_id = Cypress.env('auth_client_id');
    var client_secret = Cypress.env('auth_client_secret');
    var username = Cypress.env('auth_username');
    var password = Cypress.env('auth_password');
    // const auth_header = btoa(`${client_id}:${client_secret}`)
    return cy.request({
        method: 'POST',
        url: authBaseUrl + "/realms/" + realm + "/protocol/openid-connect/token",
        followRedirect: false,
        form: false,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: {
            grant_type: 'password',
            client_id: client_id,
            client_secret: client_secret,
            scope: 'openid',
            username: username,
            password: password
        }
    }).its('body');
});
