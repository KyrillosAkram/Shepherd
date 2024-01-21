import {volanteer_reducer} from './volanteer'
import {configureStore} from '@reduxjs/toolkit'
// import {createStore} from 'redux'
const store = configureStore(
    {
        reducer:{volanteer:volanteer_reducer}
    }
)
window.store=store
export default store;