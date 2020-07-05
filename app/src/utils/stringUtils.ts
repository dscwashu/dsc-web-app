// Checks whether the email is valid (can contain whitespace)
export const validateEmail = function (email: string): boolean {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email.trim().toLowerCase());
};

// Checks whether the email (can contain whitespace) is valid given a specific domain (cannot contain whitespace)
export const validateEmailDomain = function (
  email: string,
  domain: string
): boolean {
  if (domain.indexOf(" ") >= 0) return false;
  const regex = new RegExp("^\\S+@" + domain + "$");
  return regex.test(email.trim().toLowerCase());
};

// Validates url given regex (can contain whitespace)
export const validateUrl = function (url: string): boolean {
  const regex = /^((https?|ftp|smtp):\/\/)?([a-z0-9]+.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]*\/?)*$/;
  return regex.test(url.trim());
};

// Gets parameters of valid search URL in a key-value object
export const getParams = function (
  search: string
): Record<string, string> | undefined {
  if (search.charAt(0) !== "?" || search.indexOf(" ") >= 0) return undefined;
  const rawParams = search.substr(1).split("&");
  const params: Record<string, string> = {};
  rawParams.forEach((param) => {
    const keyValue = param.split("=");
    if (keyValue.length !== 2) return undefined;
    const [key, value] = param.split("=");
    params[key] = value;
  });
  return params;
};
