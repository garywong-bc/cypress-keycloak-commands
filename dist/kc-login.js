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
            form: true,
            qs: {
                username: userData.username,
                password: userData.password,
                kc_idp_hint: "idir"
            },
            body: {
                username: userData.username,
                password: userData.password,
                client_id: client_id,
                grant_type: "password",
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
