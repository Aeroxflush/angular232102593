import { AfterViewInit, Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { HeaderComponent } from "../header/header.component";
import { HttpClient } from '@angular/common/http';

declare const $: any;

@Component({
  selector: 'app-mahasiswa',
  imports: [FooterComponent, SidebarComponent, HeaderComponent],
  templateUrl: './mahasiswa.component.html',
  styleUrl: './mahasiswa.component.css'
})
export class MahasiswaComponent implements AfterViewInit{
  data: any;
  table1: any;
  constructor(private httpClient: HttpClient) {}

  ngAfterViewInit(): void {
    this.table1 = $("#table1").DataTable();
    this.bindMahasiswa();
  }
  
  bindMahasiswa(): void {
    this.httpClient.get("https://stmikpontianak.cloud/011100862/tampilMahasiswa.php").subscribe((data: any) => {
        console.log(data);

        this.table1.clear();

        data.forEach((element: any) => {
          var tempatTanggalLahir = element.TempatLahir + ", " + element.TanggalLahir;

          var row = [
            element.NIM,
            element.Nama,
            element.JenisKelamin,
            tempatTanggalLahir,
            element.JP,
            element.Alamat,
            element.StatusNikah,
            element.TahunMasuk
          ]

          this.table1.row.add(row);
        })
      this.table1.draw(false)
    })
  }
}
