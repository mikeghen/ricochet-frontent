import { call, put } from 'redux-saga/effects';
import { modalHide, modalShow } from 'store/modal/actionCreators';
import { ModalType } from 'store/modal/types';
import Web3 from 'web3';
import {
  mainCheck, mainGetData, mainGetReadOnlyData, mainSetState,
} from '../actionCreators';
import { getConnectedSafe, getSafeProvider } from '../../../utils/getSafeInfo';
import { Unwrap } from '../../../types/unwrap';
import { LedgerHQFrameConnector } from '../../../utils/ledgerhq-frame-connector/connector';
import { getLedgerChainId, getLedgerProvider } from '../../../utils/getLedgerInfo';

export function* mainCheckSaga() {
  try {
    const ledgerHQFrame = new LedgerHQFrameConnector();

    const { ethereum } = (window as any);
    const gnosisSafeProvider: Unwrap<typeof getSafeProvider > = yield call(getSafeProvider);
    // Check we are inside gnosis safe
    if (gnosisSafeProvider) {
      yield put(mainSetState({ web3: new Web3(<any>gnosisSafeProvider!) }));
      const connectedSafe: Unwrap<typeof getConnectedSafe > = yield call(getConnectedSafe);
      const chainId = connectedSafe?.chainId;
      // Check we are on polygon chain
      if (chainId === Number(process.env.REACT_APP_CHAIN_ID)) {
        yield put(modalHide());
        yield put(mainGetData());
      } else {
        // Run modal switch network
        yield put(modalShow(ModalType.Network));
      }
    } else if (ledgerHQFrame.isLedgerApp()) {
      const ledgerProvider: Unwrap<typeof getLedgerProvider> =
          yield call(getLedgerProvider, ledgerHQFrame);
      const chainId: Unwrap<typeof getLedgerChainId> =
          yield call(getLedgerChainId, ledgerHQFrame);
      yield put(mainSetState({ web3: new Web3(<any>ledgerProvider!) }));
      if (parseInt(chainId.toString(), 16) === Number(process.env.REACT_APP_CHAIN_ID)) {
        yield put(modalHide());
        yield put(mainGetData());
      } else {
        // Run modal switch network
        yield put(modalShow(ModalType.Network));
      }
    } else if (ethereum) {
      // Injected provider
      yield call(ethereum.enable);
      const chainId = parseInt(ethereum.networkVersion, 10);
      // Check we are on polygon chain
      if (chainId === Number(process.env.REACT_APP_CHAIN_ID)) {
        yield put(modalHide());
        yield put(mainGetData());
      } else {
        // Run modal switch network
        yield put(modalShow(ModalType.Network));
      }
      yield put(mainSetState({ web3: new Web3(Web3.givenProvider) }));
    } else {
      // if metamask don't installed
      // Show read only data Total Value Streaming, Total Streamers, rexLP yield %, $RIC price, etc
      const web3HttpProvider = new Web3.providers.HttpProvider(process.env.REACT_APP_API_NODE_URL!);
      yield put(mainSetState({ web3: new Web3(web3HttpProvider) }));
      yield put(mainGetReadOnlyData());
    }
  } catch (e) {
    yield put(mainCheck());
  } 
}
