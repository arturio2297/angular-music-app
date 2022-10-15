import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'trunc'
})
export class TruncPipe implements PipeTransform {

  transform(value: string, length: number): string {
    return (value.length - 3) >= length ? `${value.substring(0, length)}...` : value;
  }

}
