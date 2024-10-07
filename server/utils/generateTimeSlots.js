import { parse, format, isBefore, addMinutes } from 'date-fns';

export function generateTimeSlots(date, schedule) {
  const { startTime, endTime, timeSlotInterval } = schedule;

  const slots = [];
  const startDateTime = parse(
    `${format(date, 'yyyy-MM-dd')} ${startTime}`,
    'yyyy-MM-dd hh:mm a',
    new Date()
  );
  const endDateTime = parse(
    `${format(date, 'yyyy-MM-dd')} ${endTime}`,
    'yyyy-MM-dd hh:mm a',
    new Date()
  );

  let currentTime = startDateTime;

  while (isBefore(currentTime, endDateTime)) {
    slots.push(format(currentTime, 'hh:mm a'));
    currentTime = addMinutes(currentTime, timeSlotInterval);
  }

  return slots;
}
