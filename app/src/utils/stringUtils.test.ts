import {
  validateEmail,
  validateEmailDomain,
  validateUrl,
  getParams,
} from "./stringUtils";

describe("validateEmail", () => {
  it("should reject", () => {
    const testEmails = [
      "",
      "asdf",
      "asdf@gmail",
      "asdf@.com",
      "@gmail.com",
      "asdf@",
      "asdf@gmail.",
      ". asdf@gmail.com",
      "asdf@gmail.com .",
    ];
    testEmails.forEach((email) => {
      expect(validateEmail(email)).toBeFalsy();
    });
  });
  it("should accept", () => {
    const testEmails = [
      "ASDF@GMAIL.COM",
      "asdf@gmail.com",
      " asdf@gmail.com",
      "asdf@gmail.com ",
    ];
    testEmails.forEach((email) => {
      expect(validateEmail(email)).toBeTruthy();
    });
  });
});

describe("validateEmailDomain", () => {
  it("should reject", () => {
    const testEmails = [
      "asdf@gmail.com",
      "asdf@wustl",
      "@wustl.edu",
      "asdf@wustl.edu .",
      ". asdf@wustl.edu",
    ];
    testEmails.forEach((email) => {
      expect(validateEmailDomain(email, "wustl.edu")).toBeFalsy();
    });
  });
  it("should accept", () => {
    const testEmails = [
      "ASDF@WUSTL.EDU",
      "asdf@wustl.edu",
      "asdf@wustl.edu ",
      " asdf@wustl.edu",
    ];
    testEmails.forEach((email) => {
      expect(validateEmailDomain(email, "wustl.edu")).toBeTruthy();
    });
  });
  it("should return false when domain has whitespace", () => {
    const testEmail = "asdf@wustl.edu ";
    expect(validateEmailDomain(testEmail, "wustl.edu ")).toBeFalsy();
  });
});

describe("validateUrl", () => {
  it("should reject", () => {
    const testUrls = [
      "google.com .",
      ". google.com",
      "WWW.google.com",
      "www.GOOGLE.com",
      "www.google.COM",
      "HTTPS://www.google.com",
      "google.",
      "google",
      "www.google.",
    ];
    testUrls.forEach((url) => {
      expect(validateUrl(url)).toBeFalsy();
    });
  });
  it("should accept", () => {
    const testUrls = [
      "https://www.google.com",
      "http://www.google.com",
      "www.google.com",
      "google.com",
      "google.com/",
      "google.com/#",
      "google.com/test",
      "google.com/TEST/test",
      "subdomain.google.com",
      " google.com",
      "google.com ",
    ];
    testUrls.forEach((url) => {
      expect(validateUrl(url)).toBeTruthy();
    });
  });
});

describe("getParams", () => {
  it("should return undefined when invalid format", () => {
    const testSearches = [
      " ?p1=param1&p2=param2",
      "?p1=param1&p2=param2 ",
      "p1=param1&p2=param2",
      "p1=param1p2=param2",
      "p1=param1p2=param2",
    ];
    testSearches.forEach((search) => {
      expect(getParams(search)).toBeUndefined();
    });
  });
  it("should return params when valid format", () => {
    const testSearch = "?p1=param1&p2=param2";
    expect(getParams(testSearch)).toMatchObject({
      p1: "param1",
      p2: "param2",
    });
  });
});
