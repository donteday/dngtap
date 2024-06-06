import { createSlice } from '@reduxjs/toolkit'

const localStore = localStorage.playerDataTapWarrior1;

// const moneyStart = localStore ? JSON.parse(localStore).money : 0;
const maxHp = 75;


export const counterSlice = createSlice({
  name: 'game',
  initialState: {
    lvl : 1,
    currentExp : 0,
    maxExp : 10, 
    hp : maxHp,
    inventory : [],
    writable: true
  },
  reducers: {
    startGame: (state) => {
      state.game = true;
    },
    incrementMoney: (state, action) => {
      state.money += action.payload
    },
    increment: (state, action) => {
      state[action.payload.name] += action.payload.src;
    },
    zeroingExp: (state, action) => {
      state.currentExp = action.payload;
    },
    addExp: (state, action) => {
      state.currentExp += action.payload;
      if (state.currentExp >= state.maxExp) {
        let delta = state.currentExp - state.maxExp;
        state.lvl = state.lvl + 1;
        state.currentExp = delta;
        state.maxExp = state.lvl * state.lvl * state.lvl * 5;

        state.hp = state.hp + 25;
      }
    },
    addItem: (state, action) => {
      state.inventory[0].quantity =  state.inventory[0].quantity + Math.round(Math.random() * 10);
    },
    updateInventory: (state, action) => {
      state.inventory = action.payload;
    },
  }
})
// state.improve[action.payload.index].amount

export const { addItem, addExp, updateInventory} = counterSlice.actions

export default counterSlice.reducer