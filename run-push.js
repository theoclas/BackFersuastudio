require('dotenv').config();
require('child_process').execSync('npx prisma db push', {stdio: 'inherit', env: { ...process.env }});
