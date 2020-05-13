"use strict";
Cypress.Commands.add("kcLogin", function (user) {
    Cypress.log({ name: "Login" });
    cy.fixture("users/" + user).then(function (userData) {
        var authBaseUrl = Cypress.env("auth_base_url");
        var realm = Cypress.env("auth_realm");
        var client_id = Cypress.env("auth_client_id");
        cy.request({
            method: "POST",
            url: authBaseUrl + "/realms/" + realm + "/protocol/openid-connect/token",
            followRedirect: false,
            form: false,
            headers: {
                "Content-Type": "application/json"
            },
            qs: {
                grant_type: "password",
                client_id: client_id,
                username: userData.username,
                password: userData.password,
                redirect_uri: Cypress.config("baseUrl"),
            }
        })
            .then(function (response) {
            var auth_token_json = response.body;
            cy.log('2 auth_token_json: ' + auth_token_json); // GW
            // return cy.request({
            //   method: "POST",
            //   url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/token`,
            //   followRedirect: false,
            //   form: true,
            //   body: {
            //     code: authCode,
            //     username: userData.username,
            //     password: userData.password
            //   }
            // });
        }).its("body");
    });
});
