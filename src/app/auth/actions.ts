'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/app/lib/supabase/server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PW_LENGTH = 8;
const MAX_PW_LENGTH = 128;

function validateCredentials(email: string, password: string): string | null {
    if (!email || !EMAIL_REGEX.test(email)) return 'invalid-email';
    if (!password || password.length < MIN_PW_LENGTH) return 'password-too-short';
    if (password.length > MAX_PW_LENGTH) return 'password-too-long';
    return null;
}

export async function login(formData: FormData) {
    const email = (formData.get('email') as string)?.trim();
    const password = formData.get('password') as string;

    const validationError = validateCredentials(email, password);
    if (validationError) {
        redirect(`/error?reason=${validationError}`);
    }

    const client = await createClient();
    const { error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
        console.error('Login error:', error.message);
        redirect('/error');
    }

    revalidatePath('/', 'layout');
    redirect('/');
}

export async function register(formData: FormData) {
    const email = (formData.get('email') as string)?.trim();
    const password = formData.get('password') as string;

    const validationError = validateCredentials(email, password);
    if (validationError) {
        redirect(`/error?reason=${validationError}`);
    }

    const client = await createClient();
    const { data, error } = await client.auth.signUp({ email, password });

    if (error) {
        console.error('Registration error:', error.message);
        redirect('/error');
    }

    // If email confirmation is enabled, session will be null until verified.
    if (!data.session) {
        redirect('/auth/check-email');
    }

    revalidatePath('/', 'layout');
    redirect('/');
}
