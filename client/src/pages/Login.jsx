import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { AlertNotice } from '@/components/common/Alert';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const [error, setError] = React.useState(null);

  const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
  });

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (data) => {
    dispatch(loginUser(data)).then((action) => {
      if (action.type === 'auth/loginUser/fulfilled') {
        navigate('/dashboard');
      }
      if (action.type === 'auth/loginUser/rejected') {
        setError(action.payload.msg);
      }
    });
  };

  return (
    <div className="container h-full w-full flex items-center justify-center">
      <Card className="flex-1 max-w-xl">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Please sign in to access your dashboard and manage your
            appointments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <AlertNotice
              variant="destructive"
              message={error}
              classNames={'mb-2'}
            />
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Your secure password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={authStatus === 'loading'}
              >
                {authStatus === 'loading' ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-sm">
          <p>
            Don't have an account?{' '}
            <Link className="text-primary" to={'/register'}>
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
