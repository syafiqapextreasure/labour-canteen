export const presetNames=['Standard','Most Popular','Healthy'];
export const mealPresets={
 breakfast:[[['Nasi lemak daun pisang bungkus'],['Nasi goreng cina'],['Mee hoon goreng'],['Roti telur']], [['Nasi lemak daun pisang bungkus'],['Roti canai'],['Thosai'],['Poori']], [['Idli'],['Capati'],['Roti bakar','Telur separuh masak'],['Thosai']]],
 lunch:[[['Nasi ayam','Bayam goreng'],['Kari ayam','Kangkung goreng'],['Ikan taucho','Tahu kicap']], [['Nasi tomato','Rendang ayam','Kangkung goreng'],['Ayam masak merah','Bayam goreng'],['Nasi minyak','Kari ayam']], [['Singang','Tahu sup','Bayam goreng'],['Asam ikan','Kangkung goreng'],['Ikan taucho','Bayam goreng']]],
 tea:[[['Karipap'],['Cekodok bilis'],['Mee sup']], [['Karipap'],['Donat'],['Pisang goreng bijan'],['Laksa']], [['Bihun sup'],['Mee sup'],['Kuew teow sup']]]
};
export function presetDishNames(meal,index){return [...new Set((mealPresets[meal]?.[index]||[]).flat())];}
export function presetMealIds(dishes,meal,index,day=0){const combos=mealPresets[meal]?.[index];if(!combos)throw new Error('Invalid preset');return combos[day%combos.length].map(name=>{const dish=dishes.find(d=>d.meal===meal&&d.name===name);if(!dish)throw new Error('Unknown preset dish: '+name);return dish.id;});}
