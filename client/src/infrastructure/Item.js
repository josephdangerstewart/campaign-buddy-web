import CharacterDelta from "./CharacterDelta";

/* Items are anything that can be used by characters. 
   This includes weapons, armor, spells, poitions etc... */

export default class Item {
	count = 0;
	stackable = true;
	vars = [];
	name = '';
	description = null;

	constructor(name, count, vars, description) {
		if (typeof name === 'object') {
			this.itemName = name.name;
			this.count = name.count;
			this.vars = name.vars;
			this.description = name.description;
		} else {
			this.itemName = name;
			this.count = count || this.count;
			this.vars = vars || this.vars;
			this.description = description;
		}
	}

	toModel = () => {
		return {
			name: this.itemName,
			count: this.count,
			vars: this.vars,
			description: this.description,
		};
	}

	// This method is called whenever an item cannot be found in the GameController
	// item registry. It should return a new Item of it's type. This is tricky because
	// it's implementation requires type checking of data
	static getItemFromData(name, data) {
		return null;
	}

	/**********************
	 * LIFE CYCLE METHODS *
	 **********************/

	/* This method is called whenever an item is first equiped
	   It should NOT make changes directly to the character
	   parameter but return a character delta representing the 
	   changes to make to the character */
	onEquip(character) {
		return new CharacterDelta();
	}

	/* This method returns the effects of use on the user
	   It should NOT make changes directly to the character
	   parameter but return a character delta object 
	   representing the changes */
	getCharacterEffectsOnUse(character) {
		return new CharacterDelta();
	}

	/* This method returns the effects of use on the target
	   of the item. It should NOT make changes directly to
	   the character parameter but return a character delta
	   object representing the chagnes */
	getTargetEffectsOnUse(target) {
		return new CharacterData();
	}
	   

	/* This method is called whenever the item is unequipped 
	   by a character. It should NOT make changes directly 
	   to the character parameter but return a character
	   delta object representing the changes */
	onUnequip(character) {
		return new CharacterDelta();
	}
}
Item.type = 'item';
Item.category = null;
