import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MePageComponent } from './components/pages/me-page/me-page.component';
import { AlbumsPageComponent } from './components/pages/albums/albums-page/albums-page.component';
import { GroupsPageComponent } from './components/pages/groups/groups-page/groups-page.component';
import { TrackListsPageComponent } from './components/pages/track-lists/track-lists-page/track-lists-page.component';
import { TrackListDetailsPageComponent } from './components/pages/track-lists/track-list-details-page/track-list-details-page.component';
import { AlbumDetailsPageComponent } from './components/pages/albums/album-details-page/album-details-page.component';
import { GroupDetailsPageComponent } from './components/pages/groups/group-details-page/group-details-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { HeaderComponent } from './components/header/header.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { FormControlComponent } from './components/ui/form-control/form-control.component';
import { ButtonComponent } from './components/ui/button/button.component';
import {HttpClientModule} from "@angular/common/http";
import APP_PROVIDERS from "./configuration/app.providers";
import { RegistrationPageComponent } from './components/pages/registration-page/registration-page.component';
import { SpinnerComponent } from './components/ui/spinner/spinner.component';
import { LinkComponent } from './components/ui/link/link.component';
import { ToastsComponent } from './components/common/toasts/toasts.component';
import {allIcons, NgxBootstrapIconsModule} from "ngx-bootstrap-icons";
import { ModalComponent } from './components/ui/modal/modal.component';
import { LogoutDialogComponent } from './components/common/dialogs/logout-dialog/logout-dialog.component';
import { AccountActionsComponent } from './components/header/blocks/account-actions/account-actions.component';
import {TruncPipe} from "./pipes/trunc.pipe";
import { InfoFieldComponent } from './components/ui/info-field/info-field.component';
import { AccountPageComponent } from './components/pages/account-page/account-page.component';
import {ImageCropperModule} from "ngx-image-cropper";
import { CropImageDialogComponent } from './components/common/dialogs/crop-image-dialog/crop-image-dialog.component';
import {DropDirective} from "./directives/drop.directive";
import { PersonalDataFormComponent } from './components/pages/account-page/blocks/personal-data-form/personal-data-form.component';
import { NavigationComponent } from './components/header/blocks/navigation/navigation.component';
import { CreateGroupPageComponent } from './components/pages/groups/create-group-page/create-group-page.component';
import { AlertComponent } from './components/ui/alert/alert.component';
import { DropdownListComponent } from './components/ui/dropdown-list/dropdown-list.component';
import { EditGroupPageComponent } from './components/pages/groups/edit-group-page/edit-group-page.component';
import { GroupListItemComponent } from './components/common/groups/group-list-item/group.list.item.component';
import {GenresPipe} from "./pipes/genres.pipe";
import { SearchGroupsComponent } from './components/pages/groups/groups-page/blocks/groups-header/groups-header.component';
import { ActionButtonComponent } from './components/ui/action-button/action-button.component';
import { CreateGroupFormComponent } from "./components/pages/groups/create-group-page/blocks/create-group-form/create-group-form.component";
import { CreateGroupHeaderComponent } from './components/pages/groups/create-group-page/blocks/create-group-header/create-group-header.component';
import {RemoveGroupDialogComponent} from "./components/common/dialogs/remove-group-dialog/remove-group-dialog.component";
import {EditGroupFormComponent} from "./components/pages/groups/edit-group-page/blocks/edit-group-form/edit-group-form.component";
import {EditGroupHeaderComponents} from "./components/pages/groups/edit-group-page/blocks/edit-group-header/edit-group-header.components";
import {AlbumsHeaderComponent} from "./components/pages/albums/albums-page/blocks/albums-header/albums-header.component";
import {AlbumListItemComponent} from "./components/common/albums/album-list-item/album-list-item.component";
import { CreateAlbumPageComponent } from './components/pages/albums/create-album-page/create-album-page.component';
import {CreateAlbumHeaderComponent} from "./components/pages/albums/create-album-page/blocks/create-album-header/create-album-header.component";
import {CreateAlbumFromComponent} from "./components/pages/albums/create-album-page/blocks/create-album-form/create-album-from.component";
import {DropZoneComponent} from "./components/ui/drop-zone/drop-zone.component";
import {ImageComponent} from "./components/ui/image/image-component";
import {EditAlbumPageComponent} from "./components/pages/albums/edit-album-page/edit-album-page.component";
import {RemoveAlbumDialogComponent} from "./components/common/dialogs/remove-album-dialog/remove-album-dialog.component";
import {EditAlbumHeaderComponent} from "./components/pages/albums/edit-album-page/blocks/edit-album-header/edit-album-header.component";
import {EditAlbumFormComponent} from "./components/pages/albums/edit-album-page/blocks/edit-album-form/edit-album-form.component";
import {AlbumDetailsHeaderComponent} from "./components/pages/albums/album-details-page/blocks/album-details-header/album-details-header.component";
import {AddTrackDialogComponent} from "./components/common/dialogs/add-track-dialog/add-track-dialog.component";
import {TextButtonComponent} from "./components/ui/text-button/text-button.component";
import {PrettyDatePipe} from "./pipes/pretty-date.pipe";
import {AudioPlayerComponent} from "./components/player/audio-player/audio-player.component";
import {TrackListItemComponent} from "./components/common/tracks/track-list-item/track-list-item.component";
import {PrettyTimePipe} from "./pipes/pretty-time.pipe";
import {RemoveTrackDialogComponent} from "./components/common/dialogs/remove-track-dialog/remove-track-dialog.component";
import {ActionsDropdownComponent} from "./components/ui/actions-dropdown/actions-dropdown.component";
import {EditTrackDialogComponent} from "./components/common/dialogs/edit-track-dialog/edit-track-dialog.component";
import {LikeActionComponent} from "./components/ui/like-action/like-action.component";
import {SaveActionComponent} from "./components/ui/save-action/save-action.component";
import {PlayerInitializerComponent} from "./components/player/player-initializer/player-initializer.component";
import {RangeControlComponent} from "./components/ui/range-control/range-control.component";
import {GroupDetailsHeaderComponent} from "./components/pages/groups/group-details-page/blocks/group-details-header/group-details-header.component";
import {PlayIndicatorComponent} from "./components/ui/play-indicator/play-indicator.component";
import {StopIndicatorComponent} from "./components/ui/stop-indicator/stop-indicator.component";
import {TrackListsHeaderComponent} from "./components/pages/track-lists/track-lists-page/blocks/track-lists-header/track-lists-header.component";
import {CreateTrackListPageComponent} from "./components/pages/track-lists/create-track-list-page/create-track-list-page.component";
import {CreateTrackListHeaderComponent} from "./components/pages/track-lists/create-track-list-page/blocks/create-track-list-header/create-track-list-header.component";
import {CreateTrackListFormComponent} from "./components/pages/track-lists/create-track-list-page/blocks/create-track-list-form/create-track-list-form.component";
import {EditTrackListPageComponent} from "./components/pages/track-lists/edit-track-list-page/edit-track-list-page.component";
import {EditTrackListHeaderComponent} from "./components/pages/track-lists/edit-track-list-page/blocks/edit-track-list-header/edit-track-list-header.component";
import {EditTrackListFormComponent} from "./components/pages/track-lists/edit-track-list-page/blocks/edit-track-list-form/edit-track-list-form.component";
import {ListOfTracksItemComponent} from "./components/common/track-lists/list-of-tracks-item/list-of-tracks-item.component";
import {ScrollDirective} from "./directives/scroll.directive";
import {HintComponent} from "./components/ui/hint/hint.component";
import {HintDirective} from "./directives/hint.directive";
import {TrackListDetailsHeaderComponent} from "./components/pages/track-lists/track-list-details-page/blocks/track-list-details-header.component";
import {RemoveTrackListDialogComponent} from "./components/common/dialogs/remove-track-list-dialog/remove-track-list-dialog.component";
import {MeHeaderComponent} from "./components/pages/me-page/blocks/me-header/me-header.component";
import {LoaderComponent} from "./components/ui/loader/loader.component";
import {NotFoundMessageComponent} from "./components/ui/not-found-message/not-found-message.component";
import {MeTracksPageComponent} from "./components/pages/me-page/me-tracks-page/me-tracks-page.component";
import {MeTracksHeaderComponent} from "./components/pages/me-page/me-tracks-page/blocks/me-tracks-header/me-tracks-header.component";
import {MeAlbumsPageComponent} from "./components/pages/me-page/me-albums-page/me-albums-page.component";
import {MeAlbumsHeaderComponent} from "./components/pages/me-page/me-albums-page/blocks/me-albums-header/me-albums-header.component";
import {MeTrackListsPageComponent} from "./components/pages/me-page/me-track-lists-page/me-track-lists-page.component";
import {MeTrackListsHeaderComponent} from "./components/pages/me-page/me-track-lists-page/blocks/me-track-lists-header/me-track-lists-header.component";
import {MeMainPageComponent} from "./components/pages/me-page/me-main/me-main-page.component";
import {SearchControlComponent} from "./components/ui/search-control/search-control.component";
import {GroupAlbumsPageComponent} from "./components/pages/groups/group-details-page/group-albums-page/group-albums-page.component";
import {GroupAlbumsHeaderComponent} from "./components/pages/groups/group-details-page/group-albums-page/blocks/group-albums-header/group-albums-header.component";
import {GroupTracksPageComponent} from "./components/pages/groups/group-details-page/group-tracks-page/group-tracks-page.component";
import {GroupTracksHeaderComponent} from "./components/pages/groups/group-details-page/group-tracks-page/blocks/group-tracks-header/group-tracks-header.component";
import {EqualizerDashboardComponent} from "./components/player/audio-player/blocks/equalizer-dashboard/equalizer-dashboard.component";
import {RadioButtonComponent} from "./components/ui/radio-button/radio-button.component";
import {FrequencyPipe} from "./pipes/frequency.pipe";
import {MouseWheelDirective} from "./directives/mouse-wheel.directive";
import {ItemCountersComponent} from "./components/ui/item-counters/item-counters.component";
import {CountPipe} from "./pipes/count.pipe";
import {CarouselComponent} from "./components/ui/carousel/carousel.component";
import {DialogsComponent} from "./components/dialogs/dialogs.component";

@NgModule({
  declarations: [
    AppComponent,
    MePageComponent,
    AlbumsPageComponent,
    GroupsPageComponent,
    TrackListsPageComponent,
    TrackListDetailsPageComponent,
    AlbumDetailsPageComponent,
    GroupDetailsPageComponent,
    GroupAlbumsPageComponent,
    GroupAlbumsHeaderComponent,
    GroupTracksPageComponent,
    GroupTracksHeaderComponent,
    LoginPageComponent,
    HeaderComponent,
    FormControlComponent,
    ButtonComponent,
    RegistrationPageComponent,
    SpinnerComponent,
    LinkComponent,
    ToastsComponent,
    ModalComponent,
    LogoutDialogComponent,
    AccountActionsComponent,
    TruncPipe,
    InfoFieldComponent,
    AccountPageComponent,
    CropImageDialogComponent,
    DropDirective,
    PersonalDataFormComponent,
    NavigationComponent,
    CreateGroupPageComponent,
    AlertComponent,
    DropdownListComponent,
    EditGroupPageComponent,
    GroupListItemComponent,
    GenresPipe,
    SearchGroupsComponent,
    ActionButtonComponent,
    CreateGroupFormComponent,
    CreateGroupHeaderComponent,
    RemoveGroupDialogComponent,
    EditGroupFormComponent,
    EditGroupHeaderComponents,
    AlbumsHeaderComponent,
    AlbumListItemComponent,
    CreateAlbumPageComponent,
    CreateAlbumHeaderComponent,
    CreateAlbumFromComponent,
    DropZoneComponent,
    ImageComponent,
    EditAlbumPageComponent,
    RemoveAlbumDialogComponent,
    EditAlbumHeaderComponent,
    EditAlbumFormComponent,
    AlbumDetailsHeaderComponent,
    AddTrackDialogComponent,
    TextButtonComponent,
    PrettyDatePipe,
    TrackListItemComponent,
    PlayerInitializerComponent,
    AudioPlayerComponent,
    RangeControlComponent,
    PrettyTimePipe,
    RemoveTrackDialogComponent,
    EditTrackDialogComponent,
    ActionsDropdownComponent,
    LikeActionComponent,
    SaveActionComponent,
    GroupDetailsHeaderComponent,
    PlayIndicatorComponent,
    StopIndicatorComponent,
    TrackListsHeaderComponent,
    CreateTrackListPageComponent,
    CreateTrackListHeaderComponent,
    CreateTrackListFormComponent,
    EditTrackListPageComponent,
    EditTrackListHeaderComponent,
    EditTrackListFormComponent,
    ListOfTracksItemComponent,
    ScrollDirective,
    HintComponent,
    HintDirective,
    TrackListDetailsHeaderComponent,
    RemoveTrackListDialogComponent,
    MeHeaderComponent,
    LoaderComponent,
    NotFoundMessageComponent,
    MeMainPageComponent,
    MeTracksPageComponent,
    MeTracksHeaderComponent,
    MeAlbumsPageComponent,
    MeAlbumsHeaderComponent,
    MeTrackListsPageComponent,
    MeTrackListsHeaderComponent,
    SearchControlComponent,
    EqualizerDashboardComponent,
    RadioButtonComponent,
    FrequencyPipe,
    MouseWheelDirective,
    ItemCountersComponent,
    CountPipe,
    CarouselComponent,
    DialogsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxBootstrapIconsModule.pick(allIcons),
    ImageCropperModule,
  ],
  providers: [...APP_PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule { }
