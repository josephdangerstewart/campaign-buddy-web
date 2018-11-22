import Attribute from '../../../infrastructure/Attribute';
import CharacterDelta from '../../../infrastructure/CharacterDelta';

export default class Class extends Attribute {
	static attributeName = 'Class';
	static type = 'class';
	static defaultValue = 'elf';

	onLoad(character) {
		const delta = new CharacterDelta();

		if (this.value === 'elf') {
			delta.changeIcon('/images/elf.svg');
		} else if (this.value === 'gnome') {
			delta.changeIcon('/images/gnome.svg');
		}

		return delta;
	}
}
