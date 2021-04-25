import { IGroupOld, IFacultyOld } from '../src/constants';

export class Group {
  public id: number;
  public name: string;
  constructor(obj: IGroupOld) {
    this.id = obj.IdGroup;
    this.name = obj.Group;
  }
}

export class Faculty {
  public id: number;
  public name: string;
  public fullName: string;
  public groups: Group[];
  constructor(obj: IFacultyOld) {
    this.id = obj.IdFaculty;
    this.name = obj.FacultyAbbr;
    this.fullName = obj.FacultyName;
    this.groups = [];
  }
}
