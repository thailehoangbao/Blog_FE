import {createStore} from 'redux'
import appReducers from './redux/reducers/reducer';

const store = createStore(appReducers);
export default store