import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidLicensePlate(value: string): boolean {
  return /^\d{4}[A-Za-zА-Яа-яЁёӨөҮү]{3}$/.test(value.trim());
}

export function formatLicensePlateInput(value: string): string {
  return value.replace(/[^\dA-Za-zА-Яа-яЁёӨөҮү]/g, "").slice(0, 7);
}
