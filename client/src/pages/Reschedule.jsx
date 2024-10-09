import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAppointment,
  updateAppointment
} from '../features/appointments/appointmentSlice';
import { fetchDentists } from '../features/dentists/dentistSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
import { format, startOfDay, isBefore } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'react-toastify';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

function Reschedule() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const appointments = useSelector((state) => state.appointments.list);
  const appointment = appointments.find((appt) => appt._id === id);

  const dentists = useSelector((state) => state.dentists.list);
  const dentistsStatus = useSelector((state) => state.dentists.status);
  const dentistsError = useSelector((state) => state.dentists.error);

  const updateStatus = useSelector((state) => state.appointments.status);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDentistId, setSelectedDentistId] = useState(
    appointment ? appointment.dentist._id : ''
  );
  const [selectedDate, setSelectedDate] = useState(
    appointment ? new Date(appointment.appointmentDate) : null
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (dentistsStatus === 'idle') {
      dispatch(fetchDentists());
    }
    if (!appointment) {
      dispatch(fetchAppointment(id));
    }
  }, [dispatch, dentistsStatus, appointment, id]);

  useEffect(() => {
    if (appointment) {
      setSelectedDentistId(appointment.dentist._id);
      setSelectedDate(new Date(appointment.appointmentDate));
    }
  }, [appointment]);

  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      if (selectedDentistId && selectedDate) {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');

        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_REACT_APP_API_URL
            }/api/dentists/available-timeslots?dentistId=${selectedDentistId}&date=${dateStr}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch time slots');
          }

          const currentTimeSlot = appointment ? appointment.timeSlot : null;
          if (currentTimeSlot && !data.includes(currentTimeSlot)) {
            data.push(currentTimeSlot);
          }

          setAvailableTimeSlots(data);
        } catch (error) {
          console.error(error);
          setAvailableTimeSlots([]);
          toast.error(error.message);
        }
      } else {
        setAvailableTimeSlots([]);
      }
    };

    fetchAvailableTimeSlots();
  }, [selectedDentistId, selectedDate, token, appointment]);

  const rescheduleSchema = z.object({
    dentistId: z.string().optional(),
    appointmentDate: z
      .date({
        required_error: 'Please select a new date',
        invalid_type_error: 'Invalid date format'
      })
      .refine(
        (date) => {
          const today = startOfDay(new Date());
          const selected = startOfDay(date);
          return !isBefore(selected, today);
        },
        {
          message: 'Appointment date cannot be in the past'
        }
      ),
    timeSlot: z.string().nonempty('Please select a time slot')
  });

  const form = useForm({
    resolver: zodResolver(rescheduleSchema),
    defaultValues: {
      dentistId: selectedDentistId,
      appointmentDate: selectedDate,
      timeSlot: appointment ? appointment.timeSlot : ''
    }
  });

  useEffect(() => {
    if (appointment) {
      form.reset({
        dentistId: appointment.dentist._id,
        appointmentDate: new Date(appointment.appointmentDate),
        timeSlot: appointment.timeSlot
      });
    }
  }, [appointment, form]);

  const onSubmit = (data) => {
    dispatch(
      updateAppointment({
        id,
        updates: {
          dentistId: data.dentistId || appointment.dentist._id,
          appointmentDate: format(data.appointmentDate, 'yyyy-MM-dd'),
          timeSlot: data.timeSlot
        }
      })
    ).then((action) => {
      if (action.type === 'appointments/updateAppointment/fulfilled') {
        toast.success('Appointment rescheduled successfully!');
        navigate('/dashboard');
      } else {
        toast.error(
          action.payload?.message || 'Failed to reschedule appointment'
        );
      }
    });
  };

  const appointmentStatus = useSelector((state) => state.appointments.status);
  const appointmentError = useSelector((state) => state.appointments.error);

  if (appointmentStatus === 'loading') {
    return <p className="text-center">Loading appointment details...</p>;
  }

  if (appointmentStatus === 'failed') {
    return (
      <p className="text-center text-red-500">Error: {appointmentError}</p>
    );
  }

  if (!appointment) {
    return <p className="text-center">No appointment found.</p>;
  }

  return (
    <div className="container h-full w-full flex items-center justify-center">
      <Card className="flex-1 max-w-xl">
        <CardHeader>
          <CardTitle>Reschedule Appointment</CardTitle>
          <CardDescription>
            Change the date, time, or dentist for your existing appointment.
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
                      <FormLabel>Change Dentist (Optional)</FormLabel>
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
                          placeholder="Select Dentist"
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
                      <FormDescription>
                        Optionally select a different dentist for your
                        appointment.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appointmentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>New Appointment Date</FormLabel>
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
                                : 'Pick a new date'}
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
                              isBefore(date, startOfDay(new Date())) ||
                              !isDentistWorkingOnDate(
                                dentists,
                                selectedDentistId || appointment.dentist._id,
                                date
                              )
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Select a new date for your appointment.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                    className="w-full"
                    disabled={
                      updateStatus === 'loading' ||
                      availableTimeSlots.length === 0 ||
                      !form.formState.isValid
                    }
                  >
                    {updateStatus === 'loading'
                      ? 'Rescheduling...'
                      : 'Reschedule Appointment'}
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

export default Reschedule;
