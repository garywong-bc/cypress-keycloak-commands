"use strict";
Cypress.Commands.add("kcLogin", function (user) {
    Cypress.log({ name: "Login" });
    cy.fixture("users/" + user).then(function (userData) {
        var authBaseUrl = Cypress.env('auth_base_url');
        var realm = Cypress.env('auth_realm');
        var client_id = Cypress.env('auth_client_id');
        var client_secret = Cypress.env('auth_client_secret');
        var base64authHdr = btoa(client_id + ":" + client_secret);
        cy.request({
            method: 'POST',
            url: authBaseUrl + "/realms/" + realm + "/protocol/openid-connect/token",
            followRedirect: false,
            form: true,
            headers: {
                Authorization: "Basic " + base64authHdr,
            },
            body: {
                // username: userData.username,
                // password: userData.password,
                grant_type: 'client_credentials',
            },
        }).its('body');
    });
});
