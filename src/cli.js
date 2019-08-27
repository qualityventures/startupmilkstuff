/* eslint-disable no-console */

import { MONGO } from 'data/config.private';
import { validatePassword, validateEmail } from 'helpers/validators';
import User from 'models/user';
import Products from 'models/products';
import Cart from 'models/cart';
import Order from 'models/order';
import mongoose from 'mongoose';
import readline from 'readline';
import bcrypt from 'bcryptjs';

mongoose.connect(MONGO.url, MONGO.options).then(() => {

}).catch((err) => {
  console.error('Please check your MongoDB connection parameters');
  process.exit(1);
});

export function init() {
  User.init()
    .then(() => {
      console.log('User init completed');
      return Products.init();
    })
    .then(() => {
      console.log('Product init completed');
      return Cart.init();
    })
    .then(() => {
      console.log('Cart init completed');
      return Order.init();
    })
    .then(() => {
      console.log('Order init completed');
      process.exit(1);
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
}

export function makeAdmin() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Email: ', (email) => {
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          throw new Error('User not found');
        }

        if (user.role === 'admin') {
          throw new Error('User is already an admin');
        }

        user.role = 'admin';
        return user.save();
      })
      .then((user) => {
        console.log('done');
        process.exit(1);
      })
      .catch((e) => {
        console.log(e);
        process.exit(1);
      });
  });
}

export function changePassword() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Email: ', (email) => {
    rl.question('Password: ', (pass1) => {
      rl.question('Repeat password: ', (pass2) => {
        User.findOne({ email })
          .then((user) => {
            if (!user) {
              throw new Error('User not found');
            }

            if (pass1 !== pass2) {
              throw new Error('Password doesnt match');
            }

            const pass_validation = validatePassword(pass1);

            if (pass_validation !== true) {
              throw new Error(pass_validation);
            }

            user.hashed_password = bcrypt.hashSync(pass1, 8);
            return user.save();
          })
          .then((user) => {
            console.log('done');
            process.exit(1);
          })
          .catch((e) => {
            console.log(e);
            process.exit(1);
          });
      });
    });
  });
}

export function createAdminUser() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Email: ', (email) => {
    rl.question('Password: ', (pass1) => {
      rl.question('Repeat password: ', (pass2) => {
        if (pass1 !== pass2) {
          console.log('passwords do not match');
          process.exit(1);
        }

        const pass_validation = validatePassword(pass1);
        const email_validation = validateEmail(email);

        if (pass_validation !== true) {
          console.log(pass_validation);
          process.exit(1);
        }

        if (email_validation !== true) {
          console.log(email_validation);
          process.exit(1);
        }

        const hashed_password = bcrypt.hashSync(pass1, 8);

        User.create({ email, role: 'admin', hashed_password }, (err, user) => {
          if (err) {
            console.log(err);
          } else {
            console.log('User have been added successfully');
          }

          process.exit(1);
        }); 
      });
    });
  });
}
