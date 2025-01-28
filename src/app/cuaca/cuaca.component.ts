import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';

declare const $: any;
declare const moment: any;

@Component({
  selector: 'app-cuaca',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, FooterComponent, RouterModule],
  templateUrl: './cuaca.component.html',
  styleUrl: './cuaca.component.css',
})
export class CuacaComponent implements AfterViewInit {
  private table1: any;

  constructor(private renderer: Renderer2, private http: HttpClient) {
    this.renderer.removeClass(document.body, 'sidebar-open');
    this.renderer.addClass(document.body, 'sidebar-closed');
  }

  ngAfterViewInit(): void {
    this.table1 = $('#table1').DataTable({
      columnDefs: [
        {
          targets: 0,
          render: function (data: string) {
            const waktu = moment(data + ' UTC');
            console.log(waktu);

            const html =
              waktu.local().format('YYYY-MM-DD') +
              '<br />' +
              waktu.local().format('HH:mm') +
              ' WIB';
            return html;
          },
        },
        {
          targets: [1],
          render: function (data: string) {
            return (
              "<img src='" +
              data +
              "' style='filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.7));' />"
            );
          },
        },
        {
          targets: [2],
          render: function (data: string) {
            const array = data.split('||');
            const cuaca = array[0];
            const deskripsi = array[1];
            const html = '<strong>' + cuaca + '</strong> <br />' + deskripsi;
            return html;
          },
        },
      ],
    });
  }

  getData(city: string): void {
    city = encodeURIComponent(city);

    this.http
      .get(
        `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=75581fe5054b2201eeb2333628fa5b6c`
      )
      .subscribe(
        (data: any) => {
          let list = data.list;
          console.log(list);

          this.table1.clear();

          list.forEach((element: any) => {
            const weather = element.weather[0];
            console.log(weather);

            const iconUrl =
              'https://openweathermap.org/img/wn/' + weather.icon + '@2x.png';
            const cuacaDeskripsi = weather.main + '|| ' + weather.description;

            const main = element.main;
            console.log(main);

            const tempMin = this.KelvinToCelcius(main.temp_min);
            console.log({ tempMin });

            const tempMax = this.KelvinToCelcius(main.temp_max);
            console.log({ tempMax });

            const temp = tempMin + '°C - ' + tempMax + '°C';

            const row = [element.dt_txt, iconUrl, cuacaDeskripsi, temp];

            this.table1.row.add(row);
          });

          this.table1.draw(false);
        },
        (error: any) => {
          alert(error.error.message);
          this.table1.clear();
          this.table1.draw(false);
        }
      );
  }

  KelvinToCelcius(kelvin: any): any {
    let celcius = kelvin - 273.15;
    celcius = Math.round(celcius * 100) / 100;
    return celcius;
  }

  handleEnter(event: any) {
    const cityName = event.target.value;
    if (cityName == '') {
      this.table1.clear();
      this.table1.draw(false);
    }

    this.getData(cityName);
  }
}
