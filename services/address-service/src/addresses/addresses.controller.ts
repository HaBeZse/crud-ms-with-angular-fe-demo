import {
  Controller,
  Get,
  NotImplementedException,
  Body,
  Put,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBasicAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AddressDto } from './dto/address.dto';
import { UpsertAddressDto } from './dto/upsert-address.dto';

@ApiTags('addresses')
@ApiBasicAuth()
@Controller('addresses')
export class AddressesController {
  @Get(':studentId')
  @ApiOkResponse({ type: AddressDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Auth' })
  @ApiNotFoundResponse({ description: 'Address Not Found' })
  get(@Param('studentId') studentId: string): Promise<AddressDto> {
    throw new NotImplementedException();
  }

  @Put(':studentId')
  @ApiOkResponse({ type: AddressDto })
  @ApiBadRequestResponse({ description: 'Validation Error' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Auth' })
  upsert(
    @Param('studentId') studentId: string,
    @Body() dto: UpsertAddressDto,
  ): Promise<AddressDto> {
    throw new NotImplementedException();
  }
}
