export const validateEmail = function (email: string): boolean {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
