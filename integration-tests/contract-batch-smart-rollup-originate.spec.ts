import { CONFIGS } from './config';
import { ligoSample } from './data/ligo-simple-contract';
import { PvmKind } from '@taquito/rpc';
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  _describe(`Test contract.batch with smart rollup originate using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup(true);
    });

    _it('should be able to batch smart rollup originate with other operations', async () => {
      const kernel = '23212f7573722f62696e2f656e762073680a6578706f7274204b45524e454c3d22303036313733366430313030303030303031323830373630303337663766376630313766363030323766376630313766363030353766376637663766376630313766363030313766303036303031376630313766363030323766376630303630303030303032363130333131373336643631373237343566373236663663366337353730356636333666373236353061373236353631363435663639366537303735373430303030313137333664363137323734356637323666366336633735373035663633366637323635306337373732363937343635356636663735373437303735373430303031313137333664363137323734356637323666366336633735373035663633366637323635306237333734366637323635356637373732363937343635303030323033303530343033303430353036303530333031303030313037313430323033366436353664303230303061366236353732366536353663356637323735366530303036306161343031303432613031303237663431666130303266303130303231303132303030326630313030323130323230303132303032343730343430343165343030343131323431303034316534303034313030313030323161306230623038303032303030343163343030366230623530303130353766343166653030326430303030323130333431666330303266303130303231303232303030326430303030323130343230303032663031303032313035323030313130303432313036323030343230303334363034343032303030343130313661323030313431303136623130303131613035323030353230303234363034343032303030343130373661323030363130303131613062306230623164303130313766343164633031343138343032343139303163313030303231303034313834303232303030313030353431383430323130303330623062333830353030343165343030306231323266366236353732366536353663326636353665373632663732363536323666366637343030343166383030306230323030303130303431666130303062303230303032303034316663303030623032303030303030343166653030306230313031220a'
      const originationProof = await Tezos.rpc.getOriginationProof({ kernel, kind: PvmKind.WASM2 })

      const batch = Tezos.contract
        .batch()
        .withSmartRollupOriginate({
          pvmKind: PvmKind.WASM2,
          kernel,
          originationProof,
          parametersType: { prim: 'bytes' },
        })
        .withOrigination({
          balance: '1',
          code: ligoSample,
          storage: 0
        });
      const op = await batch.send();
      await op.confirmation();

      expect(op.status).toEqual('applied');
      expect(op.includedInBlock).toBeDefined();

    });
  });
});
