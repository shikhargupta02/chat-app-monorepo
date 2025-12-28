import { call, put, takeEvery } from 'redux-saga/effects';
import { authApi } from '../../api/authApi';
import { loginRequest, signUpRequest, LoginRequest, SignUpRequest, setLoading, setError, loginSuccess } from '../slices/authSlice';

function* loginSaga(action: ReturnType<typeof loginRequest>) {
  try {
    yield put(setLoading(true));
    yield put(setError(null));
    
    const response = yield call(authApi.login, action.payload as LoginRequest);
    
    yield put(loginSuccess({ token: response.token, user: response.user }));
  } catch (error: any) {
    yield put(setError(error.message || 'Login failed'));
  } finally {
    yield put(setLoading(false));
  }
}

function* signUpSaga(action: ReturnType<typeof signUpRequest>) {
  try {
    yield put(setLoading(true));
    yield put(setError(null));
    
    const response = yield call(authApi.signUp, action.payload as SignUpRequest);
    
    yield put(loginSuccess({ token: response.token, user: response.user }));
  } catch (error: any) {
    yield put(setError(error.message || 'Sign up failed'));
  } finally {
    yield put(setLoading(false));
  }
}

export function* watchAuthSaga() {
  yield takeEvery(loginRequest.type, loginSaga);
  yield takeEvery(signUpRequest.type, signUpSaga);
}

