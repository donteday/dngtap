import { createSlice } from '@reduxjs/toolkit'

// const localStore = localStorage.playerDataTapWarrior1;

// const moneyStart = localStore ? JSON.parse(localStore).money : 0;
const maxHp = 75;


export const counterSlice = createSlice({
  name: 'game',
  initialState: {
    currentCharacter: 0,
    characters: [
      {
        characterType: 'warrior',
        lvl: 1,
        currentExp: 0,
        maxExp: 10,
        health: maxHp,
        currentHealth: maxHp,
        strength: 3,
        armory: [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
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
            chance: 15,
            gain: 0,
            isPutOn: true,
            selling: true,
            sellingPrice: 100000,
            additionalCharacteristics: {
              strength: 0,
              agility: 0,
              intelligency: 0,
              defence: 0,
              critChance: 12,
              critForce: 1,
              skillDamage: 0,
              additionalDamage: 0,
              speedAttack: 1
            }
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
            isPutOn : false,
            selling: false
          },
        ],
      }
    ],

    writable: true
  }
  ,
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
    healthHandler: (state, action) => {
      // if ((state.characters[state.currentCharacter].currentHealth += action.payload) >= state.characters[state.currentCharacter].health) {
      //   state.characters[state.currentCharacter].currentHealth = state.characters[state.currentCharacter].health;
      //   return;
      // } else 
      state.characters[state.currentCharacter].currentHealth += action.payload;
    },
    zeroingExp: (state, action) => {
      state.currentExp = action.payload;
    },
    addExp: (state, action) => {
      state.characters[state.currentCharacter].currentExp += action.payload;
      if (state.characters[state.currentCharacter].currentExp >= state.characters[state.currentCharacter].maxExp) {
        let delta = state.characters[state.currentCharacter].currentExp - state.characters[state.currentCharacter].maxExp;
        state.characters[state.currentCharacter].lvl = state.characters[state.currentCharacter].lvl + 1;
        state.characters[state.currentCharacter].currentExp = delta;
        state.characters[state.currentCharacter].maxExp = state.characters[state.currentCharacter].lvl * state.characters[state.currentCharacter].lvl * state.characters[state.currentCharacter].lvl * 5;

        state.characters[state.currentCharacter].health = state.characters[state.currentCharacter].health + state.characters[state.currentCharacter].lvl * 10;
        state.characters[state.currentCharacter].currentHealth = state.characters[state.currentCharacter].health;
      }
    },
    addItem: (state, action) => {
      state.inventory[0].quantity = state.inventory[0].quantity + Math.round(Math.random() * 10);
    },
    updateInventory: (state, action) => {
      state.characters[state.currentCharacter].inventory = action.payload;
    },
    setArmory: (state, action) => {
      state.characters[state.currentCharacter].armory[action.payload.id] = action.payload.item;
    },
    updateItemInventory: (state, action) => {
      if (action.payload.item.quantity <= 0) {
        // console.log('payaload', action.payload.item.id);
        state.characters[state.currentCharacter].inventory.splice(action.payload.id, 1);
      } else state.characters[state.currentCharacter].inventory[action.payload.id] = action.payload.item;

    },
  }
})
// state.improve[action.payload.index].amount

export const { addItem,
  addExp,
  updateInventory,
  updateItemInventory,
  setArmory,
  healthHandler } = counterSlice.actions

export default counterSlice.reducer