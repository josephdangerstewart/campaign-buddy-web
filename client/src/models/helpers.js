export function extractDefaultModelFromSchema(schema) {
	if (typeof schema === 'object' && !Array.isArray(schema)) {
		const rval = {};
		for (let o in schema) {
			if (o.toLowerCase() !== '!comment!')
				rval[o] = extractDefaultModelFromSchema(schema[o]);
		}
		return rval;
	} else if (typeof schema === 'object' && typeof schema[0] === 'string' && schema[0].toLowerCase().trim() === '!oneof!' && schema[1]) {
		return extractDefaultModelFromSchema(schema[1]);
	} else if (typeof schema === 'object') {
		return [];
	} else if (typeof schema === 'string') {
		const sValue = schema.split(':');
		const type = sValue[0].toLowerCase().trim();
		if (sValue[1] && sValue[1].toLowerCase().trim() !== 'required') {
			const value = sValue[1].trim();
			const isRequired = sValue[2] && sValue[2].toLowerCase().trim() === 'required';
			if (type === 'string') {
				return value.substring(1, value.length - 1);
			} else if (type === 'number') {
				return parseFloat(value) || null;
			} else if (type === 'boolean' || type === 'bool') {
				return value.toLowerCase() === 'true';
			} else if (type === 'object' || type === 'array') {
				try {
					return JSON.parse(value);
				} catch (e) {
					return isRequired ? type === 'object' ? {} : [] : null;
				}
			} else if (type === 'from') {
				const fromObject = handleFrom(value);
				if (fromObject) return extractDefaultModelFromSchema(fromObject);
				else return null;
			} else if (type === 'const' || type === 'constant') {
				return value;
			} else {
				return isRequired ? true : null;
			}
		} else if (type === 'array') {
			return [];
		} else if (type === 'object') {
			return {};
		} else if (sValue[1]) {
			if (type === 'string') {
				return '';
			} else if (type === 'number') {
				return 0;
			} else if (type === 'boolean') {
				return true;
			}
		} else {
			return null;
		}
	} else {
		return null;
	}
}

export function handleFrom(path) {
	const sVal = path.split('|');
	if (sVal[1]) {
		try {
			return require(`./${sVal[0]}/${sVal[1]}.json`);
		} catch (e) {
			console.log(e);
			return null;
		}
	} else {
		try {
			return require(`./core/${path}.json`);
		} catch (e) {
			return null;
		}
	}
}

function getStatus(status, message, location) {
	return {
		status,
		message,
		location
	};
}

export function isModelValid(model, schema, location = 'model') {
	for (let o in schema) {
		if (typeof schema[o] === 'object' && !Array.isArray(schema[o])) {
			if (model && typeof model[o] === 'object' && !Array.isArray(model[o])) {
				const rVal = isModelValid(model[o], schema[o], `${location}.${o}`);
				if (!rVal.status) return rVal;
			} else {
				return getStatus(false, 'Expected object', `${location}.${o}`);
			}
		} else if (typeof schema[o] === 'object') {

			// Get expected array type from first element in Schema array UNLESS
			// first type is one of
			let expectedType;
			let modelShouldBeArray = true;
			let fromObject;
			if (typeof schema[o][0] === 'string' && schema[o][0].toLowerCase().trim() === '!oneof!') {
				expectedType = schema[o][1].split(':')[0].toLowerCase().trim();
				modelShouldBeArray = false;
			} else if (typeof schema[o][0] === 'object') {
				expectedType = 'object';
			} else if (typeof schema[o][0] === 'string') {
				const sVal = schema[o][0].split(':');
				if (sVal[0].toLowerCase().trim() === 'from') {
					expectedType = 'from';
					fromObject = handleFrom(sVal[1].trim());
				}
				expectedType = schema[o][0].split(':')[0].toLowerCase().trim();
			} else {
				expectedType = 'any';
			}

			if (modelShouldBeArray) {
				if (!Array.isArray(model[o])) return getStatus(false, 'Expected array', `${location}.${o}`);
				for (let i = 0; i < model[o].length; i++) {

					if (expectedType === 'object') {
						const rVal = isModelValid(model[o][i], schema[o][0], `${location}.${o}[${i}]`);
						if (!rVal.status) return rVal;
					}
					else if (expectedType === 'from') {
						const rVal = isModelValid(model[o][i], fromObject, `${location}.${o}[${i}]`);
						if (!rVal.status) return rVal;
					}
					else if (typeof model[o][i] !== expectedType && expectedType !== 'any' && expectedType !== 'all') return getStatus(false, `Expected type ${expectedType}: got ${JSON.stringify(model[o][i])}`, `${location}.${o}[${i}]`);
				
				}
			} else {
				let found = false;
				for (let i = 1; i < schema[o].length; i++) {
					const element = schema[o][i];
					if (typeof element === 'object') {
						const rVal = isModelValid(model[o][i], element, `${location}.${o}`);
						if (rVal.status) found = true;
						break;
					} else if (typeof element === 'string') {
						const sVal = element.split(':');
						const newExpectedType = sVal[0].toLowerCase().trim();
						if (newExpectedType === 'null') {
							found = true;
							break;
						} if (newExpectedType === 'from') {
							const fromObject = handleFrom(sVal[1].trim());
							const rVal = isModelValid(model[o], fromObject, `${location}.${o}`);
							if (rVal.status) found = true;
							break;
						} else if (newExpectedType === 'array') {
							if (Array.isArray(model[o])) {
								found = true;
								break;
							}
						} else if (newExpectedType === 'const' || newExpectedType === 'constant') {
							if (sVal[1] && sVal[1] === model[o]) {
								found = true;
								break;
							}
						} else if (sVal[1]) {
							const expectedValue = sVal[1].trim();
							if (newExpectedType === 'string' && `'${model[o]}'` === expectedValue) {
								found = true;
								break;
							} else if (newExpectedType === 'number' && model[o] == parseFloat(expectedValue)) {
								found = true;
								break;
							} else if ((newExpectedType === 'boolean' || newExpectedType === 'bool') && (expectedValue === 'true') === model[o]) {
								found = true;
								break;
							}
						} else {
							if (typeof model[o] === newExpectedType) {
								found = true;
								break;
							}
						}
					} else {
						return getStatus(false, `Schema error: unknown type, expected string or object got ${typeof element}`, `${location}.${o}`);
					}
				}
				if (!found) return getStatus(false, 'Expected one of type', `${location}.${o}`);
			}

		} else {
			const sVal = schema[o].split(':');
			const expectedType = sVal[0].toLowerCase();
			const isRequired = (sVal[1] && sVal[1].toLowerCase().trim() === 'required') || (sVal[2] && sVal[2].toLowerCase().trim() === 'required');
			if (expectedType === 'from') {
				const fromObject = handleFrom(sVal[1].trim());
				if (!fromObject) return getStatus(false, `Error in Schema handling 'from' (path = '${sVal[1].trim()}')`, `${location}.${o}`);
				if (typeof model[o] === 'object') {
					const rVal = isModelValid(model[o], fromObject, `${location}.${o}`);
					if (!rVal.status) return rVal;
				} else {
					return getStatus(false, `Expected object: got ${typeof model[o]}`, `${location}.${o}`)
				}
			} else if (expectedType === 'const' || expectedType === 'constant') {
				const expectedValue = sVal[1].trim();
				if (model[o] !== expectedValue) return getStatus(false, `Expected value ${expectedValue}, got ${model[o]}`, `${location}.${o}`);
			}
			if (isRequired && typeof model[o] !== expectedType && expectedType !== 'any' && expectedType !== 'all') return getStatus(false, `Expected required type ${expectedType}: got ${JSON.stringify(model[o])}`, `${location}.${o}`);
		}
	}

	return getStatus(true, 'OK');
}
