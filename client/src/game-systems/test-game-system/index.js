import FighterClass from "./attributes/FighterClass";
import Spells from './attributes/Spells';
import Class from './attributes/Class';

import registerAttributes from './registry/register-attributes';
import registerStats from './registry/register-stats';
import registerImages from './registry/register-images';
import registerChips from './registry/register-chips';
import registerHeaders from './registry/register-headers';

export default function init(gameController) {
	gameController.registerAttributeType(FighterClass);
	gameController.registerAttributeType(Spells);
	gameController.registerAttributeType(Class);

	registerChips(gameController);
	registerStats(gameController);
	registerImages(gameController);
	registerAttributes(gameController);
	registerHeaders(gameController);

	gameController.registerItem('sword', 0, 0, 'weapon');

	// gameController.registerAttribute('Bardic Inspiration', 'a thing you can do', 'group-Features default', null, true);
	gameController.registerAttribute('Super Punch', 'You punch someone really hard +2 Str', 'group-Features default', 'fighter_class', true);
	gameController.registerAttribute('Spell Attack', 'attack with magic!', 'group-Spells default');

	gameController.setCalcStatBonus((value) => {
		return value >= 30 ? 10 : Math.floor((value - 10) / 2);
	})

	gameController.save();
}
