import { all } from 'redux-saga/effects';
import { watchAuthSaga } from './authSaga';
import { watchMessageSaga } from './messageSaga';

export function* rootSaga() {
  yield all([
    watchAuthSaga(),
    watchMessageSaga(),
  ]);
}

