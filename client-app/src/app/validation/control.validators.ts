import {AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
import {map, Observable} from "rxjs";
import {FileControlValue, ImageControlValue} from "../models/controls/control.models";

export type SameValidatorOptions = { fieldAlias?: string, sameFieldAlias?: string }

const same = (fieldName: string, sameFieldName: string, opt?: SameValidatorOptions): ValidatorFn => {
  return (form: AbstractControl): ValidationErrors | null => {
    const field = form.get(fieldName);
    const sameField = form.get(sameFieldName);

    if (!field || !sameField)
      throw new Error('Controls not found in form');

    const value = field.value;
    const sameValue = sameField.value;
    const error = {
      field: {name: fieldName, alias: opt ? opt.fieldAlias : null},
      sameField: {name: sameFieldName, alias: opt ? opt.sameFieldAlias : null}
    }

    if (value !== sameValue) field.setErrors({...field.errors, sameEqual: error});

    return null;
  }
}

const imageRequired = (fieldName: string): ValidatorFn => {
  return (form: AbstractControl): ValidationErrors | null => {
    const field = form.get(fieldName);

    if (!field)
      throw new Error('Controls not found in form');

    const value = field.value as ImageControlValue;
    const error = { imageRequired: true };

    return value ? null : error;
  }
}

const audioRequired = (fieldName: string): ValidatorFn => {
  return (form: AbstractControl): ValidationErrors | null => {
    const field = form.get(fieldName);

    if (!field)
      throw new Error('Controls not found in form');

    const value = field.value as FileControlValue;
    const error = { audioRequired: true };

    return value ? null : error;
  }
}

const groupRequired = (fieldName: string, groupItemFieldName: string): ValidatorFn => {
  return (form: AbstractControl): ValidationErrors | null => {
    const field = form.get(fieldName);
    const itemField = form.get(groupItemFieldName);

    if (!field || !itemField)
      throw new Error('Controls not found in form');

    if (!itemField.value) field.setErrors({...field.errors, groupRequired: true});

    return null;
  }
}

const genresRequired = (fieldName: string, genresArrayFieldName: string): ValidatorFn => {
  return (form: AbstractControl): ValidationErrors | null => {
    const field = form.get(fieldName);
    const arrayField = form.get(genresArrayFieldName);

    if (!field || !arrayField)
      throw new Error('Controls not found in form');

    if (!Array.isArray(arrayField.value)) return null;

    const genres = arrayField.value;

    if (!genres.length) field.setErrors({...field.errors, genresRequired: true});

    return null;
  }
}

const checkUserExistsByEmail = (checkFunc: (email: string) => Observable<boolean>, moreEmails?: string[]): AsyncValidatorFn => {
  return (control: AbstractControl) => {
    if (!control.value || (control.value.errors && control.value.errors.email) || !control.dirty) {
      return Promise.resolve(null);
    }

    const error = {userExistsByEmail: control.value};

    if (moreEmails && moreEmails.includes(control.value)) {
      return Promise.resolve(error);
    }

    return checkFunc(control.value as string)
      .pipe(
        map(x => x ? error : null)
      );
  }
}

const checkUserExistsByUsername = (checkFunc: (username: string) => Observable<boolean>, moreNames?: UniqueName[]): AsyncValidatorFn => {
  return (control: AbstractControl) => {
    if (!control.value || !control.dirty) {
      return Promise.resolve(null);
    }

    const error = {userExistsByUsername: control.value};

    if (moreNames && moreNames.includes(control.value)) {
      return Promise.resolve(error);
    }

    return checkFunc(control.value as string)
      .pipe(
        map(x => x ? error : null)
      );
  }
}

const checkGroupExistsByName = (checkFunc: (name: string) => Observable<boolean>, moreNames?: UniqueName[]): AsyncValidatorFn => {
  return (control: AbstractControl) => {
    if (!control.value || !control.dirty) {
      return Promise.resolve(null);
    }

    const error = {groupExistsByName: control.value};

    if (moreNames && moreNames.includes(control.value)) {
      return Promise.resolve(error);
    }

    return checkFunc(control.value as string)
      .pipe(
        map(x => x ? error : null)
      );
  }
}

const checkAlbumExistsByName = (checkFunc: (name: string, groupId: ID) => Observable<boolean>, groupFieldName: string): AsyncValidatorFn => {
  return (control: AbstractControl) => {
    const form = control.parent as FormGroup;

    if (!form)
      return Promise.resolve(null);

    const groupField = form.get(groupFieldName);

    if (!groupField)
      throw new Error('Control not found in form');

    if (!control.value || !control.dirty || !groupField.value)
      return Promise.resolve(null);

    const albumName = control.value as string;
    const group = groupField.value;
    const error = {albumExistsByName: { albumName: albumName, groupName: group.name }};

    return checkFunc(albumName, group.id)
      .pipe(
        map(x => x ? error : null)
      );
  }
}

const checkTrackExistsByName = (checkFunc: (name: string) => Observable<boolean>): AsyncValidatorFn => {
  return (control: AbstractControl) => {
    if (!control.value || !control.dirty)
      return Promise.resolve(null);

    const error = { trackExistsByName: control.value };

    return checkFunc(control.value)
      .pipe(
        map(x => x ? error : null)
      )
  }
}

const checkTrackListExistsByName = (checkFunc: (name: string) => Observable<boolean>): AsyncValidatorFn => {
  return (control: AbstractControl) => {
    if (!control.value || !control.dirty)
      return Promise.resolve(null);

    const error = { trackListExistsByName: control.value };

    return checkFunc(control.value)
      .pipe(
        map(x => x ? error : null)
      );
  }
}

const AdditionalValidators = {
  same,
  imageRequired,
  audioRequired,
  groupRequired,
  genresRequired,
  checkUserExistsByEmail,
  checkUserExistsByUsername,
  checkGroupExistsByName,
  checkAlbumExistsByName,
  checkTrackExistsByName,
  checkTrackListExistsByName
}

export default AdditionalValidators;
