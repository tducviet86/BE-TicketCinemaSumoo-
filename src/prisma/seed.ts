import 'dotenv/config';
import {
  PrismaClient,
  Prisma,
  SeatType,
  UserRole,
  PaymentMethod,
  PaymentStatus,
  Movie,
  Showtime,
  DayOfWeek,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { Cinema } from '@prisma/client';
import { Room } from '@prisma/client';
import { BookingStatus } from '@prisma/client';
import { Booking } from '@prisma/client';
const prisma = new PrismaClient();

function ytSearch(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function poster(title: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(title)}/400/600`;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function createDateAtHour(dayOffset: number, hour: number, minute = 0) {
  const date = addDays(new Date(), dayOffset);

  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

type MovieSeed = {
  title: string;
  description: string;
  duration: number;
  releaseDate: Date;
  language: string;
  trailerUrl: string;
  posterUrl: string;
  rating: number;
  genres: string[];
};

async function main() {
  console.log('🌱 START SEED');

  const password = await bcrypt.hash('123456', 10);

  // ==========================
  // USERS
  // ==========================

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@gmail.com',
    },
    update: {},
    create: {
      email: 'admin@gmail.com',
      password,
      name: 'Administrator',
      role: UserRole.ADMIN,
    },
  });

  const users: User[] = [];

  const userEmails = [
    'user@gmail.com',
    'user2@gmail.com',
    'user3@gmail.com',
    'user4@gmail.com',
    'user5@gmail.com',
  ];

  for (const email of userEmails) {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password,
        name: email.split('@')[0],
        role: UserRole.USER,
      },
    });

    users.push(user);
  }

  console.log('✅ USERS');

  // ==========================
  // GENRES
  // ==========================

  const genreMap = {
    hai: await prisma.genre.upsert({
      where: { name: 'Hài' },
      update: {},
      create: { name: 'Hài' },
    }),

    tinhCam: await prisma.genre.upsert({
      where: { name: 'Tình cảm' },
      update: {},
      create: { name: 'Tình cảm' },
    }),

    hanhDong: await prisma.genre.upsert({
      where: { name: 'Hành động' },
      update: {},
      create: { name: 'Hành động' },
    }),

    giaDinh: await prisma.genre.upsert({
      where: { name: 'Gia đình' },
      update: {},
      create: { name: 'Gia đình' },
    }),

    kinhDi: await prisma.genre.upsert({
      where: { name: 'Kinh dị' },
      update: {},
      create: { name: 'Kinh dị' },
    }),

    vienTuong: await prisma.genre.upsert({
      where: { name: 'Viễn tưởng' },
      update: {},
      create: { name: 'Viễn tưởng' },
    }),

    hoatHinh: await prisma.genre.upsert({
      where: { name: 'Hoạt hình' },
      update: {},
      create: { name: 'Hoạt hình' },
    }),

    phieuLuu: await prisma.genre.upsert({
      where: { name: 'Phiêu lưu' },
      update: {},
      create: { name: 'Phiêu lưu' },
    }),

    tamLy: await prisma.genre.upsert({
      where: { name: 'Tâm lý' },
      update: {},
      create: { name: 'Tâm lý' },
    }),

    hinhSu: await prisma.genre.upsert({
      where: { name: 'Hình sự' },
      update: {},
      create: { name: 'Hình sự' },
    }),

    biAn: await prisma.genre.upsert({
      where: { name: 'Bí ẩn' },
      update: {},
      create: { name: 'Bí ẩn' },
    }),
  };

  console.log('✅ GENRES');
  // ==========================
  // CINEMAS
  // ==========================

  const cinemaSeeds = [
    {
      name: 'CGV Vincom Đà Nẵng',
      address: '910A Ngô Quyền, Sơn Trà',
      city: 'Đà Nẵng',
    },
    {
      name: 'CGV Mega Market Đà Nẵng',
      address: 'Cách Mạng Tháng 8',
      city: 'Đà Nẵng',
    },
    {
      name: 'CGV Vincom Plaza Đà Nẵng',
      address: '255 Hùng Vương',
      city: 'Đà Nẵng',
    },
  ];

  const cinemas: Cinema[] = [];

  for (const cinemaData of cinemaSeeds) {
    const cinema = await prisma.cinema.create({
      data: cinemaData,
    });

    cinemas.push(cinema);
  }

  console.log('✅ CINEMAS');

  // ==========================
  // ROOMS
  // ==========================

  const rooms: Room[] = [];

  for (const cinema of cinemas) {
    const roomNames = ['Phòng 1', 'Phòng 2', 'Phòng 3', 'Gold Class'];

    for (const roomName of roomNames) {
      const room = await prisma.room.create({
        data: {
          name: roomName,
          cinemaId: cinema.id,
        },
      });

      rooms.push(room);
    }
  }

  console.log('✅ ROOMS');

  // ==========================
  // SEATS
  // ==========================

  // ==========================
  // SEATS
  // ==========================

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  for (const room of rooms) {
    const seats: Prisma.SeatCreateManyInput[] = [];

    for (const row of rows) {
      for (let number = 1; number <= 10; number++) {
        let type: SeatType;
        let price: number;

        // Couple
        if (row === 'H') {
          type = SeatType.COUPLE;
          price = 220000;
        }
        // VIP
        else if (row === 'D' || row === 'E') {
          type = SeatType.VIP;
          price = 120000;
        }
        // Normal
        else {
          type = SeatType.NORMAL;
          price = 90000;
        }

        seats.push({
          code: `${row}${number}`,
          row,
          number,
          type,
          price,
          roomId: room.id,
        });
      }
    }

    await prisma.seat.createMany({
      data: seats,
    });
  }

  console.log('✅ SEATS');

  const allSeats = await prisma.seat.findMany();

  console.log(`🎟 Total Seats Created: ${allSeats.length}`);

  // ==========================
  // PRICE RULE
  // ==========================

  const priceTable: Record<string, Record<SeatType, number>> = {
    MONDAY: {
      NORMAL: 90000,
      VIP: 120000,
      COUPLE: 220000,
    },
    TUESDAY: {
      NORMAL: 90000,
      VIP: 120000,
      COUPLE: 220000,
    },
    WEDNESDAY: {
      NORMAL: 90000,
      VIP: 120000,
      COUPLE: 220000,
    },
    THURSDAY: {
      NORMAL: 90000,
      VIP: 120000,
      COUPLE: 220000,
    },
    FRIDAY: {
      NORMAL: 100000,
      VIP: 130000,
      COUPLE: 240000,
    },
    SATURDAY: {
      NORMAL: 110000,
      VIP: 140000,
      COUPLE: 260000,
    },
    SUNDAY: {
      NORMAL: 110000,
      VIP: 140000,
      COUPLE: 260000,
    },
  };
  const rules: Prisma.PriceRuleCreateManyInput[] = [];

  for (const day of Object.keys(priceTable)) {
    for (const seat of Object.keys(priceTable[day]) as SeatType[]) {
      rules.push({
        name: `${day}-${seat}`,
        dayOfWeek: day as DayOfWeek,
        seatType: seat,
        price: priceTable[day][seat],
      });
    }
  }

  await prisma.priceRule.createMany({
    data: rules,
  });
  // ==========================
  // MOVIES - NOW SHOWING
  // ==========================

  const nowShowingMovies: MovieSeed[] = [
    {
      title: 'Mai',
      description:
        'Một câu chuyện tình cảm nhiều cảm xúc, xoay quanh những tổn thương và khát khao được yêu thương.',
      duration: 131,
      releaseDate: new Date('2024-02-10'),
      language: 'Tiếng Việt',
      trailerUrl: ytSearch('Mai official trailer'),
      posterUrl: poster('Mai'),
      rating: 8.5,
      genres: [genreMap.tinhCam.id, genreMap.tamLy.id],
    },

    {
      title: 'Nhà bà Nữ',
      description: 'Bộ phim khai thác những xung đột gia đình và khoảng cách thế hệ.',
      duration: 102,
      releaseDate: new Date('2023-01-22'),
      language: 'Tiếng Việt',
      trailerUrl: ytSearch('Nhà bà Nữ official trailer'),
      posterUrl: poster('Nhà bà Nữ'),
      rating: 7.8,
      genres: [genreMap.hai.id, genreMap.giaDinh.id],
    },

    {
      title: 'Lật mặt 6',
      description: 'Một nhóm bạn bị cuốn vào chuỗi biến cố sau tấm vé số đổi đời.',
      duration: 132,
      releaseDate: new Date('2023-04-28'),
      language: 'Tiếng Việt',
      trailerUrl: ytSearch('Lật mặt 6 trailer'),
      posterUrl: poster('Lật mặt 6'),
      rating: 7.5,
      genres: [genreMap.hanhDong.id, genreMap.tamLy.id],
    },

    {
      title: 'Bố già',
      description: 'Tình cha con và những vết nứt cảm xúc trong cuộc sống đô thị.',
      duration: 128,
      releaseDate: new Date('2021-03-12'),
      language: 'Tiếng Việt',
      trailerUrl: ytSearch('Bố già trailer'),
      posterUrl: poster('Bố già'),
      rating: 8.2,
      genres: [genreMap.giaDinh.id, genreMap.tamLy.id],
    },

    {
      title: 'Hai Phượng',
      description: 'Người mẹ đơn thân giải cứu con gái khỏi đường dây bắt cóc.',
      duration: 98,
      releaseDate: new Date('2019-02-22'),
      language: 'Tiếng Việt',
      trailerUrl: ytSearch('Hai Phượng trailer'),
      posterUrl: poster('Hai Phượng'),
      rating: 7.4,
      genres: [genreMap.hanhDong.id],
    },

    {
      title: 'Mắt biếc',
      description: 'Tình yêu đơn phương kéo dài nhiều năm đầy day dứt.',
      duration: 117,
      releaseDate: new Date('2019-12-20'),
      language: 'Tiếng Việt',
      trailerUrl: ytSearch('Mắt biếc trailer'),
      posterUrl: poster('Mắt biếc'),
      rating: 8.0,
      genres: [genreMap.tinhCam.id, genreMap.tamLy.id],
    },
  ];

  console.log('✅ CINEMA STRUCTURE READY');
  // ==========================
  // NOW SHOWING (6 PHIM CÒN LẠI)
  // ==========================

  nowShowingMovies.push(
    {
      title: 'Em chưa 18',
      description: 'Một câu chuyện tình cảm hài hước và đầy bất ngờ.',
      duration: 100,
      releaseDate: new Date('2017-04-28'),
      language: 'Tiếng Việt',
      trailerUrl: ytSearch('Em chưa 18 trailer'),
      posterUrl: poster('Em chưa 18'),
      rating: 7.6,
      genres: [genreMap.hai.id, genreMap.tinhCam.id],
    },

    {
      title: 'Ròm',
      description: 'Cuộc sống khắc nghiệt của những đứa trẻ đường phố.',
      duration: 95,
      releaseDate: new Date('2020-09-25'),
      language: 'Tiếng Việt',
      trailerUrl: ytSearch('Ròm trailer'),
      posterUrl: poster('Ròm'),
      rating: 7.9,
      genres: [genreMap.tamLy.id],
    },

    {
      title: 'Chị chị em em',
      description: 'Những bí mật đằng sau các mối quan hệ phức tạp.',
      duration: 110,
      releaseDate: new Date('2019-12-20'),
      language: 'Tiếng Việt',
      trailerUrl: ytSearch('Chị chị em em trailer'),
      posterUrl: poster('Chị chị em em'),
      rating: 7.0,
      genres: [genreMap.tinhCam.id, genreMap.tamLy.id],
    },

    {
      title: 'Siêu lừa gặp siêu lầy',
      description: 'Hành trình lừa đảo đầy hài hước và bất ngờ.',
      duration: 115,
      releaseDate: new Date('2023-03-03'),
      language: 'Tiếng Việt',
      trailerUrl: ytSearch('Siêu lừa gặp siêu lầy trailer'),
      posterUrl: poster('Siêu lừa gặp siêu lầy'),
      rating: 7.2,
      genres: [genreMap.hai.id],
    },

    {
      title: 'Quỷ cẩu',
      description: 'Kinh dị dân gian Việt Nam với nhiều truyền thuyết đáng sợ.',
      duration: 108,
      releaseDate: new Date('2023-12-22'),
      language: 'Tiếng Việt',
      trailerUrl: ytSearch('Quỷ cẩu trailer'),
      posterUrl: poster('Quỷ cẩu'),
      rating: 7.1,
      genres: [genreMap.kinhDi.id],
    },

    {
      title: 'Đào, phở và piano',
      description: 'Bộ phim lịch sử giàu cảm xúc.',
      duration: 103,
      releaseDate: new Date('2024-02-10'),
      language: 'Tiếng Việt',
      trailerUrl: ytSearch('Đào phở và piano trailer'),
      posterUrl: poster('Đào, phở và piano'),
      rating: 7.7,
      genres: [genreMap.tinhCam.id, genreMap.tamLy.id],
    },
  );

  // ==========================
  // UPCOMING MOVIES
  // ==========================

  const upcomingMovies: MovieSeed[] = [
    {
      title: 'Deadpool 3',
      description: 'Siêu anh hùng lầy lội trở lại.',
      duration: 120,
      releaseDate: addDays(new Date(), 30),
      language: 'English',
      trailerUrl: ytSearch('Deadpool 3 trailer'),
      posterUrl: poster('Deadpool 3'),
      rating: 8.4,
      genres: [genreMap.hanhDong.id, genreMap.hai.id, genreMap.vienTuong.id],
    },

    {
      title: 'Avengers Secret Wars',
      description: 'Cuộc chiến đa vũ trụ lớn nhất MCU.',
      duration: 150,
      releaseDate: addDays(new Date(), 60),
      language: 'English',
      trailerUrl: ytSearch('Avengers Secret Wars'),
      posterUrl: poster('Avengers Secret Wars'),
      rating: 9.0,
      genres: [genreMap.hanhDong.id, genreMap.vienTuong.id],
    },

    {
      title: 'Avatar 3',
      description: 'Hành trình mới tại Pandora.',
      duration: 180,
      releaseDate: addDays(new Date(), 90),
      language: 'English',
      trailerUrl: ytSearch('Avatar 3'),
      posterUrl: poster('Avatar 3'),
      rating: 8.8,
      genres: [genreMap.vienTuong.id, genreMap.phieuLuu.id],
    },

    {
      title: 'Joker 2',
      description: 'Thế giới méo mó của Joker.',
      duration: 130,
      releaseDate: addDays(new Date(), 120),
      language: 'English',
      trailerUrl: ytSearch('Joker 2'),
      posterUrl: poster('Joker 2'),
      rating: 8.3,
      genres: [genreMap.tamLy.id],
    },

    {
      title: 'Kung Fu Panda 4',
      description: 'Po tiếp tục hành trình mới.',
      duration: 100,
      releaseDate: addDays(new Date(), 45),
      language: 'English',
      trailerUrl: ytSearch('Kung Fu Panda 4'),
      posterUrl: poster('Kung Fu Panda 4'),
      rating: 8.1,
      genres: [genreMap.hoatHinh.id, genreMap.hai.id],
    },

    {
      title: 'Spider-Man 4',
      description: 'Người Nhện trở lại.',
      duration: 135,
      releaseDate: addDays(new Date(), 70),
      language: 'English',
      trailerUrl: ytSearch('Spider-Man 4'),
      posterUrl: poster('Spider-Man 4'),
      rating: 8.7,
      genres: [genreMap.hanhDong.id, genreMap.vienTuong.id],
    },

    {
      title: 'The Batman 2',
      description: 'Gotham chìm trong bóng tối.',
      duration: 145,
      releaseDate: addDays(new Date(), 80),
      language: 'English',
      trailerUrl: ytSearch('The Batman 2'),
      posterUrl: poster('The Batman 2'),
      rating: 8.6,
      genres: [genreMap.hanhDong.id, genreMap.biAn.id],
    },

    {
      title: 'Dune Part 3',
      description: 'Cuộc chiến sa mạc tiếp tục.',
      duration: 155,
      releaseDate: addDays(new Date(), 110),
      language: 'English',
      trailerUrl: ytSearch('Dune Part 3'),
      posterUrl: poster('Dune Part 3'),
      rating: 8.9,
      genres: [genreMap.vienTuong.id, genreMap.phieuLuu.id],
    },

    {
      title: 'Transformers One',
      description: 'Nguồn gốc Optimus Prime.',
      duration: 110,
      releaseDate: addDays(new Date(), 55),
      language: 'English',
      trailerUrl: ytSearch('Transformers One'),
      posterUrl: poster('Transformers One'),
      rating: 7.9,
      genres: [genreMap.hanhDong.id, genreMap.vienTuong.id],
    },

    {
      title: 'Inside Out 2',
      description: 'Những cảm xúc mới của Riley.',
      duration: 105,
      releaseDate: addDays(new Date(), 40),
      language: 'English',
      trailerUrl: ytSearch('Inside Out 2'),
      posterUrl: poster('Inside Out 2'),
      rating: 8.5,
      genres: [genreMap.hoatHinh.id, genreMap.giaDinh.id],
    },
  ];

  // ==========================
  // CREATE MOVIES
  // ==========================

  const createdNowShowing: Movie[] = [];

  for (const movie of nowShowingMovies) {
    const created = await prisma.movie.create({
      data: {
        title: movie.title,
        description: movie.description,
        duration: movie.duration,
        releaseDate: movie.releaseDate,
        language: movie.language,
        trailerUrl: movie.trailerUrl,
        posterUrl: movie.posterUrl,
        rating: movie.rating,

        genres: {
          create: movie.genres.map((genreId) => ({
            genreId,
          })),
        },
      },
    });

    createdNowShowing.push(created);
  }

  for (const movie of upcomingMovies) {
    await prisma.movie.create({
      data: {
        title: movie.title,
        description: movie.description,
        duration: movie.duration,
        releaseDate: movie.releaseDate,
        language: movie.language,
        trailerUrl: movie.trailerUrl,
        posterUrl: movie.posterUrl,
        rating: movie.rating,

        genres: {
          create: movie.genres.map((genreId) => ({
            genreId,
          })),
        },
      },
    });
  }

  console.log('✅ MOVIES');

  // ==========================
  // SHOWTIMES
  // ==========================

  const showtimes: Showtime[] = [];

  // ==========================
  // SHOWTIME TEMPLATE
  // ==========================

  const roomSchedules: Record<string, { hour: number; minute: number }[]> = {
    'Phòng 1': [
      { hour: 9, minute: 0 },
      { hour: 11, minute: 45 },
      { hour: 14, minute: 30 },
      { hour: 17, minute: 15 },
      { hour: 20, minute: 0 },
    ],

    'Phòng 2': [
      { hour: 10, minute: 15 },
      { hour: 13, minute: 15 },
      { hour: 16, minute: 15 },
      { hour: 19, minute: 15 },
    ],

    'Phòng 3': [
      { hour: 12, minute: 0 },
      { hour: 15, minute: 0 },
      { hour: 18, minute: 0 },
    ],

    'Gold Class': [
      { hour: 18, minute: 30 },
      { hour: 21, minute: 0 },
    ],
  };

  // ==========================
  // CREATE SHOWTIMES
  // ==========================

  for (const movie of createdNowShowing) {
    // khoảng 35% phim được chiếu Gold
    const hasGold = Math.random() < 0.35;

    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      for (const cinema of cinemas) {
        const cinemaRooms = rooms.filter((room) => room.cinemaId === cinema.id);

        for (const room of cinemaRooms) {
          // --------------------------
          // Gold chỉ có một số phim
          // --------------------------
          if (room.name === 'Gold Class' && !hasGold) {
            continue;
          }

          // --------------------------
          // Xác suất mỗi phòng được chọn
          // giống CGV hơn
          // --------------------------

          let chance = 1;

          switch (room.name) {
            case 'Phòng 1':
              chance = 0.95;
              break;

            case 'Phòng 2':
              chance = 0.7;
              break;

            case 'Phòng 3':
              chance = 0.45;
              break;

            case 'Gold Class':
              chance = 0.35;
              break;
          }

          if (Math.random() > chance) {
            continue;
          }

          const schedules = roomSchedules[room.name];

          // mỗi phòng chỉ lấy 2-4 suất/ngày
          const showCount = Math.min(schedules.length, Math.floor(Math.random() * 3) + 2);

          const selectedSchedules = [...schedules]
            .sort(() => Math.random() - 0.5)
            .slice(0, showCount)
            .sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));

          for (const schedule of selectedSchedules) {
            const startTime = createDateAtHour(dayOffset, schedule.hour, schedule.minute);

            const endTime = new Date(startTime.getTime() + movie.duration * 60 * 1000);

            const showtime = await prisma.showtime.create({
              data: {
                movieId: movie.id,
                roomId: room.id,
                startTime,
                endTime,
              },
            });
            showtimes.push(showtime);
          }
        }
      }
    }
  }

  console.log(`🎬 SHOWTIMES CREATED: ${showtimes.length}`);

  // ==========================
  // DEMO STATISTICS
  // ==========================

  const allShowtimes = await prisma.showtime.findMany({
    include: {
      room: {
        include: {
          cinema: true,
        },
      },
    },
  });

  console.log(`🎥 TOTAL SHOWTIMES: ${allShowtimes.length}`);

  const roomGroups: Record<string, number> = allShowtimes.reduce(
    (acc, item) => {
      const cinemaName = item.room.cinema.name;

      acc[cinemaName] = (acc[cinemaName] || 0) + 1;

      return acc;
    },
    {} as Record<string, number>,
  );

  console.log(roomGroups);

  // ==========================
  // SAMPLE QUERY TEST
  // ==========================

  const movieWithShowtimes = await prisma.movie.findFirst({
    include: {
      genres: {
        include: {
          genre: true,
        },
      },

      showtimes: {
        include: {
          room: {
            include: {
              cinema: true,
            },
          },
        },

        orderBy: {
          startTime: 'asc',
        },
      },
    },
  });

  if (movieWithShowtimes) {
    console.log(`🎞 TEST MOVIE: ${movieWithShowtimes.title}`);

    console.log(`🎞 SHOWTIMES: ${movieWithShowtimes.showtimes.length}`);
  }
  // ==========================
  // BOOKINGS
  // ==========================

  const createdBookings: Booking[] = [];

  const availableShowtimes = await prisma.showtime.findMany({
    take: 50,
  });

  for (let i = 0; i < 20; i++) {
    const user = randomItem(users);

    const showtime = randomItem(availableShowtimes);

    const roomSeats = await prisma.seat.findMany({
      where: {
        roomId: showtime.roomId,
      },
      take: 100,
    });
    const bookedSeatIds = await prisma.bookingSeat.findMany({
      where: {
        booking: {
          showtimeId: showtime.id,
        },
      },
      select: {
        seatId: true,
      },
    });

    const booked = bookedSeatIds.map((i) => i.seatId);

    const availableSeats = roomSeats.filter((s) => !booked.includes(s.id));

    if (availableSeats.length === 0) {
      continue;
    }
    const selectedSeats = availableSeats
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 4) + 1);

    let totalPrice = 0;

    for (const seat of selectedSeats) {
      switch (seat.type) {
        case SeatType.NORMAL:
          totalPrice += 90000;
          break;

        case SeatType.VIP:
          totalPrice += 120000;
          break;

        case SeatType.COUPLE:
          totalPrice += 220000;
          break;
      }
    }

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        showtimeId: showtime.id,
        totalPrice,
        status: BookingStatus.PAID,
        seats: {
          create: selectedSeats.map((seat) => ({
            seatId: seat.id,
          })),
        },
      },
    });

    createdBookings.push(booking);
  }

  console.log(`🎟 BOOKINGS CREATED: ${createdBookings.length}`);

  // ==========================
  // PAYMENTS
  // ==========================

  const paymentMethods = [
    PaymentMethod.CASH,
    PaymentMethod.MOMO,
    PaymentMethod.VNPAY,
    PaymentMethod.STRIPE,
  ];

  for (const booking of createdBookings) {
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: booking.totalPrice,

        method: randomItem(paymentMethods),

        status: PaymentStatus.SUCCESS,

        transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      },
    });
  }

  console.log('💳 PAYMENTS CREATED');

  // ==========================
  // TICKETS
  // ==========================

  for (const booking of createdBookings) {
    await prisma.ticket.create({
      data: {
        bookingId: booking.id,

        qrCode: `SUMOO-${booking.id}`,

        checkedIn: Math.random() > 0.5,
      },
    });
  }

  console.log('🎫 TICKETS CREATED');

  // ==========================
  // FINAL DASHBOARD DATA
  // ==========================

  const totalUsers = await prisma.user.count();

  const totalMovies = await prisma.movie.count();

  const totalShowtimes = await prisma.showtime.count();

  const totalBookings = await prisma.booking.count();

  const totalTickets = await prisma.ticket.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
  });

  console.log('=========================');
  console.log('📊 DASHBOARD SUMMARY');
  console.log('=========================');

  console.log(`👤 Users: ${totalUsers}`);

  console.log(`🎬 Movies: ${totalMovies}`);

  console.log(`🕒 Showtimes: ${totalShowtimes}`);

  console.log(`🎟 Bookings: ${totalBookings}`);

  console.log(`🎫 Tickets: ${totalTickets}`);

  console.log(`💰 Revenue: ${totalRevenue._sum.amount ?? 0}`);

  console.log('=========================');

  console.log('✅ SEED SUCCESS');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
