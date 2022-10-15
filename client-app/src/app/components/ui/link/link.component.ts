import {Component, Input} from '@angular/core';
import applicationUrls, {ApplicationUrlKey} from "../../../models/navigation/navigation.models";

export type LinkVariant = 'blue' | 'white' | 'dark';
export type LinkLike = 'link' | 'h1' | 'h2' | 'h3';

type Params =  Record<string, string | number>;

const withParams = (url:string, params: Params) => {
  let value = url;
  for (const key in params) {
    value = value.replace(`:${key}`, String(params[key]));
  }
  return value;
}

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.less']
})
export class LinkComponent {

  @Input()
  underline = false;

  @Input()
  like: LinkLike = 'link';

  @Input()
  variant: LinkVariant = 'blue';

  @Input()
  urlKey: ApplicationUrlKey;

  @Input()
  url: string;

  @Input()
  params: Params;

  @Input()
  queryParams: Params = {};

  public get appUrl(): string {
    if (this.url !== undefined) return this.url;

    let value = '/' + applicationUrls[this.urlKey].value;

    if (this.params) value = withParams(value, this.params);

    return value;
  }

}
