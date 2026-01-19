import {
  Controller,
  Get,
  NotImplementedException,
  Body,
  Put,
  Param,
  ParseUUIDPipe,
  UseGuards,
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
import { AddressesService } from './addresses.service';
import { BasicAuthGuard } from '../common/guards/basic-auth.guard';

@ApiTags('addresses')
@ApiBasicAuth()
@UseGuards(BasicAuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get(':studentId')
  @ApiOkResponse({ type: AddressDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Auth' })
  @ApiNotFoundResponse({ description: 'Address Not Found' })
  get(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
  ): Promise<AddressDto> {
    return this.addressesService.get(studentId);
  }

  @Put(':studentId')
  @ApiOkResponse({ type: AddressDto })
  @ApiBadRequestResponse({ description: 'Validation Error' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Auth' })
  upsert(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
    @Body() dto: UpsertAddressDto,
  ): Promise<AddressDto> {
    return this.addressesService.upsert(studentId, dto);
  }
}
