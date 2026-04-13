import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { EventDetailsModel, ProgramDetailModel } from '../../models/home.model';

@Component({
  selector: 'app-event-details-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, CommonModule, MatTableModule],
  templateUrl: './event-details-dialog.component.html',
  styleUrls: ['./event-details-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EventDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventDetailsModel
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  readonly programColumns = ['sno', 'date', 'time', 'title', 'status'];

  getSortedPrograms(): ProgramDetailModel[] {
    const statusOrder: Record<string, number> = { live: 0, upcoming: 1, completed: 2 };
    return [...(this.data.programs ?? [])].sort((first, second) => {
      const statusDiff = statusOrder[this.getProgramStatus(first)] - statusOrder[this.getProgramStatus(second)];
      if (statusDiff !== 0) {
        return statusDiff;
      }
      const firstDate = this.getProgramDateTime(first.date, first.from_time, false)?.getTime() ?? Number.POSITIVE_INFINITY;
      const secondDate = this.getProgramDateTime(second.date, second.from_time, false)?.getTime() ?? Number.POSITIVE_INFINITY;
      return firstDate - secondDate;
    });
  }

  getNextProgramInEvent(): ProgramDetailModel | null {
    const programs = this.getSortedPrograms();
    if (!programs.length) {
      return null;
    }

    const now = new Date();
    const liveProgram = programs.find((program) => {
      const startDate = this.getProgramDateTime(program.date, program.from_time, false);
      const endDate = this.getProgramDateTime(program.date, program.to_time, true);
      return !!startDate && !!endDate && now >= startDate && now <= endDate;
    });

    if (liveProgram) {
      return liveProgram;
    }

    return programs.find((program) => {
      const startDate = this.getProgramDateTime(program.date, program.from_time, false);
      return !!startDate && startDate >= now;
    }) ?? null;
  }

  getEventStatus(): 'live' | 'upcoming' | 'completed' {
    const startDate = this.getEventDateBoundary(this.data.start_date, false);
    const endDate = this.getEventDateBoundary(this.data.end_date, true);
    if (!startDate || !endDate) {
      return 'upcoming';
    }

    const now = new Date();
    if (now >= startDate && now <= endDate) {
      return 'live';
    }

    return now < startDate ? 'upcoming' : 'completed';
  }

  getEventStatusLabel(): string {
    const status = this.getEventStatus();
    if (status === 'live') {
      return 'Started';
    }
    if (status === 'upcoming') {
      return 'Upcoming';
    }
    return 'Completed';
  }

  getEventDurationLabel(): string {
    const start = this.getDateOnly(this.data.start_date);
    const end = this.getDateOnly(this.data.end_date);
    if (!start || !end) {
      return '';
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const dayCount = Math.max(1, Math.floor((end.getTime() - start.getTime()) / millisecondsPerDay) + 1);
    return `${dayCount}-day event`;
  }

  getProgramStatus(program: ProgramDetailModel): 'live' | 'upcoming' | 'completed' {
    const startDateTime = this.getProgramDateTime(program.date, program.from_time, false);
    const endDateTime = this.getProgramDateTime(program.date, program.to_time, true);

    if (!startDateTime || !endDateTime) {
      return 'upcoming';
    }

    const now = new Date();
    if (now >= startDateTime && now <= endDateTime) {
      return 'live';
    }

    return now < startDateTime ? 'upcoming' : 'completed';
  }

  getProgramStatusLabel(program: ProgramDetailModel): string {
    const status = this.getProgramStatus(program);
    if (status === 'live') {
      return 'Live';
    }
    if (status === 'upcoming') {
      return 'Upcoming';
    }
    return 'Completed';
  }

  getProgramScheduleSummary(program: ProgramDetailModel): string {
    const dateLabel = this.formatDate(program.date);
    const fromTime = this.formatTime12Hour(program.from_time);
    const toTime = this.formatTime12Hour(program.to_time);

    if (fromTime && toTime) {
      return `${dateLabel}, ${fromTime} - ${toTime}`;
    }

    if (fromTime) {
      return `${dateLabel}, ${fromTime}`;
    }

    return dateLabel;
  }

  formatDate(date: string | undefined): string {
    if (!date) {
      return '';
    }

    const [year, month, day] = date.split('-').map(Number);
    if (!year || !month || !day) {
      return date;
    }

    const parsedDate = new Date(year, month - 1, day);
    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      .format(parsedDate)
      .replace(/ /g, '-');
  }

  formatTime12Hour(time: string | undefined): string {
    if (!time) {
      return '';
    }

    const parsed = this.parseTimeToHoursMinutes(time);
    if (!parsed) {
      return time;
    }

    const [hours, minutes] = parsed;
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date).toLowerCase();
  }

  private getEventDateBoundary(dateValue: string | undefined, isEndDate: boolean): Date | null {
    if (!dateValue) {
      return null;
    }

    const [year, month, day] = dateValue.split('-').map(Number);
    if (!year || !month || !day) {
      return null;
    }

    const result = isEndDate
      ? new Date(year, month - 1, day, 23, 59, 59, 999)
      : new Date(year, month - 1, day, 0, 0, 0, 0);

    return Number.isNaN(result.getTime()) ? null : result;
  }

  private getProgramDateTime(dateValue: string | undefined, timeValue: string | undefined, isEndTime: boolean): Date | null {
    if (!dateValue) {
      return null;
    }

    const [year, month, day] = dateValue.split('-').map(Number);
    if (!year || !month || !day) {
      return null;
    }

    const parsedTime = this.parseTimeToHoursMinutes(timeValue);
    const hours = parsedTime ? parsedTime[0] : isEndTime ? 23 : 0;
    const minutes = parsedTime ? parsedTime[1] : isEndTime ? 59 : 0;

    const result = new Date(year, month - 1, day, hours, minutes, 0, 0);
    return Number.isNaN(result.getTime()) ? null : result;
  }

  private parseTimeToHoursMinutes(time: string | undefined): [number, number] | null {
    if (!time) {
      return null;
    }

    const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
    if (!match) {
      return null;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
      return null;
    }
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return null;
    }

    return [hours, minutes];
  }

  private getDateOnly(dateValue: string | undefined): Date | null {
    if (!dateValue) {
      return null;
    }

    const [year, month, day] = dateValue.split('-').map(Number);
    if (!year || !month || !day) {
      return null;
    }

    const result = new Date(year, month - 1, day, 0, 0, 0, 0);
    return Number.isNaN(result.getTime()) ? null : result;
  }
}
