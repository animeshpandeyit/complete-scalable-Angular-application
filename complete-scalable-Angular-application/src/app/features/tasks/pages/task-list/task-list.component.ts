import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { TaskEventsService } from '../../../../core/services/task-events.service';
import { from, of, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  counter = 0;
  notification = '';
  private destroyRef = inject(DestroyRef);

  constructor(
    private taskService: TaskService,
    private taskEventsService: TaskEventsService,
  ) {}
  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        console.log('Tasks received:', tasks);
        this.tasks = tasks;
      },

      error: (error) => {
        console.error('Error:', error);
      },

      complete: () => {
        console.log('Task Observable completed');
      },
    });

    const secondTask = this.taskService.getTasks().subscribe({
      next: (tasks) => {
        console.log('Tasks received:', tasks);
        this.tasks = tasks;
      },

      error: (error) => {
        console.error('Something went wrong:', error);
      },

      complete: () => {
        console.log('Task Observable completed');
      },
    });

    secondTask.unsubscribe();

    const liveSubscription = this.taskService.getLiveTaskUpdates().subscribe({
      next: (value) => {
        console.log('Received update:', value);
      },
      complete: () => {
        console.log('Stream completed');
      },
    });
    setTimeout(() => {
      console.log('Unsubscribing now...');
      liveSubscription.unsubscribe();
    }, 5000);

    console.log('Before Promise');
    const promise = this.taskService.getTaskPromise();
    console.log('After Promise');
    promise.then((response) => {
      console.log(response);
    });

    // console.log('Before Experiment Promise');
    // const Experiment = this.taskService.promiseExperiment();
    // console.log('After Experiment Promise');
    // Experiment.then(response => {
    //   console.log(response);
    // });

    console.log('Before Observable');
    const observable = this.taskService.getTaskObservable();
    console.log('After Observable');
    observable.subscribe((response) => {
      console.log(response);
    });

    const firstSubscription = this.taskService
      .getColdTaskUpdates()
      .subscribe((value) => {
        console.log('Subscriber 1:', value);
      });

    const secondSubscription = this.taskService
      .getColdTaskUpdates()
      .subscribe((value) => {
        console.log('Subscriber 2:', value);
      });

    setTimeout(() => {
      firstSubscription.unsubscribe();
      secondSubscription.unsubscribe();
    }, 5000);

    this.taskEventsService.taskUpdates$.subscribe((value) => {
      console.log('Subscriber 1:', value);
    });
    this.taskEventsService.taskUpdates$.subscribe((value) => {
      console.log('Subscriber 2:', value);
    });
    this.taskEventsService.notifyTaskCreated('Learn RxJS');

    // Asynchronous interval stream

    this.taskService
      .getLiveCounter()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        console.log('Live Counter:', value);
        this.counter = value;
      });

    // One-time timer notification
    this.taskService
      .getTaskNotification()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        console.log('Task notification received');
        this.notification = 'Your task reminder is ready!';
      });
  }

  // ngOnInit(): void {

  //   console.log('1. Start');

  //   of(10, 20).subscribe(value => {
  //     console.log('2. of:', value);
  //   });

  //   Promise.resolve('Promise Data').then(value => {
  //     console.log('3. Promise:', value);
  //   })

  //   from(Promise.resolve('Observable Data')).subscribe(value => {
  //     console.log('4. from Promise:', value);
  //   });

  //   from([10, 20]).subscribe(value => {
  //     console.log('4. from Promise:', value);
  //   });

  //   setTimeout(() => {
  //     console.log('5. setTimeout');
  //   }, 0);

  //   console.log('6. End');
  // }

  ngOnDestroy(): void {
    console.log('Dashboard component destroyed!');
  }
}
