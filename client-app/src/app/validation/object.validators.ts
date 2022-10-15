const validateObjects = <T extends { valid: boolean }>(x: T[]): boolean => {
  for (let i = 0; i < x.length; i++) {
    if (!x[i].valid) return false;
  }
  return true;
}

const ObjectValidators = {
  validateObjects
}

export default ObjectValidators;
