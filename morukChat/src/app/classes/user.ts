export class User {

  name: string;
  image: string;

  constructor(_name: string, _image?: string) {
    this.name = _name;
    this.image = _image;
  }
}
