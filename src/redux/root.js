import { configureStore } from '@reduxjs/toolkit'
import gameStore from './store/store'

export const store = configureStore({
    reducer: {
        counter: gameStore
    }
})

function sub() {
    localStorage.playerDataTapWarrior1 = JSON.stringify(store.getState().counter);
  }
store.subscribe(sub);