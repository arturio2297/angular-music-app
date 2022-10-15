import {Pipe, PipeTransform} from "@angular/core";
import DateUtils from "../utils/date.utils";

@Pipe({
  name: 'prettyTime'
})
export class PrettyTimePipe implements PipeTransform {

  transform(time: number): string {
    return DateUtils.prettyTime(time);
  }

}
