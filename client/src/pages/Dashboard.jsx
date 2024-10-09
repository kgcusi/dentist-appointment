import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAppointments,
  cancelAppointment
} from '../features/appointments/appointmentSlice';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const CancelAppointmentDialog = ({ id, onCancel }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Cancel Appointment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will cancel your appointment.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary">Go Back</Button>
          <Button variant="destructive" onClick={() => onCancel(id)}>
            Yes, Cancel Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const appointments = useSelector((state) => state.appointments.list);
  const appointmentsStatus = useSelector((state) => state.appointments.status);
  const appointmentsError = useSelector((state) => state.appointments.error);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (appointmentsStatus === 'idle') {
      dispatch(fetchAppointments());
    }
  }, [dispatch, appointmentsStatus]);

  const handleCancel = (id) => {
    dispatch(cancelAppointment(id)).then((action) => {
      if (action.type === 'appointments/cancelAppointment/fulfilled') {
        toast.success('Appointment cancelled successfully!');
      } else {
        toast.error('Failed to cancel the appointment.');
      }
    });
  };

  return (
    <div className="container h-full w-full flex items-center justify-center">
      <Card className="flex-1 max-w-xl">
        <CardHeader>
          <CardTitle>My Appointments</CardTitle>
          <CardDescription>
            Manage your upcoming dental appointments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appointmentsStatus === 'loading' && (
            <p>Loading your appointments...</p>
          )}
          {appointmentsStatus === 'failed' && (
            <p className="text-red-500">Error: {appointmentsError}</p>
          )}
          {appointmentsStatus === 'succeeded' && (
            <>
              {appointments.length === 0 ? (
                <p>You have no upcoming appointments.</p>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <Card key={appointment._id} className="shadow-sm pt-5">
                      <CardContent>
                        <p>
                          <strong>Dentist:</strong> {appointment.dentist.name}
                        </p>
                        <p>
                          <strong>Date:</strong>{' '}
                          {format(new Date(appointment.appointmentDate), 'PPP')}{' '}
                          <span>{appointment.timeSlot}</span>
                        </p>
                      </CardContent>
                      <CardFooter className="flex space-x-2">
                        <CancelAppointmentDialog
                          id={appointment._id}
                          onCancel={handleCancel}
                        />
                        <Link
                          to={`/appointments/${appointment._id}/reschedule`}
                        >
                          <Button variant="secondary">Reschedule</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate('/booking')} className="mt-4">
            Book a New Appointment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Dashboard;
