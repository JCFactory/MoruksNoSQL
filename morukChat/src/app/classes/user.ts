export class User {

  name: string;
  lastLogin: Date;

  constructor(name: string, date: Date) {
    this.name = name;
    this.lastLogin = date;
  }
}
