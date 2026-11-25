import { Injectable, resolveForwardRef } from '@angular/core';
import { from, interval, map, Observable, of, tap, timer } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor() {}

  getTasks(): Observable<Task[]> {
    return new Observable<Task[]>((subscriber) => {
      console.log('Observable execution started');

      subscriber.next([
        {
          id: 1,
          title: 'Learn RxJS',
          status: 'In Progress',
          priority: 'High',
        },
        {
          id: 2,
          title: 'Learn Angular Signals',
          status: 'Pending',
          priority: 'Medium',
        },
        {
          id: 3,
          title: 'Build TaskFlow',
          status: 'Completed',
          priority: 'High',
        },
      ]);

      // subscriber.error(new Error('Something went wrong'))
      subscriber.complete();

      return () => {
        console.log('Observable cleanup executed');
      };
    });
  }

  getLiveTaskUpdates(): Observable<number> {
    return new Observable((subscriber) => {
      console.log('Live task stream started');

      let count = 1;

      const intervalId = setInterval(() => {
        console.log('Emitting task update:', count);

        subscriber.next(count);

        count++;
      }, 1000);

      return () => {
        clearInterval(intervalId);

        console.log('Live task stream stopped');
      };
    });
  }

  getTaskPromise(): Promise<string> {
    return new Promise((resolve) => {
      console.log('Promise started');

      setTimeout(() => {
        resolve('Promise task received');
      }, 2000);
    });
  }

  // promiseExperiment(): Promise<string> {
  //   return new Promise(resolve => {
  //     console.log("Promise experiment");
  //     setTimeout(() => {
  //       resolve('Promise experiment received');
  //     }, 2000);
  //   })
  // }

  getTaskObservable(): Observable<string> {
    return new Observable((subscriber) => {
      console.log('Observable started');

      setTimeout(() => {
        subscriber.next('Observable task received');

        subscriber.complete();
      }, 2000);
    });
  }

  getColdTaskUpdates(): Observable<number> {
    return new Observable((subscriber) => {
      console.log('Cold Observable started');

      let count = 1;

      const intervalId = setInterval(() => {
        console.log('Emitting:', count);

        subscriber.next(count);

        count++;
      }, 1000);

      return () => {
        clearInterval(intervalId);

        console.log('Cold Observable cleanup');
      };
    });
  }

  getLiveCounter() {
    return interval(1000);
  }

  getTaskNotification() {
    return timer(5000);
  }

  private tasks: Task[] = [
    {
      id: 1,
      title: 'Learn RxJS',
      status: 'In Progress',
      priority: 'High',
    },
    {
      id: 2,
      title: 'Build Task Dashboard',
      status: 'Pending',
      priority: 'Medium',
    },
    {
      id: 3,
      title: 'Practice Angular',
      status: 'Completed',
      priority: 'Low',
    },
  ];

  // Complete array as one emission
  getTasksUsingOf(): Observable<Task[]> {
    return of(this.tasks);
  }

  // Each task as a separate emission
  getTasksUsingFrom(): Observable<Task> {
    return from(this.tasks);
  }

  getTaskTitlesUsingFrom(): Observable<string> {
    return from(this.tasks).pipe(map((task) => task.title));
  }

  getTaskStatusesUsingOf(): Observable<string[]> {
    return of(this.tasks).pipe(
      map((tasks) => tasks.map((task) => task.status)),
      tap(),
    );
  }
}
