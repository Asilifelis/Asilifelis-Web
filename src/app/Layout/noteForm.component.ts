import {Component, inject} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {AuthenticationService} from "../Services/AuthenticationService";

@Component({
  selector: "note-form",
  standalone: true,
  template: `
    <section class="flex flex-col gap-2 mx-auto max-w-xl my-8">
      <form class="flex flex-col gap-2" (ngSubmit)="submit()">
        <textarea class="border border-black p-1" type="text" maxlength="4096" required autocomplete="off" name="content"
                  [(ngModel)]="content"></textarea>
        <button class="border stroke-black p-1 hover:bg-slate-400" type="submit" [disabled]="disabled">Post</button>
      </form>
    </section>
  `,
  imports: [FormsModule]
})
export class noteForm {
  content: string = "";
  disabled = true;
  authenticate = inject(AuthenticationService);

  public async ngOnInit(){
    let me = await this.authenticate.getActor();
    if (me) this.disabled = false;
  }


  async submit() {
    this.disabled = true;

    let result = await fetch(new URL("/api/debug/note", "https://winter-cottage.eu"), {
      method: "POST",
      credentials: 'include',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        content: this.content
      })
    });

    this.disabled = false;
  }
}
