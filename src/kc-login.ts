Cypress.Commands.add("kcLogin", (user: string) => {
  Cypress.log({ name: "Login" });

  cy.fixture(`users/${user}`).then((userData: UserData) => {
    const authBaseUrl = Cypress.env("auth_base_url");
    const realm = Cypress.env("auth_realm");
    const client_id = Cypress.env("auth_client_id");

    cy.log('1 authBaseUrl: ' + authBaseUrl); // GW
    cy.log('1 redirect_uri: ' + Cypress.config("baseUrl") );

    cy.request({
      method: "POST", 
      url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/token`,
      followRedirect: true,
      qs: {
        grant_type: "password",
        client_id,
        username: userData.username,
        password: userData.password,
        // redirect_uri: Cypress.config("baseUrl"),
      }
    })
      .then(response => {
        const auth_token_json = response.body;
        cy.log('2 auth_token_json: ' + auth_token_json ); // GW

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
