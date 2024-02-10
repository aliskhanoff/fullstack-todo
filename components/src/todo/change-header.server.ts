'use server';

import { revalidatePath } from "next/cache";

export async function changeHeader() {
    
    
    revalidatePath('/');
}