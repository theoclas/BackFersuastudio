// ============================================================
//  Seed de base de datos — FersuaStudio
//  Ejecutar con: npx ts-node prisma/seed.ts
//  O con: npm run seed
// ============================================================

import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de FersuaStudio...\n');

  // ── Admin por defecto ──
  const adminEmail = 'admin@fersuastudio.com';
  const adminPassword = 'Admin123!';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hash,
        name: 'Fernando Admin',
        role: UserRole.ADMIN,
      },
    });
    console.log(`✅ Admin creado: ${adminEmail} / ${adminPassword}`);
    console.log('   ⚠️  Cambia la contraseña después del primer login!\n');
  } else {
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: UserRole.ADMIN },
    });
    console.log(`ℹ️  Admin ya existe (rol ADMIN asegurado): ${adminEmail}\n`);
  }

  // ── Artista 1: Mac Fly & Mike Bran ──
  const macfly = await prisma.artist.upsert({
    where: { slug: 'macfly-mikebran' },
    update: {},
    create: {
      slug: 'macfly-mikebran',
      name: 'Mac Fly & Mike Bran',
      tagline: 'DJs · Medellín · Electronic',
      bio: 'Mike Bran & Macfly son un dúo de DJs originarios de Medellín, dedicados a llevar energía y buen ritmo a cualquier tipo de escenario. Con una gran versatilidad horaria, ofrecen sets inmersivos cargados de groove y atmósferas electrónicas que conectan con el público desde el primer beat.',
      city: 'Medellín, Colombia',
      whatsapp: '573505209860',
      genres: {
        create: [
          { name: 'House' },
          { name: 'Tech House' },
          { name: 'Minimal Deep Tech' },
          { name: 'Jackin & Funky' },
        ],
      },
      socials: {
        create: [
          { platform: 'instagram', url: 'https://instagram.com/macfly_dj', label: '@macfly_dj' },
          { platform: 'instagram', url: 'https://instagram.com/mikebran_dj', label: '@mikebran_dj' },
        ],
      },
      specs: {
        create: [
          { label: 'DJM V10', category: 'Mixer' },
          { label: 'CDJ 3000', category: 'CDJs' },
        ],
      },
    },
  });
  console.log(`✅ Artista creado/actualizado: ${macfly.name}`);

  // ── Artista 2: Diann & Makinne ──
  const diann = await prisma.artist.upsert({
    where: { slug: 'diann-makinne' },
    update: {},
    create: {
      slug: 'diann-makinne',
      name: 'Diann & Makinne',
      tagline: 'DJs · Productores · Live',
      bio: 'Dúo de DJs y productores con sesiones intensas, cargadas de groove, energía y narrativa, ideales para clubes, festivales y eventos privados.',
      city: 'Medellín, Colombia',
      genres: {
        create: [
          { name: 'Techno' },
          { name: 'Melodic Progressive' },
          { name: 'Live Experience' },
        ],
      },
      socials: {
        create: [
          { platform: 'soundcloud', url: 'https://soundcloud.com/julianwowboyz/diann-b2b-makinne-navidance', label: 'Set promo' },
        ],
      },
    },
  });
  console.log(`✅ Artista creado/actualizado: ${diann.name}`);

  // ── Artista 3: Molina Music ──
  const molina = await prisma.artist.upsert({
    where: { slug: 'molina-music' },
    update: {},
    create: {
      slug: 'molina-music',
      name: 'Molina Music',
      tagline: 'DJ & Producer',
      bio: 'Creando experiencias sonoras únicas que fusionan los ritmos electrónicos del house con composiciones originales.',
      city: 'Colombia',
      genres: {
        create: [
          { name: 'House' },
          { name: 'Deep House' },
          { name: 'Electronic' },
        ],
      },
      socials: {
        create: [
          { platform: 'instagram', url: 'https://www.instagram.com/molina.music_', label: '@molina.music_' },
          { platform: 'soundcloud', url: 'https://soundcloud.com/molinamusic10', label: 'SoundCloud' },
          { platform: 'spotify', url: 'https://open.spotify.com/intl-es/artist/3dabjb8lf5qzW5RLqD61bA', label: 'Spotify' },
        ],
      },
    },
  });
  console.log(`✅ Artista creado/actualizado: ${molina.name}`);

  // ── Enlazar artistas al admin ──
  await prisma.user.update({
    where: { email: adminEmail },
    data: {
      artists: {
        connect: [
          { slug: macfly.slug },
          { slug: diann.slug },
          { slug: molina.slug },
        ]
      }
    }
  });
  console.log(`✅ Artistas enlazados exitosamente al administrador: ${adminEmail}`);

  console.log('\n🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
