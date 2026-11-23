import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskEventsService {
  constructor() {}

  private taskSubject = new Subject<string>();

  taskUpdates$ = this.taskSubject.asObservable();

  notifyTaskCreated(taskName: string): void {
    this.taskSubject.next(taskName);
  }
}
