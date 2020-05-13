Cypress.Commands.add("kcLogin", (user: string) => {
  Cypress.log({ name: "Login" });

  cy.fixture(`users/${user}`).then((userData: UserData) => {
    const authBaseUrl = Cypress.env("auth_base_url");
    const realm = Cypress.env("auth_realm");
    const client_id = Cypress.env("auth_client_id");

    cy.request({
      method: "POST", 
      url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/token`,
      followRedirect: false,
      form: true,
      qs: {
        username: userData.username,
        password: userData.password,
      },
      body: {
        username: userData.username,
        password: userData.password,
        client_id,
        grant_type: "password",
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
