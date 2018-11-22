import { extractDefaultModelFromSchema, isModelValid, handleFrom } from './helpers';
import mainSchema from './main.json';
import characterSchema from './core/character-model.json';

export const generateNewModel = () => {
	return extractDefaultModelFromSchema(mainSchema);
}

export const generateCharacterModel = () => {
	return extractDefaultModelFromSchema(characterSchema);
}

export const validateModel = (model) => {
	return isModelValid(model, mainSchema);
}

export const validateCharacterModel = (model) => {
	return isModelValid(model, characterSchema);
}

export const validate = (model, schema) => {
	const fromObject = handleFrom(schema);
	if (!fromObject) return { status: false, message: 'Schema not found'};
	return isModelValid(model, fromObject);
}
