import { Controller, Get, Param, Query } from '@nestjs/common';
import { UnsplashService } from './unsplash.service';
import { SearchPhotosDto } from './dto/search-photos.dto';

@Controller('unsplash')
export class UnsplashController {
  constructor(private readonly unsplash: UnsplashService) {}

  @Get('search')
  search(@Query() query: SearchPhotosDto) {
    console.log('SearchPhotosDto:', query);
    return this.unsplash.searchPhotos(query);
  }

  @Get('random')
  random(
    @Query('orientation')
    orientation: 'landscape' | 'portrait' | 'squarish' = 'landscape',
    @Query('query') query?: string,
  ) {
    return this.unsplash.randomPhoto({ query, orientation });
  }

  @Get('photos/:id')
  byId(@Param('id') id: string) {
    return this.unsplash.photoById(id);
  }
}
