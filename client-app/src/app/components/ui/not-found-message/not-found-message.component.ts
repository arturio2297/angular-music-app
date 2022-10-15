import {Component, Input} from "@angular/core";

@Component({
  selector: 'app-not-found-message',
  templateUrl: './not-found-message.component.html',
  styleUrls: ['./not-found-message.component.less']
})
export class NotFoundMessageComponent {

  @Input()
  query: string;

  @Input()
  contentName: string;

  public get message(): string {
    let message = this.query ? `By request "${this.query}" ` : '';
    message += `${this.contentName ? (this.contentName + ' not') : 'nothing'} found`;
    return message;
  }

}
