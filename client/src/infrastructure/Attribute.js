import CharacterDelta from "./CharacterDelta";
import React from 'react';
import styles from './styles.less';

/* Attributes are anything that is 'about' a character. Attributes can be static or they
   can be dynamic. Static attributes are raw information that does nothing to the character
   instance. Examples of this are hair color, level, character name, proficiencies, skill
   points, and so on. This data can be changed by the end user but the data itself does not
   make any data changes.
   
   Dynamic data on the other hand can make changes to the character instance. So for example,
   a characters class in D&D would make changes to that character's skill points, proficiencies,
   and even sometimes add new attributes which could be static (i.e. Ki for monks) or dynamic
   (i.e. features). To make an attribute type dynamic, just implement the onload method which
   gets called whenever the character loaded from memory. */

export default class Attribute {
	value = 0;
	backgroundUrl = null;
	vars = [];
	children = [];
	attributeName = 'Attribute';
	description = null;
	category = '';

	constructor(name, value, vars, description, category = '') {
		if (typeof name === 'object') {
			this.onInit(name.name, name.value, name.vars, category);
			this.attributeName = name.name;
			this.value = name.value;
			this.vars = name.vars || this.vars;
			this.description = name.description;
			this.category = category;
		} else {
			this.onInit(name, value, vars, category);
			this.attributeName = name;
			this.value = Attribute.defaultValue || value;
			this.vars = vars || this.vars;
			this.description = description;
			this.category = category;
		}
	}

	// This method is called by the game controller when an attribute is not registered
	// It is useful for game systems getting data from an api (i.e. dnd5eapi.com)
	// It should return a new Attribute of it's type
	static getAttributeFromData(name, value, vars, description, category) {
		return new Attribute(name, value, vars, description, category);
	}

	toModel() {
		return {
			value: this.value,
			vars: this.vars,
			name: this.attributeName,
			description: this.description,
			type: this.constructor.type,
			category: this.category,
		};
	}

	getValueOfVariable(variableName) {
		const variable = this.vars.find((v) => v.name === variableName);
		return variable ? variable.value : null;
	}

	/************************
	 *  LIFE CYCLE METHODS  *
	 ************************/

	/* This method is called when the attribute is first initialized */
	onInit(name, value, vars) {

	}

	/* This method is called whenever the value of the attribute is changed it should return
	   a character delta of what changes to make */
	onChange(character) {
		return new CharacterDelta();
	}

	/* onLoad should return a character delta object representing changes to a character
	   whenever the character is loaded */
	onLoad(character) {return new CharacterDelta()}
	onActivate(character) {return new CharacterDelta()}

	getModalComponent() {
		return (
			<div className={styles.attributeModal}>
				<h1 className={styles.title}>{this.attributeName}</h1>
				<p className={styles.description}>{this.description}</p>
			</div>
		)
	}
}
Attribute.controls = {
	select: {
		component: null,
	},
	input: {
		component: null,
	},
	boolean: {
		component: null,
	},
};
Attribute.control = 'input';
Attribute.type = 'attribute';
Attribute.defaultValue = 0;
Attribute.defaultVars = [];
