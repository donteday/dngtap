export const SAVE_KEY = 'playerDataTapWarrior1';

export function calculateProtection(armory) {
  let total = 0;
  armory.forEach(item => {
    if (item != null && item.defence) {
      total += item.defence + (item.gain || 0);
    }
  });
  return total;
}

export function calculateTotalStats(character, armory) {
  let str = character.strength || 0;
  let agi = character.agility || 0;
  let int = character.intelligency || 0;
  armory.forEach(item => {
    if (item != null && item.additionalCharacteristics) {
      const ac = item.additionalCharacteristics;
      str += ac.strength || 0;
      agi += ac.agility || 0;
      int += ac.intelligency || 0;
    }
  });
  return { str, agi, int };
}

export function calculateDamage(character, armory) {
  const weapon = armory[3];
  let dmg = (weapon?.baseDmg || 0) + (weapon?.gain || 0);
  let critChance = 1;

  const cls = character.characterClass;
  if (cls === 'warrior') dmg += Math.floor((character.strength || 0) / 3);
  else if (cls === 'mage') dmg += Math.floor((character.intelligency || 0) / 3);
  else if (cls === 'archer') dmg += Math.floor((character.agility || 0) / 3);

  armory.forEach(item => {
    if (item != null) {
      const ac = item.additionalCharacteristics || {};
      dmg += ac.additionalDamage || 0;
      critChance += ac.critChance || 0;
      if (cls === 'warrior') dmg += Math.floor((ac.strength || 0) / 3);
      else if (cls === 'mage') dmg += Math.floor((ac.intelligency || 0) / 3);
      else if (cls === 'archer') dmg += Math.floor((ac.agility || 0) / 3);
    }
  });

  return { dmg: Math.max(1, dmg), critChance };
}
