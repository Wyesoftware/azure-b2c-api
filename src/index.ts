import { Callback, Refresh, SignIn, SignOut } from "./types";
import { generateChallangeCode, scopeGen } from "./shared";
import axios from "axios";

export const signin = ({
  b2cAuthority,
  clientId,
  redirectUrl,
  responseMode,
  scopes,
  codeVetifier,
}: SignIn) => {
  const challangeCode = generateChallangeCode(codeVetifier);
  const scope = scopeGen(scopes);

  const authUrl =
    b2cAuthority +
    "/oauth2/v2.0/authorize?" +
    "client_id=" +
    clientId +
    "&response_type=code" +
    "&redirect_uri=" +
    redirectUrl +
    "&response_mode=" +
    responseMode +
    "&scope=" +
    scope +
    "&state=sign_in" +
    "&code_challenge=" +
    challangeCode +
    "&code_challenge_method=S256";

  return authUrl;
};

export const callback = async ({
  params,
  b2cAuthority,
  clientId,
  clientSecret,
  redirectUrl,
  scopes,
  codeVetifier,
}: Callback) => {
  try {
    if (params.error) {
      throw new Error(
        "Azure Error: " +
          JSON.stringify({
            error: params.error,
            description: params.error_description,
          })
      );
    } else {
      const scope = scopeGen(scopes);

      const tokenUrl =
        b2cAuthority +
        "/oauth2/v2.0/token?" +
        "grant_type=authorization_code" +
        "&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret +
        "&scope=" +
        scope +
        "&code=" +
        params.code +
        "&redirect_uri=" +
        redirectUrl +
        "&code_verifier=" +
        codeVetifier;

      const getToken = await axios
        .post(
          tokenUrl,
          {},
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .catch((error) => {
          throw new Error(
            "Token Error: " + JSON.stringify(error.response.data)
          );
        });
      return getToken.data;
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const signout = ({ b2cAuthority, idToken, redirectUrl }: SignOut) => {
  const logoutUrl =
    b2cAuthority +
    "/oauth2/v2.0/logout?" +
    "id_token_hint=" +
    idToken +
    "&post_logout_redirect_uri=" +
    redirectUrl;

  return logoutUrl;
};

export const refresh = async ({
  b2cAuthority,
  refreshToken,
  clientId,
  clientSecret,
  scopes,
}: Refresh) => {
  const scope = scopeGen(scopes);

  const tokenUrl =
    b2cAuthority +
    "/oauth2/v2.0/token?" +
    "grant_type=refresh_token" +
    "&client_id=" +
    clientId +
    "&client_secret=" +
    clientSecret +
    "&scope=" +
    scope +
    "&refresh_token=" +
    refreshToken;

  const getToken = await axios
    .post(
      tokenUrl,
      {},
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )
    .catch((error) => {
      throw new Error("Token Error: " + JSON.stringify(error.response.data));
    });
  return getToken.data;
};
