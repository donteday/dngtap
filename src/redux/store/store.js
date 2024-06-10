import { createSlice } from '@reduxjs/toolkit'

// const localStore = localStorage.playerDataTapWarrior1;

// const moneyStart = localStore ? JSON.parse(localStore).money : 0;
const maxHp = 75;


export const counterSlice = createSlice({
  name: 'game',
  initialState: {
    lvl: 1,
    currentExp: 0,
    maxExp: 10,
    hp: maxHp,
    inventory: [
      {
        name: 'Железная Алебарда',
        id: 1,
        type: 'weapon',
        subtype: 'halberd',
        baseDmg: 7,
        stacking: false,
        blessed: false,
        quantity: 1,
        chance: 5,
        gain: 13,
        isPutOn: true
      }, 
      {
        name: 'Свиток усиления оружия',
        id: 2,
        type: 'gain',
        subtype: 'ordinary',
        gainType: 'weapon',
        blessed: false,
        stacking: true,
        quantity: 4,
        chance: 50,
        gain: null,
        writable: true,
        isPutOn: false
      },
      {
        name: 'Свиток усиления доспехов',
        id: 3,
        type: 'gain',
        subtype: 'ordinary',
        gainType: 'armor',
        blessed: false,
        stacking: true,
        quantity: 1,
        chance: 50,
        gain: null,
        writable: true,
        isPutOn: false
      },
    ],
    armory: [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
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
      state.inventory[0].quantity = state.inventory[0].quantity + Math.round(Math.random() * 10);
    },
    updateInventory: (state, action) => {
      state.inventory = action.payload;
    },
    setArmory: (state, action) => {
      state.armory[action.payload.id] = action.payload.item;
    },
    updateItemInventory: (state, action) => {
      if (action.payload.item.quantity <= 0) {
        console.log('payaload', action.payload.item.id);
        state.inventory.splice(action.payload.id, 1);
      } else state.inventory[action.payload.id] = action.payload.item;

    },
  }
})
// state.improve[action.payload.index].amount

export const { addItem, addExp, updateInventory, updateItemInventory, setArmory } = counterSlice.actions

export default counterSlice.reducer