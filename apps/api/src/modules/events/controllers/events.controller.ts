import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateEventDto } from '../dto/create-event.dto';
import { EventsService } from '../services/events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Post()
  create(@Body() payload: CreateEventDto) {
    return {
      message: 'Event ingestion scaffold endpoint ready.',
      payload,
    };
  }
}
