import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'prettyDate'
})
export class PrettyDatePipe implements PipeTransform {

  transform(value: Date | DateString): DateString {
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toLocaleDateString();
  }

}
