import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('conversation')
@UseGuards(AuthGuard('jwt'))
export class ConversationController {}
