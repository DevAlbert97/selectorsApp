import { combineLatest, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country, CountrySmall } from '../interfaces/country';

@Injectable({
  providedIn: 'root',
})
export class CountrysService {
  private _continents: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];
  private _url: string = 'https://restcountries.com/v3.1';

  get continents(): string[] {
    return [...this._continents];
  }

  constructor(private http: HttpClient) {}

  getCountryByRegion(region: string): Observable<CountrySmall[]> {
    return this.http.get<CountrySmall[]>(`${this._url}/region/${region}?fields=name,cca3,`);
  }

  getCountryByCode(code : string) : Observable<Country[] | null | Country> {
    if(!code){
      return of(null) 
    }
    return this.http.get<Country[] | Country>(`${this._url}/alpha?codes=${code}`);
  }
  getCountryByCodeSmall(code : string) : Observable<CountrySmall[] | null> {
    return this.http.get<CountrySmall[]>(`${this._url}/alpha?codes=${code}?fields=name,cca3`);
  }

  getCountrysByCodes(borders: string[]): Observable<CountrySmall[]> {
    if (!borders) {
      return of([]);
    }
    const requests: Observable<CountrySmall>[] = [];
    borders.forEach(code => {
      const request = this.getCountryByCodeSmall(code);
      requests.push(request);
    });

    return combineLatest(requests);
  }
}
