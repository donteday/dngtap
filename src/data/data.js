
export const itemList = [
    {
      name: 'Серебро',
      id: 0,
      subtype: 'gold',
      type: 'gold',
      stacking: true,
      blessed: false,
      quantity: Math.round(Math.random() *100),
      chance: 100,
      gain: null,
      writable: true,
      isPutOn : false
    },
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
      gain: 0,
      isPutOn : true
    },
    {
      name: 'Стальной шлем',
      id: 200,
      type: 'armor',
      subtype: 'head',
      stacking: false,
      blessed: false,
      quantity: 1,
      chance: 10,
      gain: 0,
      isPutOn : true
    },
    {
      name: 'Стальные сапоги',
      id: 201,
      type: 'armor',
      subtype: 'legs',
      stacking: false,
      blessed: false,
      quantity: 1,
      chance: 10,
      gain: 0,
      isPutOn : true
    },
    {
      name: 'Стальные перчатки',
      id: 202,
      type: 'armor',
      subtype: 'hands',
      stacking: false,
      blessed: false,
      quantity: 1,
      chance: 15,
      gain: 0,
      isPutOn : true
    },
    {
      name: 'Кольцо высокой силы',
      id: 300,
      type: 'armor',
      subtype: 'ring',
      stacking: false,
      blessed: false,
      quantity: 1,
      chance: 1,
      gain: null,
      isPutOn : true,
    },
    {
      name: 'Свиток усиления оружия',
      id: 2,
      type: 'gain',
      subtype: 'ordinary',
      gainType: 'weapon',
      blessed: false,
      stacking: true,
      quantity: 1,
      chance: 50,
      gain: null,
      writable: true,
      isPutOn : false
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
      isPutOn : false
    },
  ]

export const mobList = [
    {
        name: 'Гремлин',
        maxHP : 50, 
        dropList: itemList
    }
];
