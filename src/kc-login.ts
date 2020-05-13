import { getAuthCodeFromLocation } from "./utils";

Cypress.Commands.add("kcLogin", (user: string) => {
  Cypress.log({ name: "Login" });

  cy.fixture(`users/${user}`).then((userData: UserData) => {
    const authBaseUrl = Cypress.env("auth_base_url");
    const realm = Cypress.env("auth_realm");
    const client_id = Cypress.env("auth_client_id");
    const idpHint = Cypress.env("auth_idp_hint");

    cy.log('1 authBaseUrl: ' + authBaseUrl); // GW
    cy.log('1 idpHint: ' + idpHint);
    cy.log('1 redirect_uri: ' + Cypress.config("baseUrl") );

    cy.request({
      url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/auth`,
      followRedirect: true,
      qs: {
        response_type: "code",
        client_id,
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
      .then(response => {
        const redirectURL = new URL(response.headers.location);
        const authCode = redirectURL.searchParams.get('session_code');

        cy.log('2 redirectURL: ' + redirectURL ); // GW
        cy.log('2 authCode: ' + authCode ); // GW

        cy.request({
          method: "post",
          url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/token`,
          body: {
            client_id,
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
