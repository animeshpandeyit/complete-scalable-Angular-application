import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, timer } from 'rxjs';

@Component({
  selector: 'app-task-monitor',
  standalone: true,
  imports: [],
  templateUrl: './task-monitor.component.html',
  styleUrl: './task-monitor.component.css',
})
export class TaskMonitorComponent {
  private destroyRef = inject(DestroyRef);
  counter = 0;
  refreshCount = 0;
  notification = '';

  ngOnInit(): void {
    // 1. Live counter
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.counter = value + 1;
      });

    // 2. Refresh indicator
    interval(5000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.refreshCount++;
        console.log('Task status refreshed!');
      });

    // 3. One-time notification
    timer(10000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.notification = 'You have a new task update!';
      });
  }
}
