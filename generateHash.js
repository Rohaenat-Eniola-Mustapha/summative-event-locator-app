const bcrypt = require('bcrypt');

async function generateHash(password) {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    console.error('Error generating hash:', error);
    return null;
  }
}

async function main() {
  const password = 'mysecretpassword';
  const hashedPassword = await generateHash(password);

  if (hashedPassword) {
    console.log('Hashed password:', hashedPassword);
  }
}

main();