import { CONFIGS } from "./config";
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ rpc, setup, createAddress }) => {
  const test = require('jest-retries');

  _describe(`Test obtaining the delegate when there is none: ${rpc}`, () => {

    beforeEach(async () => {
      await setup(true)
    })
    test('Verify null is returned for getDelegate when the account has no delegate', 2, async () => {
      const LocalTez = await createAddress()
      const signer = await LocalTez.signer.publicKeyHash();

      expect(await LocalTez.rpc.getDelegate(signer)).toBeNull();
      expect(await LocalTez.tz.getDelegate(signer)).toBeNull();

    });
  });
})
