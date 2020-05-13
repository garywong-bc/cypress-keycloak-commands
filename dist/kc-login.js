"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            // .then(response => {
            //   // const html = document.createElement("html");
            //   // html.innerHTML = response.body;
            //   // const form = html.getElementsByTagName("form")[0];
            //   // const url = form.action;
            //   const redirectURL = new URL(response.headers.location);
            //   const authCode = redirectURL.searchParams.get('session_code');
            //   cy.log('2 redirectURL: ' + redirectURL ); // GW
            //   cy.log('2 authCode: ' + authCode ); // GW
            //   // cy.log('2 authCode: ' + authCode ); // GW
            //   return cy.request({
            //     method: "POST",
            //     url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/token`,
            //     followRedirect: false,
            //     form: true,
            //     body: {
            //       code: authCode,
            //       username: userData.username,
            //       password: userData.password
            //     }
            //   });
            // })
            .then(function (response) {
            var redirectURL = new URL(response.headers.location);
            var authCode = redirectURL.searchParams.get('session_code');
            cy.log('2 redirectURL: ' + redirectURL); // GW
            cy.log('2 authCode: ' + authCode); // GW
            cy.request({
                method: "post",
                url: authBaseUrl + "/realms/" + realm + "/protocol/openid-connect/token",
                body: {
                    client_id: client_id,
                    redirect_uri: Cypress.config("baseUrl"),
                    code: authCode,
                    grant_type: "authorization_code",
                    username: userData.username,
                    password: userData.password
                },
                form: true,
                followRedirect: false
            }).its("body");
        });
    });
});
