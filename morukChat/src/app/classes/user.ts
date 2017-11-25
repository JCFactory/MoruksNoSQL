export class User {

  name: string;
  image: string;
  lastLogIn: Date;

  constructor(_name: string, _lastLogin: Date,_image?: string) {
    this.name = _name;
    this.image = _image;
    this.lastLogIn = _lastLogin;
  }
}
