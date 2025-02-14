import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { HttpClient } from '@angular/common/http';
import { formatCurrency } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';

declare const $ : any;

@Component({
  selector: 'app-forex',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './forex.component.html',
  styleUrl: './forex.component.css'
})

export class ForexComponent implements AfterViewInit{
  private _table1 : any;

  constructor(private renderer: Renderer2, private httpClient: HttpClient){}

  ngAfterViewInit(): void {
    this.renderer.removeClass(document.body, "sidebar-open");
    this.renderer.addClass(document.body, "sidebar-closed");
    this.renderer.addClass(document.body, "sidebar-collapsed");

    this._table1 = $("#table1").DataTable({
      "columnDefs": [
        {
          "targets": 3,
          "className": "text-right"
        }
      ],
    }),

    this.bindTable1();
  }

    // bindTable1(): void {
    //   console.log("bindTable1()");
      
    //   var url = "https://openexchangerates.org/api/latest.json?app_id=d7c1514b62f74fdeb17ccaa27ea45aef";

    //   this.httpClient.get(url).subscribe((data: any) => {
    //     var rates = data.rates;
    //     console.log(rates);

    //     let index = 1;

    //     for (const currency in rates){
    //       const rate = rates.IDR / rates[currency];
    //       const formatrate = formatCurrency(rate, "en-US", "", currency);
    //       console.log('${currency} : ${formatrate}');

    //       const row = [index++, currency, formatrate];
    //       this._table1.row.add(row);
    //     }

    //     this._table1.draw(false);
    //   });
    // }

  // BARU
  bindTable1(): void {
    console.log("bindTable1()");
      
    const ratesUrl = "https://openexchangerates.org/api/latest.json?app_id=d7c1514b62f74fdeb17ccaa27ea45aef";

    const currenciesUrl = "https://openexchangerates.org/api/currencies.json";

    this.httpClient.get(currenciesUrl).subscribe((currencies: any) => {
      this.httpClient.get(ratesUrl).subscribe((data: any) => {
        const rates = data.rates;
        let index = 1;

        for (const currency in rates){
          const currencyName = currencies[currency];

          const rate = rates.IDR / rates[currency];
          const formatRate = formatCurrency(rate, "en-US", "", currency);

          console.log(`${currency}: ${currencyName} - ${formatRate}`);

          const row = [index++, currency, currencyName, formatRate];
          this._table1.row.add(row);
          this._table1.draw(false);
        }
      });
    });
  }
}
