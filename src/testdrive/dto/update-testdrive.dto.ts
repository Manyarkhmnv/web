import { PartialType } from "@nestjs/mapped-types";
import { CreateTestdriveDto } from "./create-testdrive.dto";

export class UpdateTestdriveDto extends PartialType(CreateTestdriveDto) {
  instrumentType?: string;
  /**
   * eslint-disable-next-line @typescript-eslint/ban-ts-comment
   * @ts-expect-error
   */
  date?: string;
  time?: string;
  name?: string;
  phone?: string;
  comments?: string;
  userId?: number;
}
