import {Component} from '@angular/core';
import {RootStore} from "../../../../stores/root.store";
import {ToastsService} from "../../../../services/toasts.service";
import {GroupsStore} from "../../../../stores/groups/groups.store";
import {CreateGroupFormEvent} from "./blocks/create-group-form/create-group-form.component";

@Component({
  selector: 'app-create.group.page',
  templateUrl: './create-group-page.component.html',
  styleUrls: ['./create-group-page.component.less']
})
export class CreateGroupPageComponent {

  constructor(
    private _rootStore: RootStore,
    private _toastsService: ToastsService
  ) {
  }

  public createGroup({ request, image }: CreateGroupFormEvent) {
    this._groupsStore.addGroup(
      request,
      image,
      () => this._toastsService.push('Music group successfully created', 'success')
    );
  }

  private get _groupsStore(): GroupsStore {
    return this._rootStore.groupsStore;
  }

}
