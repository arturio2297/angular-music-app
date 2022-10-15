import {Pipe, PipeTransform} from "@angular/core";
import {IGenreItem} from "../models/api/genres.models";

@Pipe({
  name: 'genres'
})
export class GenresPipe implements PipeTransform{

  transform(genres: string[] | IGenreItem[], max = 5): UniqueName[] {
    const names = genres.map(x => typeof  x === 'object' ? x.name : x);
    if (!max || genres.length <= max) return names;
    return [...names.filter((x, i) => i + 1 <= max), '...'];
  }

}
