import {ValidationErrors} from "@angular/forms";

type ValidationErrorKey = 'required' | 'email' | 'sameEqual' | 'maxlength' | 'userExistsByUsername' |
  'userExistsByEmail' | 'groupExistsByName' | 'groupRequired' | 'albumExistsByName' | 'trackExistsByName' |
  'trackListExistsByName'
type ValidationErrorsType = Record<ValidationErrorKey, any>;

type MaxLengthValidationResult = { requiredLength: number, actualLength: number };
type SameValidationResult = { field: { name: string, alias: string | null }, sameField: { name: string, alias: null } };
type UserExistsByEmailValidationResult = string;
type UserExistsByUsernameValidationResult = string;
type GroupExistsByNameValidationResult = string;
type GroupRequiredValidationResult = boolean;
type AlbumExistsByNameValidationResult = { albumName: string, groupName: string };
type TrackExistsByNameValidationResult = string;
type TrackListExistsByNameValidationResult = string;

type MessageOptions = Record<string, ValidationMessage>;

const defaultMessageFunctions: Record<ValidationErrorKey, (error: any) => string> = {
  required: () => 'Field is required',
  email: () => 'Please enter a valid email address',
  sameEqual: error => {
    const result = error as SameValidationResult;
    const name = result.field.alias || result.field.name;
    const sameName = result.sameField.alias || result.sameField.name;
    return `${name} and ${sameName} must be the same`;
  },
  maxlength: error => {
    const result = error as MaxLengthValidationResult;
    const curVal = result.actualLength;
    const reqVal = result.requiredLength;
    return `Maximum number of characters: ${reqVal}, current number: ${curVal}`;
  },
  userExistsByEmail: error => {
    const result = error as UserExistsByEmailValidationResult;
    return `User with email: "${result}" already exists`;
  },
  userExistsByUsername: error => {
    const result = error as UserExistsByUsernameValidationResult;
    return `User with username: "${result}" already exists`;
  },
  groupExistsByName: error => {
    const result = error as GroupExistsByNameValidationResult;
    return `Group with name: "${result}" already exists`;
  },
  groupRequired: () => 'You must be select already existed music group',
  albumExistsByName: error => {
    const result = error as AlbumExistsByNameValidationResult;
    return `Music group "${result.groupName}" already contains album "${result.albumName}"`
  },
  trackExistsByName: error => {
    const result = error as TrackExistsByNameValidationResult;
    return `This music album already contains track "${result}"`;
  },
  trackListExistsByName: error => {
    const result = error as TrackListExistsByNameValidationResult;
    return `Track list with name "${result}" already exists`;
  }

}

const getMessages = (e: ValidationErrors, options?: MessageOptions): ValidationMessage[] => {
  const errors = e as ValidationErrorsType;
  const result = [] as ValidationMessage[];

  const pushMessage = (errorKey: ValidationErrorKey): void => {
    const error = errors[errorKey];
    if (!error) return;
    const message = options ? options[errorKey] : null;
    const defaultMessage = defaultMessageFunctions[errorKey] ? defaultMessageFunctions[errorKey](error) : '';
    result.push(message || defaultMessage || `Validation message for error type: ${errorKey} not found`);
  }

  for (const errorKey in errors) {
    pushMessage(errorKey as ValidationErrorKey);
  }

return result;
}

const ValidationUtils = {
  getMessages
}

export default ValidationUtils;
