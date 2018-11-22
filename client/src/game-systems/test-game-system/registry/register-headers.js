export default (gameController) => {
	gameController.registerAttribute(
		'class',
		'This is the class of a character',
		'core default header',
		null,
		'bard',
		[
			{ name: 'displayLabel', value: false },
			{ name: 'control', value: 'dropdown' },
			{
				name: 'options',
				value: [
					'bard',
					'monk',
				],
			},
		],
	);
	gameController.registerAttribute(
		'race',
		'This is the race of a character',
		'core default header',
		'class',
		'gnome',
		[
			{ name: 'displayLabel', value: false },
			{ name: 'control', value: 'dropdown' },
			{
				name: 'options',
				value: [
					'gnome',
					'elf',
				],
			},
		],
	);
}