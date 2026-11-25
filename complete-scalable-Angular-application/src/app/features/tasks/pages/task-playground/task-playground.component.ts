import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { fromEvent, map, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task-playground',
  standalone: true,
  imports: [],
  templateUrl: './task-playground.component.html',
  styleUrl: './task-playground.component.css',
})
export class TaskPlaygroundComponent implements OnInit {
  tasks: Task[] = [];
  tasksTitle: string[] = [];
  tasksTitleof: string[] = [];

  @ViewChild('searchInput')
  searchInput!: ElementRef<HTMLInputElement>;

  @ViewChild('clearButton')
  clearButton!: ElementRef<HTMLButtonElement>;

  @ViewChild('enteredText')
  enteredText!: ElementRef<HTMLInputElement>;

  @ViewChild('prioritySelect')
  prioritySelect!: ElementRef<HTMLOptionElement>;

  @ViewChild('taskCreated')
  taskCreated!: ElementRef<HTMLButtonElement>;

  private subscriptions = new Subscription();

  private taskService = inject(TaskService);

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // of(): one emission containing the array
    this.taskService.getTasksUsingOf().subscribe((tasks) => {
      console.log('Using of():', tasks);
    });

    // from(): individual task emissions
    this.taskService.getTasksUsingFrom().subscribe((task) => {
      console.log('Using from():', task);
      this.tasks = [...this.tasks, task];
    });

    this.taskService.getTaskTitlesUsingFrom().subscribe((title) => {
      console.log('title Using from():', title);

      this.tasksTitle = [...this.tasksTitle, title];
    });

    this.taskService.getTaskStatusesUsingOf().subscribe((statuses) => {
      console.log('Statuses Using of():', statuses);

      this.tasksTitleof = [...statuses];
    });
  }

  // ngAfterViewInit(): void {
  //   const search$ = fromEvent(this.searchInput.nativeElement, 'input');

  //   // const search$ = fromEvent(this.searchInput.nativeElement, 'input').pipe(
  //   //   map((event) => (event.target as HTMLInputElement).value),
  //   // );

  //   // const searchSubscription = search$.subscribe((value) => {
  //   //   console.log('Search text:', value);
  //   // });

  //   const searchSubscription = search$.subscribe((event) => {
  //     const input = event.target as HTMLInputElement;
  //     console.log('Search value:', input.value);
  //   });

  //   const clearSubscription = fromEvent(
  //     this.clearButton.nativeElement,
  //     'click',
  //   ).subscribe(() => {
  //     this.searchInput.nativeElement.value = '';
  //     console.log('Search cleared');
  //   });

  //   this.subscriptions.add(searchSubscription);
  //   this.subscriptions.add(clearSubscription);

  //   fromEvent(this.searchInput.nativeElement, 'input')
  //     .pipe(
  //       map((event) => (event.target as HTMLInputElement).value),
  //       takeUntilDestroyed(this.destroyRef),
  //     )
  //     .subscribe((value) => {
  //       console.log('Search:', value);
  //     });
  // }

  ngAfterViewInit(): void {
    // const search$ = fromEvent(this.enteredText.nativeElement, 'input').pipe(
    //   map((event) => (event.target as HTMLInputElement).value),
    // );

    const search$ = fromEvent(this.enteredText.nativeElement, 'input').pipe(
      map((event) => (event.target as HTMLInputElement).value),
    );

    search$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      console.log('enteredText Search text:', value);
    });

    fromEvent(this.taskCreated.nativeElement, 'click').subscribe(() => {
      this.taskCreated.nativeElement.value = '';
      console.log('Task Created');
    });

    const dropdown$ = fromEvent(
      this.prioritySelect.nativeElement,
      'change',
    ).pipe(map((event) => (event.target as HTMLSelectElement).value));

    dropdown$.subscribe((value) => {
      console.log('Selected priority:', value);
      takeUntilDestroyed(this.destroyRef);
    });

    //     HTML tag	TypeScript DOM type
    // <input>	HTMLInputElement
    // <select>	HTMLSelectElement
    // <option>	HTMLOptionElement
    // <button>	HTMLButtonElement
    // <textarea>	HTMLTextAreaElement
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
