export type SignIn = {
  b2cAuthority: string;
  clientId: string;
  responseMode: "query" | "form_post" | "fragment";
  redirectUrl: string;
  scopes: string[];
  codeVetifier: string;
};

export type Callback = {
  params: {
    state: string;
    code?: string;
    error?: string;
    error_description?: string;
  };
  b2cAuthority: string;
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  scopes: string[];
  codeVetifier: string;
};

export type SignOut = {
  b2cAuthority: string;
  idToken: string;
  redirectUrl: string;
};

export type Refresh = {
  b2cAuthority: string;
  refreshToken: string;
  clientId: string;
  clientSecret: string;
  scopes: string[];
};
