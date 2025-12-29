import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'timestamp',
  standalone: true,
})
export class TimestampPipe implements PipeTransform {
  transform(value: Timestamp | Date | any): Date | null {
    if (!value) return null;

    if (value instanceof Timestamp) {
      return value.toDate();
    }

    if (value instanceof Date) {
      return value;
    }

    if (typeof value === 'string') {
      return new Date(value);
    }

    if (value && typeof value.toDate === 'function') {
      return value.toDate();
    }

    console.warn('TimestampPipe: Valor não reconhecido:', value);
    return null;
  }
}
