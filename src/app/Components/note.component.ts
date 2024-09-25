import {Component, Input} from "@angular/core";

@Component({
  selector: "note",
  standalone: true,
  template: `
    <li class="border-b-2 border-slate-500 bg-slate-100 flex flex-col gap-4">
      @if(this.author) {
        <span class="p-2 bg-slate-800 text-white">
          {{this.author.name}} <br>
          <small>&#64;{{this.author.preferredUsername}}&#64;{{this.author.id.hostname}}</small>
        </span>
      }
      <span class="whitespace-pre-line">{{note.content}}</span>
      <span class="p-2 bg-slate-800 text-white">{{this.getPublishTime()}}</span>
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
    this.author!.id = new URL(this.author!.id);
  }

  protected readonly Date = Date;
}
