import Attribute from '../../../infrastructure/Attribute';
import CharacterDelta from '../../../infrastructure/CharacterDelta';

export default class FighterClass extends Attribute {	
	static type = 'fighter_class';
	static group = 'Features';
	static defaultValue = 10;
	static defaultVars = [];
	
	onLoad(character) {
		const delta = new CharacterDelta();
		delta.addTo('STR', 2);
		return delta;
	}

	static getAttributeFromData(name, value, vars) {
		console.log('Calling get attribute from data');
		const att = new FighterClass(name, value, vars, 'This is a description!!', 'group-Features');
		return att;
	}
	
	static search(val, character) {
		console.log(character);
		return [
			{
				name: 'A Fighter Type Attribute!',
				type: 'fighter_class',
			},
			{
				name: 'Another fighter type attribute',
				type: 'fighter_class'
			}
		]
	}
}
