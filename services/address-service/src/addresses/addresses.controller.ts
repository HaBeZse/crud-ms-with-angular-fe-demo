import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBasicAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AddressDto } from './dto/address.dto';
import { UpsertAddressDto } from './dto/upsert-address.dto';
import { AddressesService } from './addresses.service';
import { BasicAuthGuard } from 'src/common/guards/basic-auth.guard';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('addresses')
@ApiBasicAuth()
@UseGuards(BasicAuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get(':studentId')
  @ApiOkResponse({ type: AddressDto })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid Auth',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Address Not Found',
    type: ErrorResponseDto,
  })
  get(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
  ): Promise<AddressDto> {
    return this.addressesService.get(studentId);
  }

  @Put(':studentId')
  @ApiOkResponse({ type: AddressDto })
  @ApiBadRequestResponse({
    description: 'Validation Error',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid Auth',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Address Not Found',
    type: ErrorResponseDto,
  })
  upsert(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
    @Body() dto: UpsertAddressDto,
  ): Promise<AddressDto> {
    return this.addressesService.upsert(studentId, dto);
  }
}
