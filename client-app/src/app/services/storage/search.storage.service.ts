import {Injectable} from "@angular/core";
import {StorageService} from "./storage.service";

export type SearchContent = 'tracks' | 'albums' | 'trackLists' | 'groups' | 'genres';
const contents: SearchContent[] = ['tracks', 'albums', 'trackLists', 'groups', 'genres'];
export type IStorageSearchQueries = Record<SearchContent, string[]>;
const key = 'searchQueries';

@Injectable({
  providedIn: 'root'
})
export class SearchStorageService extends StorageService {

  private readonly _limit = 10;

  public addSearchQuery(searchQuery: string, content: SearchContent) {
    let queries = this.getAllSearchQueries();
    let contentQueries = queries[content];

    if (contentQueries.includes(searchQuery)) return;

    if (contentQueries.length >= this._limit) contentQueries.pop();

    contentQueries = [searchQuery, ...contentQueries];
    queries[content] = contentQueries;
    this.setItem(key, queries);
  }

  public removeQuery(searchQuery: string, content: SearchContent) {
    const queries = this.getAllSearchQueries();
    let contentQueries = queries[content];
    contentQueries = contentQueries.filter(x => x !== searchQuery);
    queries[content] = contentQueries;
    this.setItem(key, queries);
  }

  public getSearchQueries(content: SearchContent): string[] {
    const queries = this.getAllSearchQueries();
    return queries === null ? [] : queries[content];
  }

  public getAllSearchQueries(): IStorageSearchQueries {
    let queries = this.getItem(key) as IStorageSearchQueries;
    if (!queries) {
      queries = {} as IStorageSearchQueries;
      for (let i = 0; i < contents.length; i++) {
        queries[contents[i]] = [];
      }
    }
    return queries;
  }

}
