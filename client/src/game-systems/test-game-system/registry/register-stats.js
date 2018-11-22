export default (gameController) => {
	gameController.registerAttribute(
		'STR',
		'This is your strength',
		'stat default',
		null,
		8
	);
	gameController.registerAttribute(
		'DEX',
		'This is your dexterity',
		'stat default',
		null,
		10
	);
	gameController.registerAttribute(
		'CON',
		'This is your health stat',
		'stat default',
		null,
		13
	);
	gameController.registerAttribute(
		'INT',
		'This is your intelligence stat',
		'stat default',
		null,
		13
	);
	gameController.registerAttribute(
		'WIS',
		'This is your wisdom stat',
		'stat default',
		null,
		11
	);
	gameController.registerAttribute(
		'CHAR',
		'This is your charisma stat',
		'stat default',
		null,
		15
	);
}