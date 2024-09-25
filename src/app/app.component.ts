import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from "./Layout/navbar.component";
import {PostsComponent} from "./Layout/posts.component";
import {noteForm} from "./Layout/noteForm.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, PostsComponent, noteForm],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'asilifelis-web';
  version = "";

  public async ngOnInit(){
    this.version = await this.getVersion();
  }

  async getVersion() {
    let result = await fetch(new URL("/api/version", "https://winter-cottage.eu"), {
      method: "GET"
    });
    return result.ok ? await result.json() : null;
  }
}
