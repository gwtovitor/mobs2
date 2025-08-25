export default class Vehicle {
  constructor(
    readonly plate: string,
    readonly model: string,
    readonly manufacturer: string,
    readonly year: number
  ) {
    if (!this.isValidPlate(plate)) throw new Error('Invalid plate');
    if (!model?.trim()) throw new Error('Invalid model');
    if (!manufacturer?.trim()) throw new Error('Invalid manufacturer');
    if (!this.isValidYear(year)) throw new Error('Invalid year');
  }

  private isValidPlate(plate: string) {
    const value = plate.trim().toUpperCase();
    const oldPattern = /^[A-Z]{3}-?\d{4}$/;  
    const mercosul   = /^[A-Z]{3}\d[A-Z]\d{2}$/
    return oldPattern.test(value) || mercosul.test(value);
  }

  private isValidYear(year: number) {
    const y = Number(year);
    const now = new Date().getFullYear();
    return Number.isInteger(y) && y >= 1900 && y <= now + 1;
  }

  static create(plate: string, model: string, manufacturer: string, year: number) {
    return new Vehicle(plate.trim().toUpperCase(), model, manufacturer, year);
  }
}
