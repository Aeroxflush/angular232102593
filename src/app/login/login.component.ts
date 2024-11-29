import { Component, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private renderer: Renderer2) {
    this.renderer.addClass(document.body, "login-page")

    this.renderer.removeClass(document.body, "sidebar-mini")
    this.renderer.removeClass(document.body, "layout-fixed")

    this.renderer.setAttribute(document.body, "style", "min-height: 464px;")
  }

  onSignButtonClick() {
    const body = document.body;
    this.renderer.removeClass(body, 'login-page');
    this.renderer.setStyle(body, 'min-height', 'auto');
  }
}
