import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDentists } from '../features/dentists/dentistSlice';
import { createAppointment } from '../features/appointments/appointmentSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'react-toastify';

function Booking() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dentists = useSelector((state) => state.dentists.list);
  const dentistsStatus = useSelector((state) => state.dentists.status);
  const dentistsError = useSelector((state) => state.dentists.error);

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDentistId, setSelectedDentistId] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const authStatus = useSelector((state) => state.auth.status);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (dentistsStatus === 'idle') {
      dispatch(fetchDentists());
    }
  }, [dispatch, dentistsStatus]);

  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      if (selectedDentistId && selectedDate) {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');

        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_REACT_APP_API_URL
            }/api/dentists/available-timeslots?dentistId=${selectedDentistId}&date=${dateStr}`
          );
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch time slots');
          }

          setAvailableTimeSlots(data);
        } catch (error) {
          console.error(error);
          setAvailableTimeSlots([]);
        }
      } else {
        setAvailableTimeSlots([]);
      }
    };

    fetchAvailableTimeSlots();
  }, [selectedDentistId, selectedDate]);

  const bookingSchema = z.object({
    dentistId: z.string().nonempty('Please select a dentist'),
    appointmentDate: z
      .date({
        required_error: 'Please select a date',
        invalid_type_error: 'Invalid date format'
      })
      .refine((date) => date >= new Date().setHours(0, 0, 0, 0), {
        message: 'Appointment date cannot be in the past'
      }),
    timeSlot: z.string().nonempty('Please select a time slot')
  });

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      dentistId: '',
      appointmentDate: null,
      timeSlot: ''
    }
  });

  const onSubmit = (data) => {
    dispatch(
      createAppointment({
        dentistId: data.dentistId,
        appointmentDate: format(data.appointmentDate, 'yyyy-MM-dd'),
        timeSlot: data.timeSlot
      })
    ).then((action) => {
      if (action.type === 'appointments/createAppointment/fulfilled') {
        toast.success('Appointment booked successfully!');
        navigate('/dashboard');
      } else {
        toast.error(action.payload?.message || 'Failed to book appointment');
      }
    });
  };

  return (
    <div className="container h-full w-full flex items-center justify-center">
      <Card className="flex-1 max-w-xl">
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
          <CardDescription>
            Schedule an appointment with your preferred dentist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dentistsStatus === 'loading' && <p>Loading dentists...</p>}
          {dentistsStatus === 'failed' && (
            <p className="text-red-500">Error: {dentistsError}</p>
          )}
          {dentistsStatus === 'succeeded' && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="dentistId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Dentist</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedDentistId(value);
                            form.resetField('appointmentDate');
                            setSelectedDate(null);
                            form.resetField('timeSlot');
                            setAvailableTimeSlots([]);
                          }}
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Dentist" />
                          </SelectTrigger>
                          <SelectContent>
                            {dentists.map((dentist) => (
                              <SelectItem key={dentist._id} value={dentist._id}>
                                {dentist.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {selectedDentistId && (
                  <FormField
                    control={form.control}
                    name="appointmentDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Appointment Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? format(field.value, 'PPP')
                                  : 'Pick a date'}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                setSelectedDate(date);
                                form.resetField('timeSlot');
                              }}
                              disabled={(date) =>
                                date < new Date().setHours(0, 0, 0, 0) ||
                                !isDentistWorkingOnDate(
                                  dentists,
                                  selectedDentistId,
                                  date
                                )
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Select a date for your appointment.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {availableTimeSlots.length > 0 ? (
                  <FormField
                    control={form.control}
                    name="timeSlot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Time Slot</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-4 gap-2">
                            {availableTimeSlots.map((timeSlot, index) => (
                              <Button
                                type="button"
                                key={index}
                                variant={
                                  field.value === timeSlot
                                    ? 'default'
                                    : 'outline'
                                }
                                onClick={() => field.onChange(timeSlot)}
                                className="w-full"
                              >
                                {timeSlot}
                              </Button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  selectedDentistId &&
                  selectedDate &&
                  form.formState.dirtyFields.appointmentDate && (
                    <p>No available time slots for the selected date.</p>
                  )
                )}
                <div className="flex gap-x-2">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={
                      authStatus === 'loading' ||
                      availableTimeSlots.length === 0 ||
                      !form.formState.isValid
                    }
                  >
                    {authStatus === 'loading'
                      ? 'Confirming...'
                      : 'Confirm Appointment'}
                  </Button>
                  <Button
                    variant="secondary"
                    className="px-10"
                    onClick={() => navigate('/dashboard')}
                  >
                    Back
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function isDentistWorkingOnDate(dentists, dentistId, date) {
  const dentist = dentists.find((d) => d._id === dentistId);
  if (!dentist) return false;

  const dayOfWeek = format(date, 'EEEE');
  return dentist.schedule.workingDays.includes(dayOfWeek);
}

export default Booking;
