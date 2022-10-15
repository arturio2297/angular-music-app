import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'frequency'
})
export class FrequencyPipe implements PipeTransform {

  transform(value: number): string {
    if (value < 1000) return String(value);
    return value / 1000 + 'k';
  }

}
