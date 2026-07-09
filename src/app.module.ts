import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { GenresModule } from './modules/genres/genres.module';
import { MoviesModule } from './modules/movies/movies.module';
import { CinemasModule } from './modules/cinemas/cinemas.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { SeatsModule } from './modules/seats/seats.module';
import { ShowtimesModule } from './modules/showtimes/showtimes.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { TicketsModule } from './modules/tickets/tickets.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    GenresModule,
    MoviesModule,
    CinemasModule,
    RoomsModule,
    SeatsModule,
    ShowtimesModule,
    BookingsModule,
    PaymentsModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
