export const validateEmail = function (email: string): boolean {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(String(email).toLowerCase());
};

export const validateEmailDomain = function (
  email: string,
  domain: string
): boolean {
  const regex = new RegExp("^\\S+@" + domain + "$");
  return regex.test(String(email).toLowerCase());
};

export const getParams = function (search: string): Record<string, string> {
  const rawParams = search.substr(1).split("&");
  const params: Record<string, string> = {};
  rawParams.forEach((param) => {
    const [key, value] = param.split("=");
    params[key] = value;
  });
  return params;
};
