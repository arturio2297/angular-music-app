import {Injectable} from "@angular/core";
import {
  IStore,
  IRootState,
  IStorePaginationState, LikedItemsState, SavedItemsState
} from "../models/store/store.models";
import {BehaviorSubject, map} from "rxjs";
import {ApiService} from "../services/api/api.service";
import {NavigationService} from "../services/navigation.service";
import {AccountStore} from "./account/account.store";
import {AuthStorageService} from "../services/storage/auth.storage.service";
import {UiStore} from "./ui/ui.store";
import {RegistrationStore} from "./registration/registration.store";
import {GroupsStore} from "./groups/groups.store";
import {ToastsService} from "../services/toasts.service";
import {AlbumsStore} from "./albums/albums.store";
import {PlayerStore} from "./player/player.store";
import {
  AccountStoreDialogState,
  AccountStoreLoadingState,
  IAccountStoreState
} from "../models/store/account.store.models";
import {IRegistrationStoreState, RegistrationStoreLoadingState} from "../models/store/registration.store";
import {IUiStoreState} from "../models/store/ui.store.models";
import {
  GroupsStoreDialogState, GroupsStoreFilterState,
  GroupsStoreLoadingState,
  IGroupsStoreState
} from "../models/store/groups.store.models";
import {
  AlbumsStoreDialogState, AlbumsStoreFilterState,
  AlbumsStoreLoadingState,
  IAlbumsStoreState
} from "../models/store/albums.store.models";
import {
  equalizerFrequencies,
  IAudioPlayerStoreState,
  PlayerStoreLoadingState
} from "../models/store/player.store.models";
import {
  ITracksStoreState,
  TracksStoreDialogState,
  TracksStoreFilterState,
  TracksStoreLoadingState
} from "../models/store/tracks.store.models";
import {TracksStore} from "./tracks/tracks.store";
import {PlayerStorageService} from "../services/storage/player.storage.service";
import {
  ITrackListsStoreState,
  TrackListsStoreDialogState, TrackListsStoreFilterState,
  TrackListsStoreLoadingState
} from "../models/store/track-lists.store.models";
import {TrackListsStore} from "./track-lists/track-lists.store";
import {
  IMeStoreState,
  MeStoreAlbumsFilterState,
  MeStoreLoadingState,
  MeStoreTrackListsFilterState, MeStoreTracksFilterState
} from "../models/store/me.store.models";
import {MeStore} from "./me/me.store";
import {SearchStorageService} from "../services/storage/search.storage.service";
import {GenresStoreFilterState, GenresStoreLoadingState, IGenresStoreState} from "../models/store/gernes.store.models";
import {GenresStore} from "./genres/genres.store";

export const paginationStoreInitialState: IStorePaginationState = {page: 0, size: 15, totalElements: 0, totalPages: 0};

const accountStoreInitialState: IAccountStoreState = {
  account: null,
  loading: {} as AccountStoreLoadingState,
  dialog: {} as AccountStoreDialogState
}

const uiStoreInitialState: IUiStoreState = {
  error: null,
  screenBD: null
}

const registrationStoreInitialState: IRegistrationStoreState = {
  loading: {} as RegistrationStoreLoadingState
}

export const groupsStoreFilterInitialState: GroupsStoreFilterState = {
  search: '',
  tracksCount: 0
}

const groupsStoreInitialState: IGroupsStoreState = {
  loading: {} as GroupsStoreLoadingState,
  dialog: {} as GroupsStoreDialogState,
  groups: [],
  group: null,
  pagination: paginationStoreInitialState,
  filter: groupsStoreFilterInitialState
}

export const albumsStoreFilterInitialState: AlbumsStoreFilterState = {
  search: '',
  groupId: '',
  userId: '',
  tracksCount: 0
}

const albumsStoreInitialState: IAlbumsStoreState = {
  loading: {} as AlbumsStoreLoadingState,
  dialog: {} as AlbumsStoreDialogState,
  albumsForUser: false,
  albums: [],
  album: null,
  search: {
    groups: []
  },
  pagination: paginationStoreInitialState,
  filter: albumsStoreFilterInitialState,
  likedAlbums: {},
  savedAlbums: {}
}

export const tracksStoreFilterInitialState: TracksStoreFilterState = {
  search: '',
  groupId: '',
  albumId: '',
  trackListId: '',
  notInGroup: '',
  notInAlbum: '',
  notInTrackList: ''
};

const tracksStoreInitialState: ITracksStoreState = {
  loading: {} as TracksStoreLoadingState,
  dialog: {} as TracksStoreDialogState,
  tracks: [],
  tracksFor: 'all',
  filter: tracksStoreFilterInitialState,
  pagination: paginationStoreInitialState,
  savedTracks: {},
  likedTracks: {}
}

export const genresStoreFilterInitialState: GenresStoreFilterState = {
  search: ''
}

const genresStoreInitialState: IGenresStoreState = {
  loading: {} as GenresStoreLoadingState,
  genres: [],
  filter: genresStoreFilterInitialState
}

const audioPlayerStoreInitialState: IAudioPlayerStoreState = {
  loading: {} as PlayerStoreLoadingState,
  list: null,
  tracks: null,
  time: {
    currentTime: 0,
    duration: 0
  },
  statuses: {
    play: 'none',
    repeat: 'none'
  },
  volume: 1,
  equalizer: {
    on: false,
    selectedSettingsName: 'default',
    settings: [{name: 'default', gains: equalizerFrequencies.map(x => {return { value: 1, frequency: x }})}]
  },
  visualiser: {
    color: '#ffffff'
  }
}

export const trackListsStoreFilterInitialState: TrackListsStoreFilterState = {
  search: '',
  authorId: '',
  userId: '',
  tracksCount: 0,
  author: '',
  sort: 'createdAt',
  order: 'asc'
}

const trackListsStoreInitialState: ITrackListsStoreState = {
  loading: {} as TrackListsStoreLoadingState,
  dialog: {} as TrackListsStoreDialogState,
  trackListsForUser: false,
  trackLists: [],
  pagination: paginationStoreInitialState,
  filter: trackListsStoreFilterInitialState,
  trackList: null,
  savedTrackLists: {},
  likedTrackLists: {}
}

export const meStoreAlbumsFilterInitialState: MeStoreAlbumsFilterState = {
  search: '',
  groupId: ''
}

export const meStoreTrackListsFilterInitialState: MeStoreTrackListsFilterState = {
  search: '',
  authorId: ''
}

export const meStoreTracksFilterInitialState: MeStoreTracksFilterState = {
  search: ''
}

const meStoreInitialState: IMeStoreState = {
  loading: {} as MeStoreLoadingState,
  albums: {
    items: [],
    filter: meStoreAlbumsFilterInitialState,
    pagination: paginationStoreInitialState
  },
  trackLists: {
    items: [],
    filter: meStoreTrackListsFilterInitialState,
    pagination: paginationStoreInitialState
  },
  tracks: {
    items: [],
    filter: meStoreTracksFilterInitialState,
    pagination: paginationStoreInitialState
  }
}

const initialState: IRootState = {
  accountState: accountStoreInitialState,
  uiState: uiStoreInitialState,
  registrationState: registrationStoreInitialState,
  groupsState: groupsStoreInitialState,
  albumsState: albumsStoreInitialState,
  tracksState: tracksStoreInitialState,
  genresState: genresStoreInitialState,
  playerState: audioPlayerStoreInitialState,
  trackListsState: trackListsStoreInitialState,
  meState: meStoreInitialState
}

@Injectable({
  providedIn: 'root'
})
export class RootStore implements IStore<IRootState> {

  readonly state$ = new BehaviorSubject(initialState);
  uiStore: UiStore;
  accountStore: AccountStore;
  registrationStore: RegistrationStore;
  groupsStore: GroupsStore;
  albumsStore: AlbumsStore;
  tracksStore: TracksStore;
  genresStore: GenresStore;
  playerStore: PlayerStore;
  trackListsStore: TrackListsStore;
  meStore: MeStore;

  constructor(
    private _apiService: ApiService,
    private _navigationService: NavigationService,
    private _authStorage: AuthStorageService,
    private _toastsService: ToastsService,
    private _playerStorage: PlayerStorageService,
    private _searchStorageService: SearchStorageService
  ) {
  }

  public init() {

    this.accountStore = new AccountStore(
      this,
      this.state$.asObservable().pipe(map(x => x.accountState)),
      accountState => this.state$.next({...this.state$.value, accountState}),
      this._apiService,
      this._authStorage,
      this._navigationService
    );

    this.uiStore = new UiStore(
      this.state$.asObservable().pipe(map(x => x.uiState)),
      uiState => this.state$.next({...this.state$.value, uiState}),
      this._navigationService,
      this._toastsService
    );

    this.registrationStore = new RegistrationStore(
      this.state$.asObservable().pipe(map(x => x.registrationState)),
      registrationState => this.state$.next({...this.state$.value, registrationState}),
      this._apiService,
      this._navigationService
    )

    this.groupsStore = new GroupsStore(
      this.state$.asObservable().pipe(map(x => x.groupsState)),
      groupsState => this.state$.next({...this.state$.value, groupsState}),
      this._apiService,
      this._navigationService,
      this._searchStorageService
    );

    this.albumsStore = new AlbumsStore(
      this.state$.asObservable().pipe(map(x => x.albumsState)),
      albumsState => this.state$.next({...this.state$.value, albumsState}),
      this._apiService,
      this._navigationService,
      this._searchStorageService
    );

    this.tracksStore = new TracksStore(
      this.state$.asObservable().pipe(map(x => x.tracksState)),
      tracksState => this.state$.next({...this.state$.value, tracksState}),
      this._apiService,
      this._navigationService,
      this._searchStorageService
    );

    this.genresStore = new GenresStore(
      this.state$.asObservable().pipe(map(x => x.genresState)),
      genresState => this.state$.next({...this.state$.value, genresState}),
      this._apiService,
      this._navigationService,
      this._searchStorageService
    );

    this.playerStore = new PlayerStore(
      this.state$.asObservable().pipe(map(x => x.playerState)),
      playerState => this.state$.next({...this.state$.value, playerState}),
      this._apiService,
      this._navigationService,
      this._playerStorage
    );

    this.trackListsStore = new TrackListsStore(
      this.state$.asObservable().pipe(map(x => x.trackListsState)),
      trackListsState => this.state$.next({...this.state$.value, trackListsState}),
      this._apiService,
      this._navigationService,
      this._searchStorageService
    );

    this.meStore = new MeStore(
      this.state$.asObservable().pipe(map(x => x.meState)),
      meState => this.state$.next({...this.state$.value, meState}),
      this._apiService,
      this._navigationService,
      this._searchStorageService
    );

    this._apiService.init(error => this.uiStore.setError(error));

    this.accountStore.init(() => this._intiStores());
  }

  public handleLogin() {
    this._intiStores();
    this._navigationService.handleLogin();
  }

  public handleLogout() {
    this.state$.next(initialState);
    this._authStorage.removeAuth();
    this._playerStorage.remove('list', 'tracks');
    this._navigationService.handleLogout();
  }

  private _intiStores() {
    this._stores.forEach(x => x.init && x.init());
  }

  private get _stores(): IStore<any>[] {
    return [
      this.groupsStore,
      this.albumsStore,
      this.trackListsStore,
      this.playerStore,
      this.meStore
    ];
  }

}
