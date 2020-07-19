/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-namespace */

import * as firebase from "@firebase/testing";

declare global {
  namespace jest {
    interface Matchers<R> {
      toAllow: () => CustomMatcherResult;
      toDeny: () => CustomMatcherResult;
    }
  }
}

expect.extend({
  async toAllow(x: Promise<any>) {
    try {
      await firebase.assertSucceeds(x);
      return {
        pass: true,
        message: () =>
          "Expected Firebase operation to be denied, but it was allowed",
      };
    } catch (error) {
      return {
        pass: false,
        message: () =>
          "Expected Firebase operation to be allowed, but it was denied",
      };
    }
  },
});

expect.extend({
  async toDeny(operation: Promise<any>) {
    try {
      await firebase.assertFails(operation);
      return {
        pass: true,
        message: () =>
          "Expected Firebase operation to be denied, but it was allowed",
      };
    } catch (error) {
      return {
        pass: false,
        message: () =>
          "Expected Firebase operation to be allowed, but it was denied",
      };
    }
  },
});
