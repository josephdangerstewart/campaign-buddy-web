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
		return new FighterClass(name, value, vars, 'This is a description!!', 'group-Feature');
	}
	
	static search(val) {
		return [
			'A Fighter Type Attribute!',
			{
				name: 'Another fighter type attribute',
				id: 'Some id!',
			}
		]
	}
}
