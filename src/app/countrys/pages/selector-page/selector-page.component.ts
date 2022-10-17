import { switchMap, tap } from 'rxjs/operators';
import { Country, CountrySmall } from './../../interfaces/country';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CountrysService } from '../../services/countrys.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.sass']
})
export class SelectorPageComponent implements OnInit {

  myForm: FormGroup = this.fB.group({
    continent   : ['', Validators.required],
    country     : ['', Validators.required],
    frontier    : ['', Validators.required]
  });

  continents  : string []               = [];
  countrys    : CountrySmall[]          = [];
  // frontiers   : string [] | undefined   = [];
  frontiers   : CountrySmall [] | undefined   = [];

  //UI
  loading: boolean = false;

  constructor(private fB: FormBuilder, private countrysService: CountrysService) { }

  ngOnInit(): void {
    this.continents = this.countrysService.continents;
    
    //* Cuando cambia el continente
    this.myForm.get('continent')?.valueChanges.pipe(
      tap( () => {
        this.myForm.get('country')?.reset("");
        this.loading = true;
      }),
      switchMap(region => this.countrysService.getCountryByRegion(region))
    ).subscribe(country => {
        this.countrys=country;
        this.loading=false;
      });

    //* Cuando cambia el pais
    this.myForm.get('country')?.valueChanges.pipe(
      tap( () => {
        this.myForm.get('frontier')?.reset("");
        this.loading = true;
      }),
      switchMap(code => this.countrysService.getCountryByCode(code)),
      switchMap(country => this.countrysService.getCountrysByCodes(country?.borders!))
    ).subscribe(country => {
        // this.frontiers = country ? country[0]?.borders: [];
        this.loading = false;
      });
  }

  saveCountry() {

  }

}
