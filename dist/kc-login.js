"use strict";
Cypress.Commands.add("kcLogin", function () {
    Cypress.log({ name: "Login" });
    var authBaseUrl = Cypress.env('auth_base_url');
    var realm = Cypress.env('auth_realm');
    var client_id = Cypress.env('auth_client_id');
    var client_secret = Cypress.env('auth_client_secret');
    var auth_header = btoa(client_id + ":" + client_secret);
    return cy.request({
        method: 'POST',
        url: authBaseUrl + "/realms/" + realm + "/protocol/openid-connect/token",
        followRedirect: false,
        form: true,
        headers: {
            Authorization: "Basic " + auth_header,
        },
        body: {
            grant_type: 'client_credentials',
        },
    }).its('body');
});
