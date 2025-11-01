require('dotenv').config();
const prisma = require('./db');

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      password: 'password123',
      full_name: 'Nguyễn Văn A',
      current_level: 'beginner'
    }
  });

  console.log('✅ Created user:', user1.user_id);

  // Create sample roadmap
  const roadmap = await prisma.roadmap.create({
    data: {
      title: 'Web Development Path',
      description: 'Learn web development from scratch',
      status: 'published'
    }
  });

  console.log('✅ Created roadmap:', roadmap.roadmap_id);

  // Create sample modules
  const module1 = await prisma.module.create({
    data: {
      roadmap_id: roadmap.roadmap_id,
      title: 'HTML Basics',
      description: 'Learn HTML fundamentals',
      order: 1
    }
  });

  const module2 = await prisma.module.create({
    data: {
      roadmap_id: roadmap.roadmap_id,
      title: 'CSS Styling',
      description: 'Master CSS for styling',
      order: 2
    }
  });

  console.log('✅ Created modules');

  // Link user to roadmap
  await prisma.userRoadmap.create({
    data: {
      user_id: user1.user_id,
      roadmap_id: roadmap.roadmap_id,
      status: 'started'
    }
  });

  console.log('✅ Linked user to roadmap');

  // Create sample certificate
  const cert = await prisma.certificate.create({
    data: {
      user_id: user1.user_id,
      title: 'JavaScript Certification',
      issuer: 'Coursera',
      issue_date: new Date(),
      expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }
  });

  console.log('✅ Created certificate:', cert.certificate_id);

  console.log('🎉 Database seeding completed!');
}

main()
  .catch(e => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
