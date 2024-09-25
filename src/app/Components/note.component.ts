import {Component, Input} from "@angular/core";

@Component({
  selector: "note",
  standalone: true,
  template: `
    <li class="p-1 border-b-2 border-slate-500 bg-slate-100 flex flex-col gap-2">
      @if(this.author) {
        <span>
          {{this.author.name}} ({{this.author.preferredUsername}})
        </span>
      }
      <span>{{note.content}}</span>
      <span>{{this.getPublishTime()}}</span>
    </li>
  `,
})
export class NoteComponent {
  @Input() note!: {id: string, content: string, attributedTo: string, published: string};
  author: {name: string, preferredUsername: string, id: URL} | null = null;

  public async ngOnInit(){
    await this.update();
  }

  protected getPublishTime(){
    return new Date(this.note.published).toLocaleString();
  }

  private async update(){
    if (!this.note) return;
    let author = await fetch(this.note.attributedTo, {
      method: "GET",
      credentials: 'include',
      headers:{
        "Accept": "application/activity+json"
      }
    });
    this.author = author.ok ? await author.json() : null;
  }

  protected readonly Date = Date;
}
