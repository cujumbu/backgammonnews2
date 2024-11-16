import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function parseAndValidateDate(dateStr: string | number | Date): string {
  try {
    let date: Date;
    
    if (dateStr instanceof Date) {
      date = dateStr;
    } else if (typeof dateStr === 'number') {
      date = new Date(dateStr);
    } else {
      date = new Date(dateStr);
    }

    // Validate the date
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    // Format to ISO string
    return date.toISOString();
  } catch (error) {
    // If all parsing attempts fail, return current date
    return new Date().toISOString();
  }
}

interface CustomRequestInit extends RequestInit {
  timeout?: number;
}

export async function fetchWithTimeout(
  url: string,
  options: CustomRequestInit = {}
) {
  const { timeout = 8000, ...fetchOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}
