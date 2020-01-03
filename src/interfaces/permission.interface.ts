import { Possession } from 'src/enums/possession.enum';

export interface PermissionInterface {
  resource: string;
  possession: Possession;
}
