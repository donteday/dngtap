import { createSlice } from '@reduxjs/toolkit'

const maxHp = 75;
const maxMp = 100;

const CLASS_STATS = {
  warrior: { strength: 5, agility: 1, intelligency: 1 },
  mage:    { strength: 1, agility: 1, intelligency: 5 },
  archer:  { strength: 1, agility: 5, intelligency: 1 },
};

function migrateCharacter(char) {
  if (!char) return char;
  return {
    ...char,
    characterClass: char.characterClass || char.characterType || 'warrior',
    mana: char.mana ?? maxMp,
    currentMana: char.currentMana ?? maxMp,
    strength: char.strength ?? 5,
    agility: char.agility ?? 1,
    intelligency: char.intelligency ?? 1,
  };
}

function loadState() {
  try {
    const saved = localStorage.playerDataTapWarrior1;
    if (!saved) return undefined;
    const parsed = JSON.parse(saved);
    return {
      ...parsed,
      route: 'home',
      skillEffect: { damageMultiplier: 1, guaranteedCrit: false, instantDamage: 0 },
      quickSlots: Array(4).fill(null).map((_, i) => parsed.quickSlots?.[i] ?? null),
      characters: parsed.characters.map(c => c ? migrateCharacter(c) : c),
    };
  } catch {
    return undefined;
  }
}

const savedState = loadState();

export const counterSlice = createSlice({
  name: 'game',
  initialState: savedState ?? {
    currentCharacter: 0,
    route: 'farm',
    skillEffect: { damageMultiplier: 1, guaranteedCrit: false, instantDamage: 0 },
    quickSlots: [null, null, null, null],
    characters: [
      {
        name: 'GreckiOreh',
        characterClass: 'warrior',
        lvl: 1,
        currentExp: 0,
        maxExp: 10,
        health: maxHp,
        currentHealth: maxHp,
        mana: maxMp,
        currentMana: maxMp,
        strength: 5,
        agility: 1,
        intelligency: 1,
        armory: [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        inventory: [{
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
        }],
      }, undefined, undefined
    ],
    writable: true
  },
  reducers: {
    healthHandler: (state, action) => {
      const char = state.characters[state.currentCharacter];
      char.currentHealth = Math.min(char.health, Math.max(0, char.currentHealth + action.payload));
    },
    spendMana: (state, action) => {
      const char = state.characters[state.currentCharacter];
      char.currentMana = Math.max(0, char.currentMana - action.payload);
    },
    restoreMana: (state, action) => {
      const char = state.characters[state.currentCharacter];
      char.currentMana = Math.min(char.mana, char.currentMana + action.payload);
    },
    setSkillEffect: (state, action) => {
      state.skillEffect = action.payload;
    },
    clearSkillEffect: (state) => {
      state.skillEffect = { damageMultiplier: 1, guaranteedCrit: false, instantDamage: 0 };
    },
    addExp: (state, action) => {
      const char = state.characters[state.currentCharacter];
      char.currentExp += action.payload;
      if (char.currentExp >= char.maxExp) {
        const delta = char.currentExp - char.maxExp;
        char.lvl += 1;
        char.currentExp = delta;
        char.maxExp = char.lvl * char.lvl * char.lvl * 5;
        char.health += char.lvl * 10;
        char.currentHealth = char.health;
        char.mana += 10;
        char.currentMana = char.mana;
        if (char.characterClass === 'warrior') char.strength += 1;
        else if (char.characterClass === 'mage') char.intelligency += 1;
        else if (char.characterClass === 'archer') char.agility += 1;
      }
    },
    updateInventory: (state, action) => {
      state.characters[state.currentCharacter].inventory = action.payload;
    },
    setArmory: (state, action) => {
      state.characters[state.currentCharacter].armory[action.payload.id] = action.payload.item ?? null;
    },
    setCharacter: (state, action) => {
      state.currentCharacter = action.payload;
    },
    setRoute: (state, action) => {
      state.route = action.payload;
    },
    updateItemInventory: (state, action) => {
      if (action.payload.item.quantity <= 0) {
        state.characters[state.currentCharacter].inventory.splice(action.payload.id, 1);
      } else {
        state.characters[state.currentCharacter].inventory[action.payload.id] = action.payload.item;
      }
    },
    spendGold: (state, action) => {
      const char = state.characters[state.currentCharacter];
      const goldItem = char.inventory.find(item => item.id === 0);
      if (goldItem) {
        goldItem.quantity = Math.max(0, goldItem.quantity - action.payload);
      }
    },
    addItemToInventory: (state, action) => {
      const char = state.characters[state.currentCharacter];
      const item = action.payload;
      if (item.stacking) {
        const existing = char.inventory.find(i => i.id === item.id);
        if (existing) {
          existing.quantity += item.quantity;
          return;
        }
      }
      char.inventory.push({ ...item });
    },
    setQuickSlot: (state, action) => {
      const { slotIndex, item } = action.payload;
      if (!state.quickSlots) state.quickSlots = [null, null];
      state.quickSlots[slotIndex] = item;
    },
    clearQuickSlot: (state, action) => {
      if (!state.quickSlots) state.quickSlots = [null, null];
      state.quickSlots[action.payload] = null;
    },
    consumeQuickSlot: (state, action) => {
      const slotIndex = action.payload;
      if (!state.quickSlots) return;
      const item = state.quickSlots[slotIndex];
      if (!item) return;
      const char = state.characters[state.currentCharacter];
      if (item.subtype === 'hp') {
        char.currentHealth = Math.min(char.health, char.currentHealth + item.healAmount);
      }
      const invItem = char.inventory.find(i => i.id === item.id);
      if (invItem) {
        invItem.quantity -= 1;
        if (invItem.quantity <= 0) {
          char.inventory = char.inventory.filter(i => i.id !== item.id);
          state.quickSlots[slotIndex] = null;
        } else {
          state.quickSlots[slotIndex] = { ...state.quickSlots[slotIndex], quantity: invItem.quantity };
        }
      } else {
        state.quickSlots[slotIndex] = null;
      }
    },
    addGold: (state, action) => {
      const char = state.characters[state.currentCharacter];
      const goldItem = char.inventory.find(item => item.id === 0);
      if (goldItem) {
        goldItem.quantity += action.payload;
      } else {
        char.inventory.push({ id: 0, name: 'Серебро', quantity: action.payload, stacking: true, selling: false });
      }
    },
    createCharacter: (state, action) => {
      const stats = CLASS_STATS[action.payload.type] || CLASS_STATS.warrior;
      state.characters[action.payload.id] = {
        name: action.payload.name,
        characterClass: action.payload.type,
        lvl: 1,
        currentExp: 0,
        maxExp: 10,
        health: maxHp,
        currentHealth: maxHp,
        mana: maxMp,
        currentMana: maxMp,
        strength: stats.strength,
        agility: stats.agility,
        intelligency: stats.intelligency,
        armory: [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        inventory: [],
      };
    },
  }
});

export const {
  addExp,
  updateInventory,
  updateItemInventory,
  setArmory,
  healthHandler,
  spendMana,
  restoreMana,
  setSkillEffect,
  clearSkillEffect,
  setCharacter,
  createCharacter,
  setRoute,
  spendGold,
  addGold,
  addItemToInventory,
  setQuickSlot,
  clearQuickSlot,
  consumeQuickSlot,
} = counterSlice.actions;

export default counterSlice.reducer;
