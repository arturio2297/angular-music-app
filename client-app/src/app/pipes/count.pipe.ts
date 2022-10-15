import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'count'
})
export class CountPipe implements PipeTransform {

  transform(value: number | string): string {
    const count = typeof value === 'number' ? value : Number(value);
    if (count < 10000) return String(count);
    return Math.round(count / 1000) + 'k';
  }

}
