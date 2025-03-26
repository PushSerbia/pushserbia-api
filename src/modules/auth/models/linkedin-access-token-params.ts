export interface LinkedinAccessTokenParams extends Record<string, string> {
  grant_type: string;
  code: string;
  redirect_uri: string;
  client_id: string;
  client_secret: string;
}
