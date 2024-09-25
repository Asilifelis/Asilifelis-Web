import {Component, inject} from "@angular/core";
import {NoteComponent} from "../Components/note.component";
import {AuthenticationService} from "../Services/AuthenticationService";

@Component({
  selector: "posts",
  standalone: true,
  template: `
    <section class="flex flex-col gap-2 mx-auto max-w-xl my-8">
      <button class="border stroke-black p-1 hover:bg-slate-400" (click)="update()">Load Posts</button>
      <ul>
        @if (userNotes !== null) {
          @for(note of this.userNotes!.items; track note.id){
            <note [note]="note"></note>
          }
          @if (userNotes.items.length < 1) {
            <li>No posts found</li>
          }
        }
      </ul>
    </section>
  `,
  imports: [NoteComponent]
})
export class PostsComponent {
  authentication = inject(AuthenticationService);
  userNotes: {items: [{id: string, content: string, attributedTo: string, published: string}], totalItems: number} | null = null;

  async update() {
    this.userNotes = null;
    let user = await this.authentication.getActor();
    let notes = await fetch(user.outbox, {
      method: "GET",
      credentials: 'include',
      headers:{
        "Accept": "application/activity+json"
      }
    });

    if (notes.ok) {
      this.userNotes = await notes.json();
    }
  }
}
