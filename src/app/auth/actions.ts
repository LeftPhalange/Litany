'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/app/lib/supabase/server';

export async function login (formData: FormData) {
    const client = await createClient();

    // TODO: validate inputs!!!
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await client.auth.signInWithPassword(data);
    
    if (error) {
        console.log(JSON.stringify(error));
        redirect('/error');
    }

    revalidatePath('/', 'layout');
    redirect('/');
}

export async function register (formData: FormData) {
    const client = await createClient();

    // TODO: validate inputs!!!
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await client.auth.signUp(data);

    if (error) {
        redirect('/error');
    }

    revalidatePath('/', 'layout');
    redirect('/');
}