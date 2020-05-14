Cypress.Commands.add("kcLogin", () => {
  Cypress.log({ name: "Login" });
  const authBaseUrl = Cypress.env('auth_base_url')
  const realm = Cypress.env('auth_realm')
  const client_id = Cypress.env('auth_client_id')
  const client_secret = Cypress.env('auth_client_secret')
  const username = Cypress.env('auth_username')
  const password = Cypress.env('auth_password')
  // const auth_header = btoa(`${client_id}:${client_secret}`)

  return cy.request({
      method: 'POST',
      url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/token`,
      followRedirect: false,
      form: false,
      // headers: {
      //   Authorization: `Basic ${auth_header}`,
      // },
      body: {
        grant_type: 'password',
        client_id,
        client_secret,
        scope: 'openid',
        username,
        password
      }
    }).its('body')

  });
