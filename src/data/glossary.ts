export interface GlossaryTerm {
  id: string;
  name: string;
  pronunciation: string;
  category: 'food' | 'drink' | 'bread' | 'culture';
  tagline: string;
  description: string;
  isVegetarian: boolean;
  mustTrySpotRecommendation?: string;
  mustTrySpotId?: string;
  ingredients: string[];
  spiceLevel: 'Mild' | 'Medium' | 'Spicy' | 'Tangy / Sweet';
}

export const KONKANI_GLOSSARY: GlossaryTerm[] = [
  {
    id: 'poee',
    name: 'Poee (Podi)',
    pronunciation: 'poh-ee',
    category: 'bread',
    tagline: 'Traditional Goan whole-wheat fermented pocket bread',
    description: 'A round, hollow, naturally leavened wheat bread baked with wheat bran and traditionally fermented with toddy (coconut palm sap). Baked fresh at dawn by local bakers (Poder) on bicycles. Served hot with butter, curries, or stuffed with chorizo.',
    isVegetarian: true,
    mustTrySpotRecommendation: 'Gunpowder (Assagao) or Local village bakeries in Saligao & Benaulim',
    mustTrySpotId: 'gunpowder-assagao',
    ingredients: ['Whole wheat flour', 'Wheat bran', 'Palm toddy yeast', 'Warm water', 'Pinch of sea salt'],
    spiceLevel: 'Mild'
  },
  {
    id: 'sol-kadi',
    name: 'Sol Kadi',
    pronunciation: 'soul-kah-dee',
    category: 'drink',
    tagline: 'Refreshing pink kokum & freshly pressed coconut milk digestive',
    description: 'An iconic, cooling Goan digestive drink made from fresh kokum extract (Amsol), freshly squeezed coconut milk, garlic, green chilies, and coriander. Served chilled before or after coastal seafood feasts.',
    isVegetarian: true,
    mustTrySpotRecommendation: 'Fisherman’s Wharf (Cavelossim) or Vinayak Family Restaurant (Assagao)',
    mustTrySpotId: 'fishermans-wharf-cavelossim',
    ingredients: ['Dried Kokum', 'Fresh Coconut Milk', 'Crushed Garlic', 'Green Chili', 'Fresh Coriander', 'Rock Salt'],
    spiceLevel: 'Tangy / Sweet'
  },
  {
    id: 'caldin',
    name: 'Caldin (Caldeirada)',
    pronunciation: 'kahl-deen',
    category: 'food',
    tagline: 'Mild, fragrant golden coconut milk stew with turmeric & cumin',
    description: 'An aromatic, soothing Goan curry influenced by Portuguese Caldeirada. Made with thick coconut milk, turmeric, cumin, green chilies, and coriander. Available with fresh river prawns, pomfret, or seasonal vegetables.',
    isVegetarian: false,
    mustTrySpotRecommendation: 'Kokni Kanteen (Panaji) or Martin’s Corner (Betalbatim)',
    mustTrySpotId: 'kokni-kanteen-panaji',
    ingredients: ['Coconut Milk', 'Turmeric', 'Cumin seeds', 'Green chilies', 'Garlic', 'Tamarind pulp', 'Prawns or Okra'],
    spiceLevel: 'Mild'
  },
  {
    id: 'ross-omelette',
    name: 'Ross Omelette',
    pronunciation: 'raws om-let',
    category: 'food',
    tagline: 'Goan late-night street comfort: fluffy omelette drenched in spicy Xacuti gravy',
    description: 'Goa’s undisputed street food royalty. A freshly whipped coriander-onion-chili omelette drowned in piping hot, spicy chicken or vegetarian Xacuti curry ("Ross"), topped with crunchy minced onions, lime, and served with crusty poee or pao.',
    isVegetarian: false,
    mustTrySpotRecommendation: 'Street stalls in Panaji (Church Square) & Margao KTC circle',
    mustTrySpotId: 'kokni-kanteen-panaji',
    ingredients: ['Eggs', 'Xacuti coconut curry', 'Chopped red onions', 'Lime wedge', 'Goan Pao'],
    spiceLevel: 'Spicy'
  },
  {
    id: 'feni',
    name: 'Kokum & Cashew Feni',
    pronunciation: 'feh-nee',
    category: 'drink',
    tagline: 'Heritage GI-tagged Goan spirit distilled from cashew apples or coconut sap',
    description: 'Goa’s traditional alcoholic spirit, pot-distilled using copper stills from ripe cashew apple juice (Kaju Feni) or fermented coconut palm nectar. Enjoyed neat with Limca, green chili, and salt rim, or in modern botanical cocktails infused with kokum and fresh lime.',
    isVegetarian: true,
    mustTrySpotRecommendation: 'Joseph Bar (Fontainhas) or Bar Pisco (Assagao)',
    mustTrySpotId: 'joseph-bar-fontainhas',
    ingredients: ['Double-distilled Cashew Apple juice or Coconut toddy', 'Lime', 'Limca / Tonic', 'Slit bird eye chili'],
    spiceLevel: 'Tangy / Sweet'
  },
  {
    id: 'cafreal',
    name: 'Chicken / Paneer Cafreal',
    pronunciation: 'kah-frah-uhl',
    category: 'food',
    tagline: 'Luscious, vibrant dark-green herb & whole spice braise',
    description: 'Introduced by Mozambican soldiers in Portuguese Goa, this celebrated dish features meat or paneer marinated in a thick emerald paste of fresh coriander, green chilies, garlic, ginger, cloves, cinnamon, and Goan toddy vinegar, pan-fried to succulent perfection.',
    isVegetarian: false,
    mustTrySpotRecommendation: 'Florentine Bar & Restaurant (Saligao) or Gunpowder (Assagao)',
    mustTrySpotId: 'gunpowder-assagao',
    ingredients: ['Fresh Coriander bunch', 'Green Chilies', 'Goan Toddy Vinegar', 'Cinnamon & Cloves', 'Ginger & Garlic'],
    spiceLevel: 'Medium'
  },
  {
    id: 'bebinca',
    name: 'Bebinca (Bibik)',
    pronunciation: 'beh-been-kah',
    category: 'food',
    tagline: 'The Queen of Goan desserts: 7 to 16 layered caramel coconut pudding',
    description: 'A labor of love dating back to 17th-century nuns at Santa Monica Convent in Old Goa. Layers of coconut milk, egg yolks, flour, sugar, pure ghee, and grated nutmeg, individually baked and caramelized one atop another.',
    isVegetarian: true,
    mustTrySpotRecommendation: 'Viva Panjim (Fontainhas) or Simonia Bakeries (Porvorim)',
    mustTrySpotId: 'viva-panjim-fontainhas',
    ingredients: ['Rich Coconut Milk', 'Egg yolks', 'Pure Ghee', 'Grated Nutmeg', 'Caramelized sugar', 'Flour'],
    spiceLevel: 'Tangy / Sweet'
  },
  {
    id: 'xacuti',
    name: 'Xacuti (Shagoti)',
    pronunciation: 'shah-koo-tee',
    category: 'food',
    tagline: 'Complex roasted coconut curry infused with 18 toasted coastal spices and poppy seeds',
    description: 'One of Goa’s most intricate curries. Freshly grated coconut is slow-roasted until dark mahogany with Kashmiri red chilies, star anise, white poppy seeds (khus-khus), mace, fennel, and coriander seeds, creating an intense, nutty gravy.',
    isVegetarian: false,
    mustTrySpotRecommendation: 'Vinayak Family Restaurant (Assagao) or Kokni Kanteen (Panaji)',
    mustTrySpotId: 'kokni-kanteen-panaji',
    ingredients: ['Roasted dark coconut', 'Poppy seeds', 'Star anise', 'Kashmiri red chilies', 'Mace & Fennel', 'Toddy vinegar'],
    spiceLevel: 'Spicy'
  },
  {
    id: 'recheado',
    name: 'Recheado Paste & Masala',
    pronunciation: 'reh-shay-ah-doh',
    category: 'food',
    tagline: 'Fiery, tangy red chili and toddy vinegar stuffing paste',
    description: 'A vibrant ruby-red masala made by grinding whole Kashmiri dried chilies with aged palm toddy vinegar, garlic, ginger, and aromatic spices. Stuffed inside fresh mackerel (Bangda), pomfret, or calamari before pan-crisping.',
    isVegetarian: false,
    mustTrySpotRecommendation: 'Fisherman’s Wharf (Cavelossim) or Souza Lobo (Calangute)',
    mustTrySpotId: 'fishermans-wharf-cavelossim',
    ingredients: ['Kashmiri Red Chilies', 'Goan Palm Vinegar', 'Garlic cloves', 'Cumin & Peppercorns', 'Sugar / Jaggery touch'],
    spiceLevel: 'Spicy'
  },
  {
    id: 'chorizo-pao',
    name: 'Goan Chorizo Pao',
    pronunciation: 'shoh-ree-soh pow',
    category: 'food',
    tagline: 'Spicy, smoked pork sausage cured with toddy vinegar & feni inside crusty bread',
    description: 'Heavily spiced, dark red sausages smoked over coconut husks and cured with vinegar, feni, and red chilies. Cooked with onions and potatoes until the rich oils release, stuffed into crusty bread.',
    isVegetarian: false,
    mustTrySpotRecommendation: 'Mojis (Assagao) or Mapusa Friday Market stalls',
    mustTrySpotId: 'gunpowder-assagao',
    ingredients: ['Smoked pork sausage', 'Palm vinegar', 'Feni', 'Chili paste', 'Diced potatoes & onions', 'Fresh Pao'],
    spiceLevel: 'Spicy'
  },
  {
    id: 'susegad',
    name: 'Susegad',
    pronunciation: 'soo-seh-gahd',
    category: 'culture',
    tagline: 'The timeless Goan philosophy of contentment, relaxed pace & mindful living',
    description: 'Derived from the Portuguese word "sossegado" (quiet/peaceful). It is not laziness, but rather an art of living: taking time to savor afternoon siestas, enjoying tea by the backwaters, listening to ocean waves, and living unhurried.',
    isVegetarian: true,
    ingredients: ['Ocean breeze', 'Good conversation', 'No rushing', 'Afternoon siesta'],
    spiceLevel: 'Mild'
  }
];
